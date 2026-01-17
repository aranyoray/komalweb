import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { LanguageServiceClient } from '@google-cloud/language';
import puppeteer from 'puppeteer';
import { loadContentRulesFromCSV, parseAction, CategoryRule } from '@/lib/content-rules';
import {
  loadAndVectorizeKeywords,
  extractWordFrequencies,
  findSimilarKeywords,
  generateSimilarityReport,
  deepContextSearch,
  SimilarityMatch,
} from '@/lib/keyword-vectorization';

// Content safety rules based on komalkids.com/content-safety
const CONTENT_RULES = {
  ageGroups: ['<10', '10-13', '13-18', '18+'],
  categories: {
    'Graphic Violence': {
      '<10': 'BLOCK',
      '10-13': 'BLOCK',
      '13-18': 'BLOCK',
      '18+': 'GATE',
    },
    'Non-Graphic Violence': {
      '<10': 'GATE',
      '10-13': 'GATE',
      '13-18': 'ALLOW',
      '18+': 'ALLOW',
    },
    'Heavy Fighting (Sports)': {
      '<10': 'GATE',
      '10-13': 'GATE',
      '13-18': 'ALLOW',
      '18+': 'ALLOW',
    },
    'Horror/Jumpscares': {
      '<10': 'BLOCK',
      '10-13': 'GATE',
      '13-18': 'GATE',
      '18+': 'ALLOW',
    },
    'Crime Footage': {
      '<10': 'BLOCK',
      '10-13': 'GATE',
      '13-18': 'GATE',
      '18+': 'ALLOW',
    },
    'Explicit Content': {
      '<10': 'BLOCK',
      '10-13': 'BLOCK',
      '13-18': 'BLOCK',
      '18+': 'GATE',
    },
    'Educational Content': {
      '<10': 'ALLOW',
      '10-13': 'ALLOW',
      '13-18': 'ALLOW',
      '18+': 'ALLOW',
    },
    'Mild Language': {
      '<10': 'GATE',
      '10-13': 'GATE',
      '13-18': 'ALLOW',
      '18+': 'ALLOW',
    },
    'Strong Language': {
      '<10': 'BLOCK',
      '10-13': 'GATE',
      '13-18': 'GATE',
      '18+': 'ALLOW',
    },
    'Substance Use': {
      '<10': 'BLOCK',
      '10-13': 'BLOCK',
      '13-18': 'GATE',
      '18+': 'ALLOW',
    },
  },
};

// Adult keywords to detect in domain names - results in immediate 0 score and BLOCK for all ages
const ADULT_DOMAIN_KEYWORDS = [
  'porn', 'xxx', 'sex', 'adult', 'nsfw', 'nude', 'naked', 'erotic', 'fetish',
  'cam', 'webcam', 'livecam', 'chaturbate', 'onlyfans', 'fansly', 'manyvids',
  'xvideos', 'xnxx', 'pornhub', 'redtube', 'youporn', 'xhamster', 'brazzers',
  'hentai', 'rule34', 'e621', 'gelbooru', 'danbooru',
  'escort', 'hooker', 'prostitut', 'brothel',
  'milf', 'teen', 'anal', 'blowjob', 'cumshot', 'orgasm',
  'stripchat', 'bongacams', 'livejasmin', 'camsoda',
  'slutty', 'horny', 'kinky', 'bdsm', 'bondage',
];

/**
 * Check if domain contains adult keywords
 */
