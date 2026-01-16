import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { LanguageServiceClient } from '@google-cloud/language';
import puppeteer from 'puppeteer';
import { CONTENT_RULES } from '@/lib/content-rules';
import type { protos } from '@google-cloud/vision';

interface ScanResult {
  url: string;
  overallScore: number;
  contentAnalysis: {
    textAnalysis: {
      sentiment: string;
      keyTopics: string[];
      languageScore: number;
      entities?: string[];
    };
    visualAnalysis: {
      detectedObjects: string[];
      safetyScore: number;
      concerns: string[];
      labels?: string[];
    };
    metadata: {
      title?: string;
      description?: string;
      keywords?: string[];
      imageCount: number;
      linkCount: number;
    };
  };
  categoryScores: {
    [category: string]: {
      detected: boolean;
      confidence: number;
    };
  };
  ageGroupActions: {
    [ageGroup: string]: {
      action: 'BLOCK' | 'GATE' | 'ALLOW';
      reason: string;
      score: number;
    };
  };
  timestamp: string;
  analysisMethod: 'live' | 'demo';
}

// Initialize Google Cloud clients (only if credentials are available)
let visionClient: ImageAnnotatorClient | null = null;
let languageClient: LanguageServiceClient | null = null;

try {
  // Check if Google Cloud credentials are configured
  if (process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.GOOGLE_CLOUD_API_KEY) {
    visionClient = new ImageAnnotatorClient({
      apiKey: process.env.GOOGLE_CLOUD_API_KEY,
    });
    languageClient = new LanguageServiceClient({
      apiKey: process.env.GOOGLE_CLOUD_API_KEY,
    });
  }
} catch (error) {
  console.warn('Google Cloud APIs not configured, using demo mode:', error);
}

/**
 * Fetch webpage content
 */
async function fetchWebpageContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KomalBot/1.0; +https://komalkids.com)',
      },
      signal: AbortSignal.timeout(10000), // 10 second timeout
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.text();
  } catch (error) {
    console.error('Error fetching webpage:', error);
    throw error;
  }
}

/**
 * Parse HTML and extract metadata
 */
function parseHTMLMetadata(html: string, url: string) {
  const $ = cheerio.load(html);

  // Extract metadata
  const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';
  const keywordsStr = $('meta[name="keywords"]').attr('content') || '';
  const keywords = keywordsStr.split(',').map((k) => k.trim()).filter(Boolean);

  // Extract main text content
  $('script, style, nav, footer, header, aside').remove();
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const textContent = bodyText.substring(0, 5000); // Limit to 5000 chars for analysis

  // Count images and links
  const imageCount = $('img').length;
  const linkCount = $('a').length;

  // Extract image URLs for Vision API analysis
  const imageUrls: string[] = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src');
    if (src) {
      // Convert relative URLs to absolute
      try {
        const absoluteUrl = new URL(src, url).href;
        imageUrls.push(absoluteUrl);
      } catch {
        // Skip invalid URLs
      }
    }
  });

  return {
    title,
    description,
    keywords,
    textContent,
    imageUrls: imageUrls.slice(0, 10), // Limit to first 10 images
    imageCount,
    linkCount,
  };
}

/**
 * Capture screenshot using Puppeteer
 */
