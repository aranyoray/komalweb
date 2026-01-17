import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { LanguageServiceClient } from '@google-cloud/language';
import puppeteer from 'puppeteer';
import {
  loadAndVectorizeKeywords,
  extractWordFrequencies,
  findSimilarKeywords,
  generateSimilarityReport,
  SimilarityMatch,
  CategoryKeywords,
} from '@/lib/keyword-vectorization';

// ============================================================================
// CHILD SAFETY FOCUSED SCORING SYSTEM
// ============================================================================

// Age groups for content safety analysis
const AGE_GROUPS = ['<10', '10-13', '13-16', '16+'] as const;
type AgeGroup = typeof AGE_GROUPS[number];

// Comprehensive list of adult/unsafe keywords for child safety
const CHILD_UNSAFE_KEYWORDS = {
  // Explicit adult content
  explicit: [
    'porn', 'xxx', 'sex', 'nsfw', 'nude', 'naked', 'erotic', 'fetish',
    'cam', 'webcam', 'livecam', 'chaturbate', 'onlyfans', 'fansly', 'manyvids',
    'xvideos', 'xnxx', 'pornhub', 'redtube', 'youporn', 'xhamster', 'brazzers',
    'hentai', 'rule34', 'e621', 'gelbooru', 'danbooru', 'nhentai',
    'escort', 'hooker', 'prostitut', 'brothel', 'stripper',
    'milf', 'anal', 'blowjob', 'cumshot', 'orgasm', 'masturbat',
    'stripchat', 'bongacams', 'livejasmin', 'camsoda',
    'slutty', 'horny', 'kinky', 'bdsm', 'bondage', 'dominat', 'submissive',
    'threesome', 'gangbang', 'orgy', 'incest', 'rape', 'molest',
    'penis', 'vagina', 'cock', 'dick', 'pussy', 'tits', 'boobs', 'breasts',
    'f*ck', 'fuk', 'fuq', 'phuck', 'fck',
  ],
  // Violence and gore
  violence: [
    'gore', 'gory', 'mutilat', 'dismember', 'decapitat', 'behead',
    'torture', 'tortur', 'brutal', 'savage', 'slaughter', 'massacre',
    'murder', 'kill', 'killing', 'death', 'dead', 'corpse', 'cadaver',
    'blood', 'bloody', 'bleeding', 'wound', 'injury', 'trauma',
    'weapon', 'gun', 'firearm', 'knife', 'sword', 'bomb', 'explosive',
    'shoot', 'shooting', 'shot', 'stab', 'stabbing', 'attack',
    'suicide', 'suicidal', 'self-harm', 'selfharm', 'cutting',
    'terrorist', 'terrorism', 'extremist', 'radical',
  ],
  // Drugs and substances
  substances: [
    'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'methamphetamine',
    'marijuana', 'cannabis', 'weed', 'pot', 'hash', 'hashish',
    'lsd', 'acid', 'ecstasy', 'mdma', 'ketamine', 'pcp',
    'opioid', 'opiate', 'fentanyl', 'morphine', 'overdose',
    'alcohol', 'drunk', 'intoxicat', 'beer', 'wine', 'liquor', 'vodka', 'whiskey',
    'smoking', 'cigarette', 'tobacco', 'vape', 'vaping', 'juul',
    'addiction', 'addict', 'rehab', 'withdrawal',
  ],
  // Gambling
  gambling: [
    'gambling', 'gamble', 'casino', 'bet', 'betting', 'poker',
    'slot', 'slots', 'roulette', 'blackjack', 'lottery',
    'sportsbook', 'bookmaker', 'wager', 'odds',
  ],
  // Hate and discrimination
  hate: [
    'racist', 'racism', 'nazi', 'fascist', 'supremacist',
    'hate', 'hatred', 'bigot', 'discriminat', 'prejudice',
    'slur', 'derogatory', 'offensive',
    'antisemit', 'islamophob', 'homophob', 'transphob',
  ],
  // Profanity (strong)
  profanity: [
    'fuck', 'shit', 'ass', 'asshole', 'bitch', 'bastard',
    'damn', 'crap', 'piss', 'cunt', 'whore', 'slut',
    'nigger', 'nigga', 'faggot', 'retard',
  ],
  // Dangerous activities
  dangerous: [
    'challenge', 'dare', 'stunt', 'prank', 'dangerous',
    'blackout', 'choking', 'tide pod', 'cinnamon challenge',
    'fire challenge', 'skull breaker',
  ],
  // Predatory behavior indicators
  predatory: [
    'grooming', 'predator', 'pedophil', 'minor', 'underage',
    'child abuse', 'trafficking', 'exploit',
  ],
};