function isAdultDomain(url: string): { isAdult: boolean; matchedKeyword?: string } {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname.toLowerCase();
    const pathname = urlObj.pathname.toLowerCase();
    const fullUrl = (domain + pathname).toLowerCase();

    for (const keyword of ADULT_DOMAIN_KEYWORDS) {
      if (fullUrl.includes(keyword)) {
        return { isAdult: true, matchedKeyword: keyword };
      }
    }
    return { isAdult: false };
  } catch {
    return { isAdult: false };
  }
}

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
  keywordSimilarityReport?: {
    topCategories: Array<{ category: string; matchCount: number; avgScore: number }>;
    topKeywords: SimilarityMatch[];
    topWords: Array<{ word: string; frequency: number }>;
    summary: string;
    totalMatches: number;
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

// Cache vectorized keywords (load once, reuse for all requests)
let cachedCategoryKeywords: ReturnType<typeof loadAndVectorizeKeywords> | null = null;

function getVectorizedKeywords() {
  if (!cachedCategoryKeywords) {
    console.log('Loading and vectorizing keywords from CSV...');
    cachedCategoryKeywords = loadAndVectorizeKeywords();
    console.log(`Loaded ${cachedCategoryKeywords.length} categories with keywords`);
  }
  return cachedCategoryKeywords;
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
function getLikelihoodScore(likelihood: string | number | null | undefined): number {
  // Convert to string (handles both enum and string types)
  const likelihoodStr = String(likelihood || 'VERY_UNLIKELY');
  
  switch (likelihoodStr) {
    case 'VERY_UNLIKELY':
    case '0':
      return 0;
    case 'UNLIKELY':
    case '1':
      return 1;
    case 'POSSIBLE':
    case '2':
      return 2;
    case 'LIKELY':
    case '3':
      return 3;
    case 'VERY_LIKELY':
    case '4':
      return 4;
    default:
      return 0;
  }
}

/**
 * Map CSV category names to internal category names
 */
function mapCsvCategoryToInternalCategory(csvCategory: string): string[] {
  const categoryMap: { [key: string]: string[] } = {
    '1. Violence & Disturbing Content': ['Graphic Violence', 'Non-Graphic Violence', 'Heavy Fighting (Sports)', 'Horror/Jumpscares', 'Crime Footage'],
    '2. Explicit & Body-Related Content': ['Explicit Content'],
    '3. Substances & Addictive Behavior': ['Substance Use'],
    '4. Financial & Commercial Content': ['Financial & Commercial Content'],
    '5. Media & Platform-Native Risks': ['Media & Platform-Native Risks', 'Strong Language', 'Mild Language'],
    '6. Social & Cultural Topics': ['Social & Cultural Topics'],
  };

  return categoryMap[csvCategory] || [];
}

/**
 * Analyze content and determine safety categories using keyword vectorization
 */
function determineSafetyCategories(
  metadata: any,
  nlpResults: any,
  visionResults: any,
  textContent: string,
  similarityMatches?: SimilarityMatch[]
): { [key: string]: { detected: boolean; confidence: number } } {
  const categoryScores: { [key: string]: { detected: boolean; confidence: number } } = {};

  // If we have similarity matches, use them to determine categories
  if (similarityMatches && similarityMatches.length > 0) {
    // Group matches by CSV category
    const categoryMatchGroups = new Map<string, SimilarityMatch[]>();
    
    for (const match of similarityMatches) {
      const existing = categoryMatchGroups.get(match.category) || [];
      existing.push(match);
      categoryMatchGroups.set(match.category, existing);
    }

    // Process each CSV category and map to internal categories
    for (const [csvCategory, matches] of categoryMatchGroups.entries()) {
      const internalCategories = mapCsvCategoryToInternalCategory(csvCategory);
      
      if (internalCategories.length === 0) continue;

      // Calculate confidence based on match scores
      // Use average similarity and match count
      const avgSimilarity = matches.reduce((sum, m) => sum + m.similarity, 0) / matches.length;
      const totalScore = matches.reduce((sum, m) => sum + m.score, 0);
      const matchCount = matches.length;
      
      // Confidence is based on average similarity, match count, and total score
      // Higher similarity, more matches, and higher scores = higher confidence
      const baseConfidence = Math.min(0.95, avgSimilarity * 0.7 + Math.min(matchCount / 10, 0.3));
      const confidence = Math.min(0.95, baseConfidence + (totalScore / 100) * 0.1);

      // Apply to all mapped internal categories
      for (const internalCategory of internalCategories) {
        // If category already exists, take the higher confidence
        if (!categoryScores[internalCategory] || categoryScores[internalCategory].confidence < confidence) {
          categoryScores[internalCategory] = {
            detected: true,
            confidence: confidence,
          };
        }
      }

      // Special handling for violence categories based on match strength
      if (csvCategory === '1. Violence & Disturbing Content') {
        // If high similarity matches (>0.8) or many matches, mark as Graphic Violence
        const highConfidenceMatches = matches.filter(m => m.similarity > 0.8);
        if (highConfidenceMatches.length >= 3 || totalScore > 50) {
          categoryScores['Graphic Violence'] = {
            detected: true,
            confidence: Math.min(0.95, confidence + 0.1),
          };
        } else if (matches.length >= 2) {
          categoryScores['Non-Graphic Violence'] = {
            detected: true,
            confidence: confidence,
          };
        }
      }
    }
  }

  // Still use vision results for explicit content detection (visual analysis)
  if (visionResults?.safeSearchAnnotation?.adult >= 3 || visionResults?.safeSearchAnnotation?.racy >= 3) {
    categoryScores['Explicit Content'] = {
      detected: true,
      confidence: Math.max(
        categoryScores['Explicit Content']?.confidence || 0,
        0.9
      ),
    };
  }

  // Use vision results for violence detection as additional signal
  if (visionResults?.safeSearchAnnotation?.violence >= 3) {
    if (!categoryScores['Graphic Violence']) {
      categoryScores['Graphic Violence'] = { detected: true, confidence: 0.8 };
    } else {
      categoryScores['Graphic Violence'].confidence = Math.max(
        categoryScores['Graphic Violence'].confidence,
        0.8
      );
    }
  } else if (visionResults?.safeSearchAnnotation?.violence >= 2) {
    if (!categoryScores['Non-Graphic Violence']) {
      categoryScores['Non-Graphic Violence'] = { detected: true, confidence: 0.6 };
    }
  }

  // Check for educational content using NLP (if available)
  if (nlpResults?.categories?.some((c: string) => c.includes('Education'))) {
    categoryScores['Educational Content'] = { detected: true, confidence: 0.85 };
  }

  return categoryScores;
}

/**
 * Calculate overall safety score and age group actions using keyword matches only
 */
function calculateSafetyScore(
  categoryScores: any,
  similarityMatches?: SimilarityMatch[]
) {
  let overallScore = 85; // Start with high score

  // If we have keyword matches, prioritize non-child-safe keywords
  if (similarityMatches && similarityMatches.length > 0) {
    // Separate matches into high-priority (non-child-safe) and low-priority (safe/neutral)
    const highPriorityMatches = similarityMatches.filter(m => m.priority >= 5.0);
    const lowPriorityMatches = similarityMatches.filter(m => m.priority < 5.0);
    
    // Group matches by category and calculate impact
    const categoryImpact = new Map<string, { totalScore: number; matchCount: number; maxSimilarity: number; avgPriority: number }>();
    
    // Process high-priority matches first (non-child-safe keywords)
    for (const match of highPriorityMatches) {
      const existing = categoryImpact.get(match.category) || { totalScore: 0, matchCount: 0, maxSimilarity: 0, avgPriority: 0 };
      categoryImpact.set(match.category, {
        totalScore: existing.totalScore + match.score,
        matchCount: existing.matchCount + 1,
        maxSimilarity: Math.max(existing.maxSimilarity, match.similarity),
        avgPriority: (existing.avgPriority * existing.matchCount + match.priority) / (existing.matchCount + 1),
      });
    }
    
    // Process low-priority matches with minimal impact (only if no high-priority matches exist)
    if (highPriorityMatches.length === 0) {
      for (const match of lowPriorityMatches) {
        const existing = categoryImpact.get(match.category) || { totalScore: 0, matchCount: 0, maxSimilarity: 0, avgPriority: 0 };
        categoryImpact.set(match.category, {
          totalScore: existing.totalScore + (match.score * 0.1), // Reduce impact by 90%
          matchCount: existing.matchCount + 1,
          maxSimilarity: Math.max(existing.maxSimilarity, match.similarity),
          avgPriority: (existing.avgPriority * existing.matchCount + match.priority) / (existing.matchCount + 1),
        });
      }
    }

    // Calculate score deductions - prioritize non-child-safe categories heavily
    for (const [csvCategory, impact] of categoryImpact.entries()) {
      const priorityWeight = impact.avgPriority / 10.0; // Normalize to 0-1 scale
      
      // Non-child-safe categories get much higher deductions based on priority
      if (csvCategory === '1. Violence & Disturbing Content') {
        // Highest priority - severe deductions
        if (impact.maxSimilarity > 0.8 || impact.totalScore > 50) {
          overallScore -= Math.min(60, 40 + (impact.totalScore / 8) * priorityWeight); // Graphic violence
        } else {
          overallScore -= Math.min(35, 20 + (impact.totalScore / 12) * priorityWeight); // Non-graphic violence
        }
      } else if (csvCategory === '2. Explicit & Body-Related Content') {
        // Very high priority - severe deductions
        overallScore -= Math.min(60, 40 + (impact.totalScore / 6) * priorityWeight); // Explicit content
      } else if (csvCategory === '3. Substances & Addictive Behavior') {
        // High priority - significant deductions
        overallScore -= Math.min(35, 20 + (impact.totalScore / 10) * priorityWeight); // Substance use
      } else if (csvCategory === '4. Financial & Commercial Content') {
        // Medium-high priority - moderate deductions
        overallScore -= Math.min(20, 10 + (impact.totalScore / 15) * priorityWeight); // Financial content
      } else if (csvCategory === '5. Media & Platform-Native Risks') {
        // Medium priority - moderate deductions
        overallScore -= Math.min(25, 12 + (impact.totalScore / 12) * priorityWeight); // Media risks
      } else if (csvCategory === '6. Social & Cultural Topics') {
        // Lower priority - minimal deductions
        overallScore -= Math.min(12, 5 + (impact.totalScore / 20) * priorityWeight); // Social topics
      }
    }
  } else {
    // Fallback to category-based scoring if no keyword matches
    if (categoryScores['Graphic Violence']?.detected) overallScore -= 40;
    if (categoryScores['Explicit Content']?.detected) overallScore -= 50;
    if (categoryScores['Horror/Jumpscares']?.detected) overallScore -= 20;
    if (categoryScores['Crime Footage']?.detected) overallScore -= 15;
    if (categoryScores['Non-Graphic Violence']?.detected) overallScore -= 10;
    if (categoryScores['Strong Language']?.detected) overallScore -= 15;
    if (categoryScores['Mild Language']?.detected) overallScore -= 5;
    if (categoryScores['Substance Use']?.detected) overallScore -= 20;
  }

  // Add points for educational content
  if (categoryScores['Educational Content']?.detected) overallScore += 15;

  // Clamp to 0-100
  overallScore = Math.max(0, Math.min(100, overallScore));

  // Generate age group actions based on granular categories from CSV
  const ageGroupActions: {
    [key: string]: { action: 'BLOCK' | 'GATE' | 'ALLOW'; reason: string; score: number };
  } = {};

  // Age group mapping: <10, 10-13, 13-18, 18+ -> CSV columns
  // Process in order from youngest to oldest for cascading effect
  const ageGroupMap: { [key: string]: keyof CategoryRule['rules'] } = {
    '<10': '<10',
    '10-13': '10-13',
    '13-18': '13-16', // Map 13-18 to 13-16 from CSV
    '18+': '16-18', // Map 18+ to 16-18 from CSV
  };

  const ageGroupOrder = ['<10', '10-13', '13-18', '18+']; // Process from youngest to oldest

  // Process each age group in order (youngest to oldest)
  ageGroupOrder.forEach((ageGroup) => {
    let worstAction: 'BLOCK' | 'GATE' | 'ALLOW' = 'ALLOW';
    let reasons: string[] = [];
    let ageScore = 100;

    // Check if a lower age group already marked this as ALLOW (cascade effect)
    const currentIndex = ageGroupOrder.indexOf(ageGroup);
    let cascadedFromYounger = false;
    
    if (currentIndex > 0) {
      // Check all previous (younger) age groups
      for (let i = 0; i < currentIndex; i++) {
        const youngerAgeGroup = ageGroupOrder[i];
        const youngerAction = ageGroupActions[youngerAgeGroup];
        if (youngerAction && youngerAction.action === 'ALLOW') {
          // If younger age group is ALLOW, automatically ALLOW for older groups
          worstAction = 'ALLOW';
          ageScore = youngerAction.score; // Use the score from the younger age group
          reasons.push(`Content is age-appropriate for ${youngerAgeGroup}, automatically approved for ${ageGroup}`);
          cascadedFromYounger = true;
          break; // Stop checking once we find an ALLOW
        }
      }
    }

    // Only process keyword matches if not already cascaded from younger age group
    if (!cascadedFromYounger && similarityMatches && similarityMatches.length > 0) {
      // Separate high-priority (non-child-safe) and low-priority matches
      const highPriorityMatches = similarityMatches.filter(m => m.priority >= 5.0);
      const matchesToProcess = highPriorityMatches.length > 0 ? highPriorityMatches : similarityMatches;
      
      // Group matches by CSV category
      const categoryMatches = new Map<string, SimilarityMatch[]>();
      for (const match of matchesToProcess) {
        const existing = categoryMatches.get(match.category) || [];
        existing.push(match);
        categoryMatches.set(match.category, existing);
      }

      // Process each category with matches
      for (const [csvCategory, matches] of categoryMatches.entries()) {
        // Load content rules to get age group actions
        const contentRules = loadContentRulesFromCSV();
        const matchedRule = contentRules.find(r => r.category === csvCategory);
        
        if (matchedRule) {
          const csvAgeGroup = ageGroupMap[ageGroup];
          const actionStr = matchedRule.rules[csvAgeGroup] || '';
          const action = parseAction(actionStr);
          
          // Calculate match strength with priority weighting
          const avgSimilarity = matches.reduce((sum, m) => sum + m.similarity, 0) / matches.length;
          const totalScore = matches.reduce((sum, m) => sum + m.score, 0);
          const matchCount = matches.length;
          const avgPriority = matches.reduce((sum, m) => sum + m.priority, 0) / matches.length;
          const priorityWeight = avgPriority / 10.0; // Normalize priority to 0-1
          
          // Match strength calculation - prioritize non-child-safe keywords
          // Higher priority categories get boosted match strength
          const baseMatchStrength = avgSimilarity * 0.5 + (Math.min(totalScore / 100, 1)) * 0.3 + (Math.min(matchCount / 20, 1)) * 0.2;
          const matchStrength = baseMatchStrength * (0.7 + priorityWeight * 0.3); // Boost by priority

          // Lower threshold for high-priority (non-child-safe) matches, higher for low-priority
          const threshold = avgPriority >= 5.0 ? 0.2 : 0.4; // Non-child-safe: 0.2, Safe: 0.4
          
          if (matchStrength > threshold) {
            if (action === 'BLOCK') {
              worstAction = 'BLOCK';
              ageScore = Math.min(ageScore, Math.max(0, 30 - (matchStrength * 20)));
              const topKeywords = matches
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map(m => m.keyword.length > 30 ? m.keyword.substring(0, 30) + '...' : m.keyword)
                .join(', ');
              reasons.push(`${csvCategory} detected via keywords (${matchCount} matches): ${topKeywords} (blocked for this age)`);
            } else if (action === 'GATE' && worstAction !== 'BLOCK') {
              worstAction = 'GATE';
              ageScore = Math.min(ageScore, Math.max(30, 60 - (matchStrength * 15)));
              const topKeywords = matches
                .sort((a, b) => b.score - a.score)
                .slice(0, 3)
                .map(m => m.keyword.length > 30 ? m.keyword.substring(0, 30) + '...' : m.keyword)
                .join(', ');
              reasons.push(`${csvCategory} detected via keywords (${matchCount} matches): ${topKeywords} (requires parent approval)`);
            } else if (action === 'ALLOW') {
              ageScore = Math.min(ageScore, 85);
            }
          }
        }
      }
    }

    // If no keyword matches and not cascaded, default to ALLOW
    if (!cascadedFromYounger && (!similarityMatches || similarityMatches.length === 0)) {
      // No keyword matches found - content appears safe
      if (reasons.length === 0) {
        reasons.push('Content appears age-appropriate');
      }
    }
    
    // Ensure we have at least one reason
    if (reasons.length === 0) {
      reasons.push('Content appears age-appropriate');
    }

    ageGroupActions[ageGroup] = {
      action: worstAction,
      reason: reasons.join('; '),
      score: ageScore,
    };
  });

  // Calculate overall score as average of all age group scores
  const ageGroupScores = Object.values(ageGroupActions).map(action => action.score);
  if (ageGroupScores.length > 0) {
    overallScore = Math.round(ageGroupScores.reduce((sum, score) => sum + score, 0) / ageGroupScores.length);
  }

  // Clamp to 0-100
  overallScore = Math.max(0, Math.min(100, overallScore));

  return { overallScore, ageGroupActions };
}

/**
 * Generate gated result when no content could be fetched or analyzed
 */
function generateNoContentResult(url: string, reason: string): ScanResult {
  const gatedAgeGroupActions: { [key: string]: { action: 'BLOCK' | 'GATE' | 'ALLOW'; reason: string; score: number } } = {};

  CONTENT_RULES.ageGroups.forEach((ageGroup) => {
    gatedAgeGroupActions[ageGroup] = {
      action: 'GATE',
      reason: `Unable to analyze content: ${reason}`,
      score: 0,
    };
  });

  return {
    url,
    overallScore: 0,
    contentAnalysis: {
      textAnalysis: {
        sentiment: 'Unknown',
        keyTopics: ['Unable to Analyze'],
        languageScore: 0,
        entities: [],
      },
      visualAnalysis: {
        detectedObjects: [],
        safetyScore: 0,
        concerns: ['Content could not be analyzed'],
        labels: ['Unknown Content'],
      },
      metadata: {
        title: 'Unable to Fetch Content',
        description: reason,
        keywords: [],
        imageCount: 0,
        linkCount: 0,
      },
    },
    categoryScores: {
      'Unknown Content': { detected: true, confidence: 1.0 },
    },
    ageGroupActions: gatedAgeGroupActions,
    timestamp: new Date().toISOString(),
    analysisMethod: 'live',
  };
}

/**
 * Generate blocked result for adult domains
 */
function generateAdultDomainBlockedResult(url: string, matchedKeyword: string): ScanResult {
  const blockedAgeGroupActions: { [key: string]: { action: 'BLOCK' | 'GATE' | 'ALLOW'; reason: string; score: number } } = {};

  CONTENT_RULES.ageGroups.forEach((ageGroup) => {
    blockedAgeGroupActions[ageGroup] = {
      action: 'BLOCK',
      reason: `Adult content detected in domain (keyword: "${matchedKeyword}")`,
      score: 0,
    };
  });

  return {
    url,
    overallScore: 0,
    contentAnalysis: {
      textAnalysis: {
        sentiment: 'Blocked',
        keyTopics: ['Adult Content', 'Explicit Content'],
        languageScore: 0,
        entities: [],
      },
      visualAnalysis: {
        detectedObjects: [],
        safetyScore: 0,
        concerns: ['Adult Content Detected'],
        labels: ['Adult Content', 'Explicit Content'],
      },
      metadata: {
        title: 'Blocked - Adult Content',
        description: `Domain contains adult keyword: "${matchedKeyword}"`,
        keywords: ['adult', 'blocked'],
        imageCount: 0,
        linkCount: 0,
      },
    },
    categoryScores: {
      'Explicit Content': { detected: true, confidence: 1.0 },
      'Adult Domain': { detected: true, confidence: 1.0 },
    },
    ageGroupActions: blockedAgeGroupActions,
    timestamp: new Date().toISOString(),
    analysisMethod: 'live',
  };
}

/**
 * Main analysis function - uses live data when possible
 */
async function analyzeUrlWithAI(url: string): Promise<ScanResult> {
  // Check for adult keywords in domain FIRST - immediate block
  const adultCheck = isAdultDomain(url);
  if (adultCheck.isAdult) {
    console.log(`Adult domain detected: ${adultCheck.matchedKeyword}`);
    return generateAdultDomainBlockedResult(url, adultCheck.matchedKeyword || 'unknown');
  }

  try {
    // Fetch webpage content
    console.log('Fetching webpage content...');
    const html = await fetchWebpageContent(url);

    // Check if we got any content
    if (!html || html.trim().length === 0) {
      console.log('No HTML content received');
      return generateNoContentResult(url, 'No content could be fetched from this URL');
    }

    // Parse HTML and extract metadata
    console.log('Parsing HTML and extracting metadata...');
    const metadata = parseHTMLMetadata(html, url);

    // Check if we got any meaningful content
    if (!metadata.textContent || metadata.textContent.trim().length < 50) {
      console.log('Insufficient text content for analysis');
      return generateNoContentResult(url, 'Insufficient content for safety analysis');
    }

    // Capture screenshot
    console.log('Capturing screenshot...');
    const screenshot = await captureScreenshot(url);

    // Analyze text with NLP
    console.log('Analyzing text with NLP...');
    const nlpResults = await analyzeTextWithNLP(metadata.textContent);

    // Analyze images with Vision API
    console.log('Analyzing images with Vision API...');
    const visionResults = await analyzeImagesWithVision(metadata.imageUrls, screenshot);

    // Perform keyword vectorization and similarity search FIRST
    let similarityMatches: SimilarityMatch[] = [];
    let keywordSimilarityReport: ScanResult['keywordSimilarityReport'] | undefined;
    
    try {
      console.log('Performing keyword similarity analysis...');
      const categoryKeywords = getVectorizedKeywords();
      
      if (categoryKeywords && categoryKeywords.length > 0) {
        // Combine all text content for analysis
        const combinedText = [
          metadata.title,
          metadata.description,
          metadata.textContent,
          ...(metadata.keywords || []),
        ].filter(Boolean).join(' ');

        // Extract word frequencies from URL content
        const wordFrequencies = extractWordFrequencies(combinedText);

        if (wordFrequencies.length > 0) {
          // Find similar keywords with full text for context/depth scoring
          similarityMatches = findSimilarKeywords(wordFrequencies, categoryKeywords, 50, combinedText);
          
          if (similarityMatches.length > 0) {
            // Generate similarity report
            const report = generateSimilarityReport(similarityMatches, wordFrequencies);
            
            keywordSimilarityReport = {
              topCategories: report.topCategories,
              topKeywords: report.topKeywords,
              topWords: report.topWords,
              summary: report.summary,
              totalMatches: similarityMatches.length,
            };
            
            console.log(`Found ${similarityMatches.length} keyword matches`);
          }
        }
      }
    } catch (error) {
      console.error('Error in keyword similarity analysis:', error);
      // Continue without keyword matches if it fails
    }

    // Determine safety categories using keyword vectorization results
    const categoryScores = determineSafetyCategories(
      metadata,
      nlpResults,
      visionResults,
      metadata.textContent,
      similarityMatches
    );

    // Calculate safety scores using keyword matches only
    const { overallScore, ageGroupActions } = calculateSafetyScore(categoryScores, similarityMatches);

    // Extract detected category names for display
    const detectedCategoryNames = Object.keys(categoryScores).filter(
      (key) => categoryScores[key]?.detected && categoryScores[key]?.confidence > 0.5
    );

    // Prepare result
    const result: ScanResult = {
      url,
      overallScore,
      contentAnalysis: {
        textAnalysis: {
          sentiment: nlpResults?.sentiment || 'Neutral',
          keyTopics: nlpResults?.categories?.length ? nlpResults.categories : detectedCategoryNames.length ? detectedCategoryNames : ['General Content'],
          languageScore: Math.floor(overallScore * 0.85 + Math.random() * 10),
          entities: nlpResults?.entities || [],
        },
        visualAnalysis: {
          detectedObjects: visionResults?.detectedObjects?.length ? visionResults.detectedObjects : ['webpage', 'text', 'images'],
          safetyScore: Math.floor(overallScore * 0.9 + Math.random() * 5),
          concerns: Object.keys(categoryScores).filter((key) =>
            key.includes('Violence') || key.includes('Horror') || key.includes('Crime') || key.includes('Explicit')
          ),
          labels: visionResults?.labels?.length ? visionResults.labels : detectedCategoryNames,
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
      keywordSimilarityReport,
      timestamp: new Date().toISOString(),
      analysisMethod: visionClient && languageClient ? 'live' : 'demo',
    };

    return result;
  } catch (error) {
    console.error('Error in live analysis:', error);
    // Return gated result when fetch/analysis fails - 0 score, GATE for all ages
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return generateNoContentResult(url, `Failed to analyze: ${errorMessage}`);
  }
}

/**
 * Fallback demo analysis (used when Google Cloud APIs are not available)
 */
function generateDemoAnalysis(url: string): ScanResult {
  // Check for adult keywords in domain FIRST - immediate block
  const adultCheck = isAdultDomain(url);
  if (adultCheck.isAdult) {
    return generateAdultDomainBlockedResult(url, adultCheck.matchedKeyword || 'unknown');
  }

  // Perform keyword vectorization and similarity search FIRST
  let similarityMatches: SimilarityMatch[] = [];
  let keywordSimilarityReport: ScanResult['keywordSimilarityReport'] | undefined;
  
  try {
    const categoryKeywords = getVectorizedKeywords();
    
    if (categoryKeywords && categoryKeywords.length > 0) {
      // Use URL for analysis in demo mode
      const wordFrequencies = extractWordFrequencies(url);

      if (wordFrequencies.length > 0) {
        // Pass URL as context for demo mode
        similarityMatches = findSimilarKeywords(wordFrequencies, categoryKeywords, 50, url);
        
        if (similarityMatches.length > 0) {
          const report = generateSimilarityReport(similarityMatches, wordFrequencies);
          
          keywordSimilarityReport = {
            topCategories: report.topCategories,
            topKeywords: report.topKeywords,
            topWords: report.topWords,
            summary: report.summary,
            totalMatches: similarityMatches.length,
          };
        }
      }
    }
  } catch (error) {
    console.error('Error in keyword similarity analysis (demo):', error);
  }

  // Determine safety categories using keyword vectorization results
  const categoryScores = determineSafetyCategories(
    { title: '', description: '', keywords: [], textContent: url, imageCount: 0, linkCount: 0 },
    null,
    null,
    url,
    similarityMatches
  );

  // Calculate safety scores using keyword matches only
  const { overallScore, ageGroupActions } = calculateSafetyScore(categoryScores, similarityMatches);

  // Extract detected category names for display
  const detectedCategories = Object.keys(categoryScores).filter(
    (key) => categoryScores[key]?.detected && categoryScores[key]?.confidence > 0.5
  );

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
        detectedObjects: ['webpage', 'text', 'images'],
        safetyScore: Math.floor(overallScore * 0.85 + Math.random() * 10),
        concerns: detectedCategories.filter((c) =>
          c.includes('Violence') || c.includes('Horror') || c.includes('Crime') || c.includes('Explicit')
        ),
        labels: detectedCategories.length > 0 ? detectedCategories : ['General Content'],
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
    keywordSimilarityReport,
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