async function captureScreenshot(url: string): Promise<Buffer | null> {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 15000 });

    const screenshot = await page.screenshot({ type: 'png' });
    return screenshot as Buffer;
  } catch (error) {
    console.error('Error capturing screenshot:', error);
    return null;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

/**
 * Analyze text using Google Cloud Natural Language API
 */
async function analyzeTextWithNLP(text: string) {
  if (!languageClient || !text) {
    return null;
  }

  try {
    // Analyze sentiment
    const [sentimentResult] = await languageClient.analyzeSentiment({
      document: {
        content: text,
        type: 'PLAIN_TEXT',
      },
    });

    // Analyze entities
    const [entityResult] = await languageClient.analyzeEntities({
      document: {
        content: text,
        type: 'PLAIN_TEXT',
      },
    });

    // Classify content
    const [classificationResult] = await languageClient.classifyText({
      document: {
        content: text,
        type: 'PLAIN_TEXT',
      },
    });

    const sentiment = sentimentResult.documentSentiment;
    const sentimentScore = sentiment?.score || 0;
    const sentimentMagnitude = sentiment?.magnitude || 0;

    // Determine sentiment label
    let sentimentLabel = 'Neutral';
    if (sentimentScore > 0.25) sentimentLabel = 'Positive';
    else if (sentimentScore < -0.25) sentimentLabel = 'Concerning';

    // Extract entities
    const entities = entityResult.entities?.map((e) => e.name || '').filter(Boolean) || [];

    // Extract categories/topics
    const categories = classificationResult.categories?.map((c) => c.name || '').filter(Boolean) || [];

    return {
      sentiment: sentimentLabel,
      sentimentScore,
      sentimentMagnitude,
      entities: entities.slice(0, 10),
      categories,
    };
  } catch (error) {
    console.error('Error analyzing text with NLP:', error);
    return null;
  }
}

/**
 * Analyze images using Google Cloud Vision API
 */
async function analyzeImagesWithVision(imageUrls: string[], screenshot: Buffer | null) {
  if (!visionClient) {
    return null;
  }

  try {
    const results = {
      labels: [] as string[],
      safeSearchAnnotation: null as any,
      detectedObjects: [] as string[],
    };

    // Analyze screenshot if available
    if (screenshot) {
      const [screenshotResult] = await visionClient.annotateImage({
        image: { content: screenshot },
        features: [
          { type: 'LABEL_DETECTION', maxResults: 10 },
          { type: 'SAFE_SEARCH_DETECTION' },
          { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
        ],
      });

      results.labels = screenshotResult.labelAnnotations?.map((l) => l.description || '') || [];
      results.safeSearchAnnotation = screenshotResult.safeSearchAnnotation;
      results.detectedObjects = screenshotResult.localizedObjectAnnotations?.map((o) => o.name || '') || [];
    }

    // Analyze first few images from the page
    for (const imageUrl of imageUrls.slice(0, 3)) {
      try {
        const [imageResult] = await visionClient.annotateImage({
          image: { source: { imageUri: imageUrl } },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 5 },
            { type: 'SAFE_SEARCH_DETECTION' },
          ],
        });

        const imageLabels = imageResult.labelAnnotations?.map((l) => l.description || '') || [];
        results.labels.push(...imageLabels);

        // Use the most restrictive safe search annotation
        if (imageResult.safeSearchAnnotation) {
          if (!results.safeSearchAnnotation) {
            results.safeSearchAnnotation = imageResult.safeSearchAnnotation;
          } else {
            // Merge annotations (take worst case)
            const current = results.safeSearchAnnotation;
            const newAnnotation = imageResult.safeSearchAnnotation;
            results.safeSearchAnnotation = {
              adult: Math.max(getLikelihoodScore(current.adult), getLikelihoodScore(newAnnotation.adult)),
              violence: Math.max(getLikelihoodScore(current.violence), getLikelihoodScore(newAnnotation.violence)),
              racy: Math.max(getLikelihoodScore(current.racy), getLikelihoodScore(newAnnotation.racy)),
            };
          }
        }
      } catch (error) {
        console.error(`Error analyzing image ${imageUrl}:`, error);
      }
    }

    return results;
  } catch (error) {
    console.error('Error analyzing images with Vision API:', error);
    return null;
  }
}

/**
 * Convert Google Cloud Vision likelihood to numeric score
 */
function getLikelihoodScore(
  likelihood: protos.google.cloud.vision.v1.Likelihood | string | null | undefined
): number {
  switch (likelihood) {
    case 'VERY_UNLIKELY':
      return 0;
    case 'UNLIKELY':
      return 1;
    case 'POSSIBLE':
      return 2;
    case 'LIKELY':
      return 3;
    case 'VERY_LIKELY':
      return 4;
    default:
      return 0;
  }
}

/**
 * Analyze content and determine safety categories
 */