// Safe/educational content indicators
const CHILD_SAFE_KEYWORDS = [
  'educational', 'education', 'learn', 'learning', 'teach', 'teaching',
  'school', 'homework', 'study', 'student', 'classroom',
  'kids', 'children', 'family', 'parents', 'child-friendly',
  'cartoon', 'animation', 'animated', 'disney', 'pixar', 'nickelodeon',
  'science', 'math', 'history', 'geography', 'reading', 'writing',
  'arts', 'crafts', 'music', 'dance', 'sports', 'games',
  'nature', 'animals', 'wildlife', 'environment',
  'safe', 'appropriate', 'suitable', 'wholesome',
  'pbs', 'sesame', 'national geographic kids', 'discovery kids',
];

// Child safety risk levels
interface ChildSafetyRisk {
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  deduction: {
    '<10': number;
    '10-13': number;
    '13-16': number;
    '16+': number;
  };
}

const CHILD_SAFETY_RISKS: ChildSafetyRisk[] = [
  {
    category: 'explicit',
    severity: 'critical',
    deduction: { '<10': 100, '10-13': 100, '13-16': 100, '16+': 80 },
  },
  {
    category: 'predatory',
    severity: 'critical',
    deduction: { '<10': 100, '10-13': 100, '13-16': 100, '16+': 100 },
  },
  {
    category: 'violence',
    severity: 'high',
    deduction: { '<10': 80, '10-13': 70, '13-16': 50, '16+': 30 },
  },
  {
    category: 'substances',
    severity: 'high',
    deduction: { '<10': 90, '10-13': 80, '13-16': 60, '16+': 40 },
  },
  {
    category: 'gambling',
    severity: 'high',
    deduction: { '<10': 90, '10-13': 85, '13-16': 70, '16+': 50 },
  },
  {
    category: 'hate',
    severity: 'high',
    deduction: { '<10': 90, '10-13': 85, '13-16': 75, '16+': 60 },
  },
  {
    category: 'profanity',
    severity: 'medium',
    deduction: { '<10': 60, '10-13': 50, '13-16': 30, '16+': 15 },
  },
  {
    category: 'dangerous',
    severity: 'high',
    deduction: { '<10': 85, '10-13': 75, '13-16': 55, '16+': 35 },
  },
];

// ============================================================================
// INTERFACES
// ============================================================================
import { CONTENT_RULES } from '@/lib/content-rules';
import type { protos } from '@google-cloud/vision';

interface ScanResult {
  url: string;
  overallScore: number;
  ageGroupScores: {
    [key in AgeGroup]: {
      score: number;
      action: 'BLOCK' | 'GATE' | 'ALLOW';
      reason: string;
      risks: string[];
    };
  };
  contentAnalysis: {
    textAnalysis: {
      sentiment: string;
      keyTopics: string[];
      languageScore: number;
      entities?: string[];
      unsafeKeywordsFound: string[];
      safeKeywordsFound: string[];
    };
    visualAnalysis: {
      detectedObjects: string[];
      safetyScore: number;
      concerns: string[];
      labels?: string[];
    };
    multimediaAnalysis?: {
      videoDetected: boolean;
      audioDetected: boolean;
      mediaTypes: string[];
      mediaSafetyScore: number;
      mediaConcerns: string[];
    };
    metadata: {
      title?: string;
      description?: string;
      keywords?: string[];
      imageCount: number;
      linkCount: number;
      videoCount: number;
      audioCount: number;
    };
  };
  childSafetyAnalysis: {
    overallRisk: 'safe' | 'caution' | 'unsafe' | 'dangerous';
    riskCategories: {
      category: string;
      severity: string;
      matchCount: number;
      matchedKeywords: string[];
      contextSnippets: string[];
    }[];
    depthAnalysis: {
      titleSafe: boolean;
      metadataSafe: boolean;
      contentSafe: boolean;
      mediaSafe: boolean;
    };
  };
  timestamp: string;
  analysisMethod: 'live' | 'demo';
}

// ============================================================================
// GOOGLE CLOUD CLIENTS
// ============================================================================

let visionClient: ImageAnnotatorClient | null = null;
let languageClient: LanguageServiceClient | null = null;