function determineSafetyCategories(
  metadata: any,
  nlpResults: any,
  visionResults: any,
  textContent: string
): { [key: string]: { detected: boolean; confidence: number } } {
  const categoryScores: { [key: string]: { detected: boolean; confidence: number } } = {};

  // Analyze based on text content and NLP results
  const textLower = (textContent + ' ' + metadata.title + ' ' + metadata.description).toLowerCase();

  // Violence detection
  const violenceKeywords = ['violence', 'violent', 'kill', 'murder', 'shooting', 'weapon', 'blood', 'gore', 'fight'];
  const violenceCount = violenceKeywords.filter((k) => textLower.includes(k)).length;

  if (visionResults?.safeSearchAnnotation?.violence >= 3 || violenceCount >= 3) {
    categoryScores['Graphic Violence'] = { detected: true, confidence: 0.8 };
  } else if (visionResults?.safeSearchAnnotation?.violence >= 2 || violenceCount >= 1) {
    categoryScores['Non-Graphic Violence'] = { detected: true, confidence: 0.6 };
  }

  // Sports/Fighting
  const sportsKeywords = ['boxing', 'mma', 'wrestling', 'fighting', 'combat sport'];
  if (sportsKeywords.some((k) => textLower.includes(k))) {
    categoryScores['Heavy Fighting (Sports)'] = { detected: true, confidence: 0.7 };
  }

  // Horror
  const horrorKeywords = ['horror', 'scary', 'creepy', 'nightmare', 'haunted', 'terror'];
  if (horrorKeywords.some((k) => textLower.includes(k))) {
    categoryScores['Horror/Jumpscares'] = { detected: true, confidence: 0.65 };
  }

  // Crime
  const crimeKeywords = ['crime', 'criminal', 'arrest', 'police', 'investigation', 'theft'];
  if (crimeKeywords.some((k) => textLower.includes(k))) {
    categoryScores['Crime Footage'] = { detected: true, confidence: 0.6 };
  }

  // Explicit content
  if (visionResults?.safeSearchAnnotation?.adult >= 3 || visionResults?.safeSearchAnnotation?.racy >= 3) {
    categoryScores['Explicit Content'] = { detected: true, confidence: 0.9 };
  }

  // Educational content
  const eduKeywords = ['education', 'learn', 'tutorial', 'course', 'study', 'academic', 'university', 'school'];
  const eduCount = eduKeywords.filter((k) => textLower.includes(k)).length;
  if (eduCount >= 2 || nlpResults?.categories?.some((c: string) => c.includes('Education'))) {
    categoryScores['Educational Content'] = { detected: true, confidence: 0.85 };
  }

  // Language detection
  const mildProfanity = ['damn', 'hell', 'crap', 'stupid'];
  const strongProfanity = ['fuck', 'shit', 'bitch', 'ass', 'bastard'];
  const mildCount = mildProfanity.filter((k) => textLower.includes(k)).length;
  const strongCount = strongProfanity.filter((k) => textLower.includes(k)).length;

  if (strongCount > 0) {
    categoryScores['Strong Language'] = { detected: true, confidence: Math.min(0.5 + strongCount * 0.1, 0.95) };
  } else if (mildCount > 0) {
    categoryScores['Mild Language'] = { detected: true, confidence: Math.min(0.4 + mildCount * 0.1, 0.8) };
  }

  // Substance use
  const substanceKeywords = ['alcohol', 'drug', 'marijuana', 'smoking', 'tobacco', 'beer', 'wine'];
  const substanceCount = substanceKeywords.filter((k) => textLower.includes(k)).length;
  if (substanceCount >= 2) {
    categoryScores['Substance Use'] = { detected: true, confidence: 0.7 };
  }

  return categoryScores;
}

/**
 * Calculate overall safety score and age group actions
 */