try {
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

// ============================================================================
// CHILD SAFETY ANALYSIS FUNCTIONS
// ============================================================================

/**
 * Check content for child-unsafe keywords with context analysis
 */
function analyzeChildSafety(
  text: string,
  title: string = '',
  description: string = '',
  keywords: string[] = []
): {
  unsafeKeywordsFound: { category: string; keyword: string; count: number; context: string[] }[];
  safeKeywordsFound: string[];
  riskScore: number;
  riskLevel: 'safe' | 'caution' | 'unsafe' | 'dangerous';
} {
  const allContent = `${title} ${description} ${keywords.join(' ')} ${text}`.toLowerCase();
  const unsafeKeywordsFound: { category: string; keyword: string; count: number; context: string[] }[] = [];
  const safeKeywordsFound: string[] = [];

  // Check for unsafe keywords in each category
  for (const [category, keywords] of Object.entries(CHILD_UNSAFE_KEYWORDS)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = allContent.match(regex);
      if (matches && matches.length > 0) {
        // Extract context snippets
        const contexts: string[] = [];
        let searchIndex = 0;
        const lowerContent = allContent.toLowerCase();
        while (contexts.length < 3) {
          const pos = lowerContent.indexOf(keyword.toLowerCase(), searchIndex);
          if (pos === -1) break;
          const start = Math.max(0, pos - 30);
          const end = Math.min(allContent.length, pos + keyword.length + 30);
          contexts.push('...' + allContent.slice(start, end).trim() + '...');
          searchIndex = pos + 1;
        }

        unsafeKeywordsFound.push({
          category,
          keyword,
          count: matches.length,
          context: contexts,
        });
      }
    }
  }

  // Check for safe keywords
  for (const keyword of CHILD_SAFE_KEYWORDS) {
    if (allContent.includes(keyword.toLowerCase())) {
      safeKeywordsFound.push(keyword);
    }
  }

  // Calculate risk score
  let riskScore = 0;
  for (const unsafe of unsafeKeywordsFound) {
    const risk = CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category);
    if (risk) {
      const severityMultiplier = risk.severity === 'critical' ? 10 :
                                  risk.severity === 'high' ? 6 :
                                  risk.severity === 'medium' ? 3 : 1;
      riskScore += unsafe.count * severityMultiplier;
    }
  }

  // Reduce risk for safe content (max 30% reduction)
  const safeReduction = Math.min(safeKeywordsFound.length * 2, 30);
  riskScore = Math.max(0, riskScore - safeReduction);

  // Determine risk level
  let riskLevel: 'safe' | 'caution' | 'unsafe' | 'dangerous' = 'safe';
  if (riskScore >= 50) riskLevel = 'dangerous';
  else if (riskScore >= 25) riskLevel = 'unsafe';
  else if (riskScore >= 10) riskLevel = 'caution';

  return { unsafeKeywordsFound, safeKeywordsFound, riskScore, riskLevel };
}

/**
 * Calculate age-specific scores based on child safety analysis
 */