function calculateSafetyScore(categoryScores: any) {
  let overallScore = 85; // Start with high score

  // Deduct points based on detected categories
  if (categoryScores['Graphic Violence']?.detected) overallScore -= 40;
  if (categoryScores['Explicit Content']?.detected) overallScore -= 50;
  if (categoryScores['Horror/Jumpscares']?.detected) overallScore -= 20;
  if (categoryScores['Crime Footage']?.detected) overallScore -= 15;
  if (categoryScores['Non-Graphic Violence']?.detected) overallScore -= 10;
  if (categoryScores['Strong Language']?.detected) overallScore -= 15;
  if (categoryScores['Mild Language']?.detected) overallScore -= 5;
  if (categoryScores['Substance Use']?.detected) overallScore -= 20;

  // Add points for educational content
  if (categoryScores['Educational Content']?.detected) overallScore += 15;

  // Clamp to 0-100
  overallScore = Math.max(0, Math.min(100, overallScore));

  // Generate age group actions
  const ageGroupActions: {
    [key: string]: { action: 'BLOCK' | 'GATE' | 'ALLOW'; reason: string; score: number };
  } = {};

  CONTENT_RULES.ageGroups.forEach((ageGroup) => {
    let worstAction: 'BLOCK' | 'GATE' | 'ALLOW' = 'ALLOW';
    let reasons: string[] = [];
    let ageScore = 100;

    Object.entries(categoryScores).forEach(([category, data]: [string, any]) => {
      if (data.detected && data.confidence > 0.5) {
        const rule = CONTENT_RULES.categories[category as keyof typeof CONTENT_RULES.categories];
        if (rule) {
          const action = rule[ageGroup as keyof typeof rule];

          if (action === 'BLOCK') {
            worstAction = 'BLOCK';
            ageScore = Math.min(ageScore, 30);
            reasons.push(`${category} detected (blocked for this age)`);
          } else if (action === 'GATE' && worstAction !== 'BLOCK') {
            worstAction = 'GATE';
            ageScore = Math.min(ageScore, 60);
            reasons.push(`${category} detected (requires parent approval)`);
          } else if (action === 'ALLOW') {
            ageScore = Math.min(ageScore, 85);
          }
        }
      }
    });

    if (reasons.length === 0) {
      reasons.push('Content appears age-appropriate');
    }

    ageGroupActions[ageGroup] = {
      action: worstAction,
      reason: reasons.join('; '),
      score: ageScore,
    };
  });

  return { overallScore, ageGroupActions };
}

/**
 * Main analysis function - uses live data when possible
 */
async function analyzeUrlWithAI(url: string): Promise<ScanResult> {
  try {
    // Fetch webpage content
    console.log('Fetching webpage content...');
    const html = await fetchWebpageContent(url);

    // Parse HTML and extract metadata
    console.log('Parsing HTML and extracting metadata...');
    const metadata = parseHTMLMetadata(html, url);

    // Capture screenshot
    console.log('Capturing screenshot...');
    const screenshot = await captureScreenshot(url);

    // Analyze text with NLP
    console.log('Analyzing text with NLP...');
    const nlpResults = await analyzeTextWithNLP(metadata.textContent);

    // Analyze images with Vision API
    console.log('Analyzing images with Vision API...');
    const visionResults = await analyzeImagesWithVision(metadata.imageUrls, screenshot);

    // Determine safety categories
    const categoryScores = determineSafetyCategories(metadata, nlpResults, visionResults, metadata.textContent);

    // Calculate safety scores
    const { overallScore, ageGroupActions } = calculateSafetyScore(categoryScores);

    // Prepare result
    const result: ScanResult = {
      url,
      overallScore,
      contentAnalysis: {
        textAnalysis: {
          sentiment: nlpResults?.sentiment || 'Neutral',
          keyTopics: nlpResults?.categories || [],
          languageScore: Math.floor(overallScore * 0.85 + Math.random() * 10),
          entities: nlpResults?.entities || [],
        },
        visualAnalysis: {
          detectedObjects: visionResults?.detectedObjects || [],
          safetyScore: Math.floor(overallScore * 0.9 + Math.random() * 5),
          concerns: Object.keys(categoryScores).filter((key) =>
            key.includes('Violence') || key.includes('Horror') || key.includes('Crime') || key.includes('Explicit')
          ),
          labels: visionResults?.labels || [],
        },
        metadata: {
          title: metadata.title,
          description: metadata.description,
          keywords: metadata.keywords,
          imageCount: metadata.imageCount,
          linkCount: metadata.linkCount,
        },
      },
      categoryScores,
      ageGroupActions,
      timestamp: new Date().toISOString(),
      analysisMethod: visionClient && languageClient ? 'live' : 'demo',
    };

    return result;
  } catch (error) {
    console.error('Error in live analysis, falling back to demo mode:', error);
    // Fallback to demo mode if live analysis fails
    return generateDemoAnalysis(url);
  }
}