function calculateAgeGroupScores(
  childSafetyAnalysis: ReturnType<typeof analyzeChildSafety>,
  visionSafeSearch: any,
  multimediaRisk: number = 0
): {
  [key in AgeGroup]: {
    score: number;
    action: 'BLOCK' | 'GATE' | 'ALLOW';
    reason: string;
    risks: string[];
  };
} {
  const scores: {
    [key in AgeGroup]: {
      score: number;
      action: 'BLOCK' | 'GATE' | 'ALLOW';
      reason: string;
      risks: string[];
    };
  } = {
    '<10': { score: 100, action: 'ALLOW', reason: '', risks: [] },
    '10-13': { score: 100, action: 'ALLOW', reason: '', risks: [] },
    '13-16': { score: 100, action: 'ALLOW', reason: '', risks: [] },
    '16+': { score: 100, action: 'ALLOW', reason: '', risks: [] },
  };

  // Apply deductions based on found unsafe keywords
  for (const unsafe of childSafetyAnalysis.unsafeKeywordsFound) {
    const risk = CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category);
    if (risk) {
      for (const ageGroup of AGE_GROUPS) {
        const deduction = risk.deduction[ageGroup] * (Math.min(unsafe.count, 5) / 5);
        scores[ageGroup].score -= deduction;
        if (deduction > 0) {
          scores[ageGroup].risks.push(`${unsafe.category}: "${unsafe.keyword}" (${unsafe.count}x)`);
        }
      }
    }
  }

  // Apply Vision API safe search results
  if (visionSafeSearch) {
    const adultScore = getLikelihoodScore(visionSafeSearch.adult);
    const violenceScore = getLikelihoodScore(visionSafeSearch.violence);
    const racyScore = getLikelihoodScore(visionSafeSearch.racy);

    if (adultScore >= 3) {
      scores['<10'].score -= 100;
      scores['10-13'].score -= 100;
      scores['13-16'].score -= 100;
      scores['16+'].score -= 80;
      for (const ag of AGE_GROUPS) {
        scores[ag].risks.push('Adult content detected in images');
      }
    }
    if (violenceScore >= 3) {
      scores['<10'].score -= 70;
      scores['10-13'].score -= 60;
      scores['13-16'].score -= 40;
      scores['16+'].score -= 20;
      for (const ag of AGE_GROUPS) {
        scores[ag].risks.push('Violence detected in images');
      }
    }
    if (racyScore >= 3) {
      scores['<10'].score -= 50;
      scores['10-13'].score -= 40;
      scores['13-16'].score -= 25;
      scores['16+'].score -= 10;
      for (const ag of AGE_GROUPS) {
        scores[ag].risks.push('Racy content detected in images');
      }
    }
  }

  // Apply multimedia risk
  if (multimediaRisk > 0) {
    for (const ageGroup of AGE_GROUPS) {
      scores[ageGroup].score -= multimediaRisk * (ageGroup === '<10' ? 1.5 : ageGroup === '10-13' ? 1.2 : 1);
      if (multimediaRisk > 20) {
        scores[ageGroup].risks.push('Potentially unsafe multimedia content');
      }
    }
  }

  // Bonus for safe content
  const safeBonus = Math.min(childSafetyAnalysis.safeKeywordsFound.length * 3, 15);
  for (const ageGroup of AGE_GROUPS) {
    scores[ageGroup].score += safeBonus;
  }

  // Clamp scores and determine actions
  for (const ageGroup of AGE_GROUPS) {
    scores[ageGroup].score = Math.max(0, Math.min(100, Math.round(scores[ageGroup].score)));

    if (scores[ageGroup].score >= 80) {
      scores[ageGroup].action = 'ALLOW';
      scores[ageGroup].reason = scores[ageGroup].risks.length === 0
        ? 'Content appears safe for this age group'
        : `Minor concerns detected but content is generally appropriate`;
    } else if (scores[ageGroup].score >= 50) {
      scores[ageGroup].action = 'GATE';
      scores[ageGroup].reason = `Parental guidance recommended: ${scores[ageGroup].risks.slice(0, 3).join('; ')}`;
    } else {
      scores[ageGroup].action = 'BLOCK';
      scores[ageGroup].reason = `Content not suitable: ${scores[ageGroup].risks.slice(0, 3).join('; ')}`;
    }
  }

  return scores;
}

// ============================================================================
// MULTIMEDIA ANALYSIS
// ============================================================================

/**
 * Analyze multimedia content (video, audio) on the page
 */
function analyzeMultimedia(html: string, $: cheerio.CheerioAPI): {
  videoDetected: boolean;
  audioDetected: boolean;
  mediaTypes: string[];
  videoUrls: string[];
  audioUrls: string[];
  iframeUrls: string[];
  mediaSafetyScore: number;
  mediaConcerns: string[];
} {
  const mediaTypes: string[] = [];
  const videoUrls: string[] = [];
  const audioUrls: string[] = [];
  const iframeUrls: string[] = [];
  const mediaConcerns: string[] = [];
  let mediaSafetyScore = 100;

  // Detect video elements
  $('video, video source').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src) {
      videoUrls.push(src);
      mediaTypes.push('video');
    }
  });

  // Detect audio elements
  $('audio, audio source').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src) {
      audioUrls.push(src);
      mediaTypes.push('audio');
    }
  });

  // Detect iframes (YouTube, Vimeo, etc.)
  $('iframe').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src) {
      iframeUrls.push(src);
      if (src.includes('youtube') || src.includes('youtu.be')) {
        mediaTypes.push('youtube');
      } else if (src.includes('vimeo')) {
        mediaTypes.push('vimeo');
      } else if (src.includes('dailymotion')) {
        mediaTypes.push('dailymotion');
      } else if (src.includes('twitch')) {
        mediaTypes.push('twitch');
      } else if (src.includes('tiktok')) {
        mediaTypes.push('tiktok');
        mediaConcerns.push('TikTok content detected - may contain age-inappropriate content');
        mediaSafetyScore -= 20;
      } else {
        mediaTypes.push('iframe');
      }
    }
  });

  // Detect embedded objects
  $('embed, object').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data') || $(el).attr('data-src');
    if (src) {
      mediaTypes.push('embedded');
      if (src.includes('.swf')) {
        mediaConcerns.push('Flash content detected - potentially outdated or insecure');
        mediaSafetyScore -= 10;
      }
    }
  });

  // Check for potentially unsafe media sources
  const allMediaUrls = [...videoUrls, ...audioUrls, ...iframeUrls];
  for (const url of allMediaUrls) {
    const urlLower = url.toLowerCase();

    // Check for adult/unsafe domains in media URLs
    for (const keyword of CHILD_UNSAFE_KEYWORDS.explicit.slice(0, 30)) {
      if (urlLower.includes(keyword)) {
        mediaConcerns.push(`Potentially adult media source detected`);
        mediaSafetyScore -= 50;
        break;
      }
    }
  }

  // Check for live streaming indicators
  if (html.toLowerCase().includes('livestream') || html.toLowerCase().includes('live stream')) {
    mediaConcerns.push('Live streaming content detected - content may be unpredictable');
    mediaSafetyScore -= 15;
  }

  return {
    videoDetected: videoUrls.length > 0 || iframeUrls.some(u => u.includes('youtube') || u.includes('vimeo')),
    audioDetected: audioUrls.length > 0,
    mediaTypes: [...new Set(mediaTypes)],
    videoUrls,
    audioUrls,
    iframeUrls,
    mediaSafetyScore: Math.max(0, mediaSafetyScore),
    mediaConcerns,
  };
}

// ============================================================================
// CONTENT FETCHING & PARSING
// ============================================================================

/**
 * Fetch webpage content
 */
async function fetchWebpageContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KomalSafetyBot/1.0; +https://komalkids.com)',
      },
      signal: AbortSignal.timeout(7000),
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
 * Parse HTML and extract all content for analysis
 */
function parseHTMLContent(html: string, url: string) {
  const $ = cheerio.load(html);

  // Extract metadata
  const title = $('title').text() || $('meta[property="og:title"]').attr('content') || '';
  const description =
    $('meta[name="description"]').attr('content') ||
    $('meta[property="og:description"]').attr('content') ||
    '';
  const keywordsStr = $('meta[name="keywords"]').attr('content') || '';
  const keywords = keywordsStr.split(',').map((k) => k.trim()).filter(Boolean);

  // Extract all text content
  $('script, style').remove();
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const textContent = bodyText.substring(0, 10000); // Analyze up to 10k chars

  // Count media elements
  const imageCount = $('img').length;
  const linkCount = $('a').length;
  const videoCount = $('video').length + $('iframe[src*="youtube"], iframe[src*="vimeo"]').length;
  const audioCount = $('audio').length;

  // Extract image URLs
  const imageUrls: string[] = [];
  $('img').each((_, el) => {
    const src = $(el).attr('src') || $(el).attr('data-src');
    if (src) {
      try {
        const absoluteUrl = new URL(src, url).href;
        imageUrls.push(absoluteUrl);
      } catch {
        // Skip invalid URLs
      }
    }
  });

  // Analyze multimedia
  const multimedia = analyzeMultimedia(html, $);

  return {
    title,
    description,
    keywords,
    textContent,
    imageUrls: imageUrls.slice(0, 10),
    imageCount,
    linkCount,
    videoCount: videoCount + multimedia.videoUrls.length,
    audioCount: audioCount + multimedia.audioUrls.length,
    multimedia,
    $,
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
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 8000 });

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

// ============================================================================
// NLP & VISION ANALYSIS
// ============================================================================

/**
 * Analyze text using Google Cloud Natural Language API
 */