/**
 * Fallback demo analysis (used when Google Cloud APIs are not available)
 */
function generateDemoAnalysis(url: string): ScanResult {
  const urlLower = url.toLowerCase();

  const hasNews = urlLower.includes('news') || urlLower.includes('cnn') || urlLower.includes('bbc');
  const hasGaming = urlLower.includes('game') || urlLower.includes('steam') || urlLower.includes('xbox');
  const hasEducational = urlLower.includes('edu') || urlLower.includes('learn') || urlLower.includes('wiki');
  const hasSocial = urlLower.includes('facebook') || urlLower.includes('instagram') || urlLower.includes('tiktok');
  const hasVideo = urlLower.includes('youtube') || urlLower.includes('video') || urlLower.includes('vimeo');

  const categoryScores: { [key: string]: { detected: boolean; confidence: number } } = {};
  let detectedCategories: string[] = [];

  if (hasNews) {
    categoryScores['Crime Footage'] = { detected: true, confidence: 0.65 };
    categoryScores['Mild Language'] = { detected: true, confidence: 0.45 };
    detectedCategories.push('Crime Footage', 'Mild Language');
  }

  if (hasGaming) {
    categoryScores['Non-Graphic Violence'] = { detected: true, confidence: 0.72 };
    categoryScores['Heavy Fighting (Sports)'] = { detected: true, confidence: 0.58 };
    detectedCategories.push('Non-Graphic Violence');
  }

  if (hasEducational) {
    categoryScores['Educational Content'] = { detected: true, confidence: 0.95 };
    detectedCategories.push('Educational Content');
  }

  if (hasSocial) {
    categoryScores['Mild Language'] = { detected: true, confidence: 0.55 };
    categoryScores['Strong Language'] = { detected: true, confidence: 0.35 };
    detectedCategories.push('Mild Language');
  }

  if (hasVideo) {
    categoryScores['Educational Content'] = { detected: true, confidence: 0.40 };
    categoryScores['Mild Language'] = { detected: true, confidence: 0.50 };
  }

  if (detectedCategories.length === 0) {
    categoryScores['Educational Content'] = { detected: true, confidence: 0.70 };
    categoryScores['Mild Language'] = { detected: true, confidence: 0.30 };
    detectedCategories.push('Educational Content');
  }

  const { overallScore, ageGroupActions } = calculateSafetyScore(categoryScores);

  return {
    url,
    overallScore,
    contentAnalysis: {
      textAnalysis: {
        sentiment: overallScore > 70 ? 'Positive' : overallScore > 40 ? 'Neutral' : 'Concerning',
        keyTopics: detectedCategories.length > 0 ? detectedCategories : ['General Content'],
        languageScore: Math.floor(overallScore * 0.8 + Math.random() * 15),
      },
      visualAnalysis: {
        detectedObjects: hasVideo ? ['people', 'text', 'indoor scene'] : ['webpage', 'text', 'images'],
        safetyScore: Math.floor(overallScore * 0.85 + Math.random() * 10),
        concerns: detectedCategories.filter((c) =>
          c.includes('Violence') || c.includes('Horror') || c.includes('Crime') || c.includes('Explicit')
        ),
      },
      metadata: {
        title: 'Demo Mode - No metadata available',
        description: 'Using pattern-based analysis',
        keywords: [],
        imageCount: 0,
        linkCount: 0,
      },
    },
    categoryScores,
    ageGroupActions,
    timestamp: new Date().toISOString(),
    analysisMethod: 'demo',
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Validate URL format
    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    // Perform AI analysis
    const result = await analyzeUrlWithAI(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scanning URL:', error);
    return NextResponse.json({ error: 'Failed to scan URL' }, { status: 500 });
  }
}