async function analyzeTextWithNLP(text: string) {
  if (!languageClient || !text) {
    return null;
  }

  try {
    const truncatedText = text.substring(0, 5000);

    const [sentimentResult, entityResult] = await Promise.all([
      languageClient.analyzeSentiment({
        document: { content: truncatedText, type: 'PLAIN_TEXT' },
      }),
      languageClient.analyzeEntities({
        document: { content: truncatedText, type: 'PLAIN_TEXT' },
      }),
    ]);

    const sentiment = sentimentResult[0].documentSentiment;
    const sentimentScore = sentiment?.score || 0;

    let sentimentLabel = 'Neutral';
    if (sentimentScore > 0.25) sentimentLabel = 'Positive';
    else if (sentimentScore < -0.25) sentimentLabel = 'Concerning';

    const entities = entityResult[0].entities?.map((e) => e.name || '').filter(Boolean) || [];

    return {
      sentiment: sentimentLabel,
      sentimentScore,
      entities: entities.slice(0, 10),
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

    const requests: Promise<any>[] = [];

    // Analyze screenshot
    if (screenshot) {
      requests.push(
        visionClient.annotateImage({
          image: { content: screenshot },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'SAFE_SEARCH_DETECTION' },
            { type: 'OBJECT_LOCALIZATION', maxResults: 10 },
          ],
        }).catch(() => [null])
      );
    }

    // Analyze page images
    for (const imageUrl of imageUrls.slice(0, 3)) {
      requests.push(
        visionClient.annotateImage({
          image: { source: { imageUri: imageUrl } },
          features: [
            { type: 'LABEL_DETECTION', maxResults: 5 },
            { type: 'SAFE_SEARCH_DETECTION' },
          ],
        }).catch(() => [null])
      );
    }

    const allResults = await Promise.all(requests);

    for (const [result] of allResults) {
      if (!result) continue;

      const highConfLabels = result.labelAnnotations
        ?.filter((l: any) => (l.score || 0) > 0.7)
        ?.map((l: any) => l.description || '') || [];
      results.labels.push(...highConfLabels);

      if (result.localizedObjectAnnotations) {
        const objects = result.localizedObjectAnnotations
          ?.filter((o: any) => (o.score || 0) > 0.6)
          ?.map((o: any) => o.name || '') || [];
        results.detectedObjects.push(...objects);
      }

      if (result.safeSearchAnnotation) {
        if (!results.safeSearchAnnotation) {
          results.safeSearchAnnotation = result.safeSearchAnnotation;
        } else {
          const current = results.safeSearchAnnotation;
          const newAnnotation = result.safeSearchAnnotation;
          results.safeSearchAnnotation = {
            adult: Math.max(getLikelihoodScore(current.adult), getLikelihoodScore(newAnnotation.adult)),
            violence: Math.max(getLikelihoodScore(current.violence), getLikelihoodScore(newAnnotation.violence)),
            racy: Math.max(getLikelihoodScore(current.racy), getLikelihoodScore(newAnnotation.racy)),
          };
        }
      }
    }

    results.labels = [...new Set(results.labels)].slice(0, 10);
    results.detectedObjects = [...new Set(results.detectedObjects)].slice(0, 8);

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
  if (typeof likelihood === 'number') {
    switch (likelihood) {
      case 5:
        return 4;
      case 4:
        return 3;
      case 3:
        return 2;
      case 2:
        return 1;
      case 1:
        return 0;
      default:
        return 0;
    }
  }

  switch (likelihood) {
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

// ============================================================================
// MAIN ANALYSIS FUNCTION
// ============================================================================

async function analyzeUrlForChildSafety(url: string): Promise<ScanResult> {
  try {
    console.log('Fetching webpage content...');
    const htmlPromise = fetchWebpageContent(url);
    const screenshotPromise = visionClient ? captureScreenshot(url) : Promise.resolve(null);
    const html = await htmlPromise;

    console.log('Parsing HTML and extracting content...');
    const parsedContent = parseHTMLContent(html, url);

    console.log('Analyzing text with NLP...');
    const nlpPromise = analyzeTextWithNLP(parsedContent.textContent);

    console.log('Analyzing images with Vision API...');
    const visionPromise = screenshotPromise.then((screenshot) =>
      analyzeImagesWithVision(parsedContent.imageUrls, screenshot)
    );

    console.log('Performing child safety analysis...');
    const childSafetyAnalysis = analyzeChildSafety(
      parsedContent.textContent,
      parsedContent.title,
      parsedContent.description,
      parsedContent.keywords
    );

    // Perform deep keyword vectorization analysis
    console.log('Performing deep keyword analysis...');
    const categoryKeywords = loadAndVectorizeKeywords();
    const wordFrequencies = extractWordFrequencies(parsedContent.textContent);
    const similarityMatches = findSimilarKeywords(wordFrequencies, categoryKeywords, 50, parsedContent.textContent);
    const similarityReport = generateSimilarityReport(similarityMatches, wordFrequencies);

    const [nlpResults, visionResults] = await Promise.all([nlpPromise, visionPromise]);

    // Calculate multimedia risk
    const multimediaRisk = 100 - parsedContent.multimedia.mediaSafetyScore;

    // Calculate age group scores
    const ageGroupScores = calculateAgeGroupScores(
      childSafetyAnalysis,
      visionResults?.safeSearchAnnotation,
      multimediaRisk
    );

    // Calculate overall score (average of all age groups)
    const overallScore = Math.round(
      Object.values(ageGroupScores).reduce((sum, ag) => sum + ag.score, 0) / AGE_GROUPS.length
    );

    // Build risk categories from analysis
    const riskCategories = childSafetyAnalysis.unsafeKeywordsFound.map(unsafe => ({
      category: unsafe.category,
      severity: CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category)?.severity || 'low',
      matchCount: unsafe.count,
      matchedKeywords: [unsafe.keyword],
      contextSnippets: unsafe.context,
    }));

    // Build depth analysis
    const titleSafe = !childSafetyAnalysis.unsafeKeywordsFound.some(u =>
      parsedContent.title.toLowerCase().includes(u.keyword)
    );
    const metadataSafe = !childSafetyAnalysis.unsafeKeywordsFound.some(u =>
      (parsedContent.description + ' ' + parsedContent.keywords.join(' ')).toLowerCase().includes(u.keyword)
    );
    const contentSafe = childSafetyAnalysis.riskLevel === 'safe' || childSafetyAnalysis.riskLevel === 'caution';
    const mediaSafe = parsedContent.multimedia.mediaSafetyScore >= 80;

    const result: ScanResult = {
      url,
      overallScore,
      ageGroupScores,
      contentAnalysis: {
        textAnalysis: {
          sentiment: nlpResults?.sentiment || 'Neutral',
          keyTopics: similarityReport.topCategories.slice(0, 5).map(c => c.category),
          languageScore: Math.max(0, 100 - childSafetyAnalysis.riskScore * 2),
          entities: nlpResults?.entities || [],
          unsafeKeywordsFound: childSafetyAnalysis.unsafeKeywordsFound.map(u => u.keyword),
          safeKeywordsFound: childSafetyAnalysis.safeKeywordsFound,
        },
        visualAnalysis: {
          detectedObjects: visionResults?.detectedObjects || [],
          safetyScore: visionResults?.safeSearchAnnotation
            ? Math.max(0, 100 - getLikelihoodScore(visionResults.safeSearchAnnotation.adult) * 20
                - getLikelihoodScore(visionResults.safeSearchAnnotation.violence) * 15)
            : 100,
          concerns: [],
          labels: visionResults?.labels || [],
        },
        multimediaAnalysis: {
          videoDetected: parsedContent.multimedia.videoDetected,
          audioDetected: parsedContent.multimedia.audioDetected,
          mediaTypes: parsedContent.multimedia.mediaTypes,
          mediaSafetyScore: parsedContent.multimedia.mediaSafetyScore,
          mediaConcerns: parsedContent.multimedia.mediaConcerns,
        },
        metadata: {
          title: parsedContent.title,
          description: parsedContent.description,
          keywords: parsedContent.keywords,
          imageCount: parsedContent.imageCount,
          linkCount: parsedContent.linkCount,
          videoCount: parsedContent.videoCount,
          audioCount: parsedContent.audioCount,
        },
      },
      childSafetyAnalysis: {
        overallRisk: childSafetyAnalysis.riskLevel,
        riskCategories,
        depthAnalysis: {
          titleSafe,
          metadataSafe,
          contentSafe,
          mediaSafe,
        },
      },
      timestamp: new Date().toISOString(),
      analysisMethod: visionClient && languageClient ? 'live' : 'demo',
    };

    // Add vision concerns if detected
    if (visionResults?.safeSearchAnnotation) {
      if (getLikelihoodScore(visionResults.safeSearchAnnotation.adult) >= 3) {
        result.contentAnalysis.visualAnalysis.concerns.push('Adult content detected');
      }
      if (getLikelihoodScore(visionResults.safeSearchAnnotation.violence) >= 3) {
        result.contentAnalysis.visualAnalysis.concerns.push('Violence detected');
      }
      if (getLikelihoodScore(visionResults.safeSearchAnnotation.racy) >= 3) {
        result.contentAnalysis.visualAnalysis.concerns.push('Racy content detected');
      }
    }

    return result;
  } catch (error) {
    console.error('Error in live analysis, falling back to demo mode:', error);
    return generateDemoAnalysis(url);
  }
}

/**
 * Fallback demo analysis when live analysis fails
 */
function generateDemoAnalysis(url: string): ScanResult {
  const urlLower = url.toLowerCase();

  // Check URL for unsafe keywords
  const childSafetyAnalysis = analyzeChildSafety(urlLower, '', '', []);

  // Basic URL pattern detection
  const isEducational = /edu|learn|wiki|school|kids|child/i.test(urlLower);
  const isNews = /news|cnn|bbc|times/i.test(urlLower);
  const isSocial = /facebook|instagram|tiktok|twitter|snapchat/i.test(urlLower);
  const isGaming = /game|steam|xbox|playstation|twitch/i.test(urlLower);
  const isVideo = /youtube|vimeo|dailymotion/i.test(urlLower);

  // Calculate base scores
  let baseScore = 75;
  if (isEducational) baseScore = 95;
  else if (isSocial) baseScore = 60;
  else if (isGaming) baseScore = 65;
  else if (isNews) baseScore = 70;
  else if (isVideo) baseScore = 70;

  // Apply child safety deductions
  baseScore -= childSafetyAnalysis.riskScore * 2;
  baseScore = Math.max(0, Math.min(100, baseScore));

  const ageGroupScores = calculateAgeGroupScores(childSafetyAnalysis, null, 0);

  // Adjust demo scores based on URL patterns
  if (isEducational) {
    for (const ag of AGE_GROUPS) {
      ageGroupScores[ag].score = Math.min(100, ageGroupScores[ag].score + 20);
      if (ageGroupScores[ag].score >= 80) {
        ageGroupScores[ag].action = 'ALLOW';
        ageGroupScores[ag].reason = 'Educational content detected';
      }
    }
  }

  if (isSocial) {
    ageGroupScores['<10'].score = Math.max(0, ageGroupScores['<10'].score - 30);
    ageGroupScores['10-13'].score = Math.max(0, ageGroupScores['10-13'].score - 20);
    ageGroupScores['<10'].action = 'GATE';
    ageGroupScores['<10'].reason = 'Social media requires parental supervision for young children';
    ageGroupScores['10-13'].action = 'GATE';
    ageGroupScores['10-13'].reason = 'Social media recommended with parental guidance';
  }

  const overallScore = Math.round(
    Object.values(ageGroupScores).reduce((sum, ag) => sum + ag.score, 0) / AGE_GROUPS.length
  );

  return {
    url,
    overallScore,
    ageGroupScores,
    contentAnalysis: {
      textAnalysis: {
        sentiment: 'Neutral',
        keyTopics: isEducational ? ['Education'] : isNews ? ['News'] : isSocial ? ['Social Media'] : ['General'],
        languageScore: baseScore,
        unsafeKeywordsFound: childSafetyAnalysis.unsafeKeywordsFound.map(u => u.keyword),
        safeKeywordsFound: childSafetyAnalysis.safeKeywordsFound,
      },
      visualAnalysis: {
        detectedObjects: [],
        safetyScore: baseScore,
        concerns: [],
      },
      multimediaAnalysis: {
        videoDetected: isVideo,
        audioDetected: false,
        mediaTypes: isVideo ? ['video'] : [],
        mediaSafetyScore: 100,
        mediaConcerns: [],
      },
      metadata: {
        title: 'Demo Mode Analysis',
        description: 'URL-based pattern analysis (live content not fetched)',
        keywords: [],
        imageCount: 0,
        linkCount: 0,
        videoCount: isVideo ? 1 : 0,
        audioCount: 0,
      },
    },
    childSafetyAnalysis: {
      overallRisk: childSafetyAnalysis.riskLevel,
      riskCategories: childSafetyAnalysis.unsafeKeywordsFound.map(u => ({
        category: u.category,
        severity: CHILD_SAFETY_RISKS.find(r => r.category === u.category)?.severity || 'low',
        matchCount: u.count,
        matchedKeywords: [u.keyword],
        contextSnippets: u.context,
      })),
      depthAnalysis: {
        titleSafe: true,
        metadataSafe: true,
        contentSafe: childSafetyAnalysis.riskLevel === 'safe',
        mediaSafe: true,
      },
    },
    timestamp: new Date().toISOString(),
    analysisMethod: 'demo',
  };
}

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

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

    // Perform child safety analysis
    const result = await analyzeUrlForChildSafety(url);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scanning URL:', error);
    return NextResponse.json({ error: 'Failed to scan URL' }, { status: 500 });
  }
}
