import { NextRequest, NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { ImageAnnotatorClient } from '@google-cloud/vision';
import { LanguageServiceClient } from '@google-cloud/language';

// ============================================================================
// OPTIMIZED CHILD SAFETY SCORING SYSTEM
// ============================================================================

// Age groups for content safety analysis
const AGE_GROUPS = ['<10', '10-13', '13-16', '16+'] as const;
type AgeGroup = (typeof AGE_GROUPS)[number];

// Pre-compiled regex patterns for faster matching
const CHILD_UNSAFE_PATTERNS: { [category: string]: RegExp } = {};
const CHILD_UNSAFE_KEYWORDS = {
  explicit: [
    'porn', 'xxx', 'sex', 'nsfw', 'nude', 'naked', 'erotic', 'fetish',
    'webcam', 'livecam', 'chaturbate', 'onlyfans', 'fansly',
    'xvideos', 'xnxx', 'pornhub', 'redtube', 'youporn', 'xhamster', 'brazzers',
    'hentai', 'rule34', 'nhentai', 'escort', 'hooker', 'prostitut', 'brothel',
    'milf', 'anal', 'blowjob', 'cumshot', 'orgasm', 'masturbat',
    'stripchat', 'bongacams', 'livejasmin', 'bdsm', 'bondage',
    'threesome', 'gangbang', 'orgy', 'incest', 'rape', 'molest',
    'penis', 'vagina', 'cock', 'dick', 'pussy', 'tits', 'boobs',
  ],
  violence: [
    'gore', 'gory', 'mutilat', 'dismember', 'decapitat', 'behead',
    'torture', 'brutal', 'savage', 'slaughter', 'massacre',
    'murder', 'kill', 'killing', 'corpse', 'cadaver',
    'bloody', 'bleeding', 'wound', 'weapon', 'gun', 'firearm',
    'shoot', 'shooting', 'stab', 'stabbing', 'bomb', 'explosive',
    'suicide', 'suicidal', 'self-harm', 'terrorist', 'terrorism',
  ],
  substances: [
    'drug', 'drugs', 'cocaine', 'heroin', 'meth', 'methamphetamine',
    'marijuana', 'cannabis', 'weed', 'lsd', 'ecstasy', 'mdma', 'ketamine',
    'opioid', 'fentanyl', 'overdose', 'drunk', 'intoxicat',
    'smoking', 'cigarette', 'tobacco', 'vape', 'vaping',
    'addiction', 'addict',
  ],
  gambling: [
    'gambling', 'gamble', 'casino', 'betting', 'poker',
    'slot', 'slots', 'roulette', 'blackjack', 'lottery',
    'sportsbook', 'bookmaker', 'wager',
  ],
  hate: [
    'racist', 'racism', 'nazi', 'fascist', 'supremacist',
    'hatred', 'bigot', 'discriminat', 'antisemit', 'islamophob', 'homophob',
  ],
  profanity: [
    'fuck', 'shit', 'asshole', 'bitch', 'bastard',
    'cunt', 'whore', 'slut', 'nigger', 'nigga', 'faggot', 'retard',
  ],
  dangerous: [
    'blackout challenge', 'choking game', 'tide pod',
    'fire challenge', 'skull breaker',
  ],
  predatory: [
    'grooming', 'predator', 'pedophil', 'underage',
    'child abuse', 'trafficking',
  ],
};

// Pre-compile regex patterns at module load for performance
for (const [category, keywords] of Object.entries(CHILD_UNSAFE_KEYWORDS)) {
  const pattern = keywords.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  CHILD_UNSAFE_PATTERNS[category] = new RegExp(`\\b(${pattern})`, 'gi');
}

const CHILD_SAFE_KEYWORDS = [
  'educational', 'education', 'learn', 'learning', 'teach', 'teaching',
  'school', 'homework', 'study', 'student', 'classroom',
  'kids', 'children', 'family', 'parents', 'child-friendly',
  'cartoon', 'animation', 'disney', 'pixar', 'nickelodeon',
  'science', 'math', 'history', 'geography', 'reading', 'writing',
  'arts', 'crafts', 'music', 'dance', 'sports',
  'nature', 'animals', 'wildlife', 'environment',
  'safe', 'appropriate', 'wholesome', 'pbs', 'sesame',
];

const SAFE_PATTERN = new RegExp(`\\b(${CHILD_SAFE_KEYWORDS.join('|')})`, 'gi');

interface ChildSafetyRisk {
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  deduction: { '<10': number; '10-13': number; '13-16': number; '16+': number };
}

const CHILD_SAFETY_RISKS: ChildSafetyRisk[] = [
  { category: 'explicit', severity: 'critical', deduction: { '<10': 100, '10-13': 100, '13-16': 100, '16+': 80 } },
  { category: 'predatory', severity: 'critical', deduction: { '<10': 100, '10-13': 100, '13-16': 100, '16+': 100 } },
  { category: 'violence', severity: 'high', deduction: { '<10': 80, '10-13': 70, '13-16': 50, '16+': 30 } },
  { category: 'substances', severity: 'high', deduction: { '<10': 90, '10-13': 80, '13-16': 60, '16+': 40 } },
  { category: 'gambling', severity: 'high', deduction: { '<10': 90, '10-13': 85, '13-16': 70, '16+': 50 } },
  { category: 'hate', severity: 'high', deduction: { '<10': 90, '10-13': 85, '13-16': 75, '16+': 60 } },
  { category: 'profanity', severity: 'medium', deduction: { '<10': 60, '10-13': 50, '13-16': 30, '16+': 15 } },
  { category: 'dangerous', severity: 'high', deduction: { '<10': 85, '10-13': 75, '13-16': 55, '16+': 35 } },
];

// ============================================================================
// INTERFACES
// ============================================================================

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
// LAZY-LOADED GOOGLE CLOUD CLIENTS
// ============================================================================

let visionClient: ImageAnnotatorClient | null = null;
let languageClient: LanguageServiceClient | null = null;
let clientsInitialized = false;

function initializeClients() {
  if (clientsInitialized) return;
  clientsInitialized = true;

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
    console.warn('Google Cloud APIs not configured:', error);
  }
}

// ============================================================================
// OPTIMIZED CHILD SAFETY ANALYSIS (Using pre-compiled regex)
// ============================================================================

function analyzeChildSafetyFast(
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
  // Combine all content (limit to 15k chars for speed)
  const allContent = `${title} ${description} ${keywords.join(' ')} ${text}`.toLowerCase().slice(0, 15000);
  const unsafeKeywordsFound: { category: string; keyword: string; count: number; context: string[] }[] = [];

  // Use pre-compiled patterns for fast matching
  for (const [category, pattern] of Object.entries(CHILD_UNSAFE_PATTERNS)) {
    const matches = allContent.match(pattern);
    if (matches && matches.length > 0) {
      // Group matches by keyword
      const keywordCounts: { [key: string]: number } = {};
      for (const match of matches) {
        const normalized = match.toLowerCase();
        keywordCounts[normalized] = (keywordCounts[normalized] || 0) + 1;
      }

      for (const [keyword, count] of Object.entries(keywordCounts)) {
        // Get one context snippet (fast approach)
        const pos = allContent.indexOf(keyword);
        const context = pos >= 0
          ? ['...' + allContent.slice(Math.max(0, pos - 25), Math.min(allContent.length, pos + keyword.length + 25)).trim() + '...']
          : [];

        unsafeKeywordsFound.push({ category, keyword, count, context });
      }
    }
  }

  // Find safe keywords using pre-compiled pattern
  const safeMatches = allContent.match(SAFE_PATTERN);
  const safeKeywordsFound = safeMatches ? [...new Set(safeMatches.map(m => m.toLowerCase()))] : [];

  // Calculate risk score
  let riskScore = 0;
  for (const unsafe of unsafeKeywordsFound) {
    const risk = CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category);
    if (risk) {
      const severityMultiplier = risk.severity === 'critical' ? 10 : risk.severity === 'high' ? 6 : risk.severity === 'medium' ? 3 : 1;
      riskScore += Math.min(unsafe.count, 5) * severityMultiplier;
    }
  }

  // Reduce risk for safe content
  riskScore = Math.max(0, riskScore - Math.min(safeKeywordsFound.length * 2, 30));

  // Determine risk level
  let riskLevel: 'safe' | 'caution' | 'unsafe' | 'dangerous' = 'safe';
  if (riskScore >= 50) riskLevel = 'dangerous';
  else if (riskScore >= 25) riskLevel = 'unsafe';
  else if (riskScore >= 10) riskLevel = 'caution';

  return { unsafeKeywordsFound, safeKeywordsFound, riskScore, riskLevel };
}

// ============================================================================
// OPTIMIZED AGE GROUP SCORING
// ============================================================================

function calculateAgeGroupScores(
  childSafetyAnalysis: ReturnType<typeof analyzeChildSafetyFast>,
  visionSafeSearch: any,
  multimediaRisk: number = 0
): {
  [key in AgeGroup]: { score: number; action: 'BLOCK' | 'GATE' | 'ALLOW'; reason: string; risks: string[] };
} {
  const scores: { [key in AgeGroup]: { score: number; action: 'BLOCK' | 'GATE' | 'ALLOW'; reason: string; risks: string[] } } = {
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
        if (deduction > 0 && scores[ageGroup].risks.length < 3) {
          scores[ageGroup].risks.push(`${unsafe.category}: "${unsafe.keyword}"`);
        }
      }
    }
  }

  // Apply Vision API safe search results if available
  if (visionSafeSearch) {
    const adultScore = getLikelihoodScore(visionSafeSearch.adult);
    const violenceScore = getLikelihoodScore(visionSafeSearch.violence);

    if (adultScore >= 3) {
      scores['<10'].score -= 100; scores['10-13'].score -= 100;
      scores['13-16'].score -= 100; scores['16+'].score -= 80;
      for (const ag of AGE_GROUPS) scores[ag].risks.push('Adult content in images');
    }
    if (violenceScore >= 3) {
      scores['<10'].score -= 70; scores['10-13'].score -= 60;
      scores['13-16'].score -= 40; scores['16+'].score -= 20;
      for (const ag of AGE_GROUPS) scores[ag].risks.push('Violence in images');
    }
  }

  // Apply multimedia risk
  if (multimediaRisk > 20) {
    for (const ageGroup of AGE_GROUPS) {
      scores[ageGroup].score -= multimediaRisk * (ageGroup === '<10' ? 0.5 : 0.3);
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
    const s = scores[ageGroup];

    if (s.score >= 80) {
      s.action = 'ALLOW';
      s.reason = s.risks.length === 0 ? 'Content appears safe for this age group' : 'Minor concerns but generally appropriate';
    } else if (s.score >= 50) {
      s.action = 'GATE';
      s.reason = `Parental guidance recommended: ${s.risks.slice(0, 2).join('; ')}`;
    } else {
      s.action = 'BLOCK';
      s.reason = `Content not suitable: ${s.risks.slice(0, 2).join('; ')}`;
    }
  }

  return scores;
}

// ============================================================================
// FAST MULTIMEDIA ANALYSIS (No external calls)
// ============================================================================

function analyzeMultimediaFast(html: string, $: cheerio.CheerioAPI): {
  videoDetected: boolean;
  audioDetected: boolean;
  mediaTypes: string[];
  mediaSafetyScore: number;
  mediaConcerns: string[];
} {
  const mediaTypes: string[] = [];
  const mediaConcerns: string[] = [];
  let mediaSafetyScore = 100;

  // Quick checks for media elements
  const hasVideo = $('video').length > 0;
  const hasAudio = $('audio').length > 0;
  const iframes = $('iframe');

  if (hasVideo) mediaTypes.push('video');
  if (hasAudio) mediaTypes.push('audio');

  // Check iframes for video platforms
  iframes.each((_, el) => {
    const src = $(el).attr('src') || '';
    if (src.includes('youtube') || src.includes('youtu.be')) mediaTypes.push('youtube');
    else if (src.includes('vimeo')) mediaTypes.push('vimeo');
    else if (src.includes('tiktok')) {
      mediaTypes.push('tiktok');
      mediaConcerns.push('TikTok content - may contain age-inappropriate content');
      mediaSafetyScore -= 20;
    }
    else if (src.includes('twitch')) mediaTypes.push('twitch');
  });

  // Check media URLs for adult content (quick check on src attributes)
  const allSrcs = $('video, audio, iframe, embed, object').map((_, el) => $(el).attr('src') || '').get().join(' ').toLowerCase();
  for (const keyword of CHILD_UNSAFE_KEYWORDS.explicit.slice(0, 15)) {
    if (allSrcs.includes(keyword)) {
      mediaConcerns.push('Potentially adult media source');
      mediaSafetyScore -= 50;
      break;
    }
  }

  return {
    videoDetected: hasVideo || mediaTypes.some(t => ['youtube', 'vimeo', 'tiktok', 'twitch'].includes(t)),
    audioDetected: hasAudio,
    mediaTypes: [...new Set(mediaTypes)],
    mediaSafetyScore: Math.max(0, mediaSafetyScore),
    mediaConcerns,
  };
}

// ============================================================================
// FAST CONTENT FETCHING (3 second timeout)
// ============================================================================

async function fetchWebpageContentFast(url: string): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; KomalSafetyBot/1.0)',
        'Accept': 'text/html',
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// ============================================================================
// FAST HTML PARSING
// ============================================================================

function parseHTMLContentFast(html: string, url: string) {
  const $ = cheerio.load(html);

  const title = $('title').first().text() || $('meta[property="og:title"]').attr('content') || '';
  const description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
  const keywordsStr = $('meta[name="keywords"]').attr('content') || '';
  const keywords = keywordsStr.split(',').map(k => k.trim()).filter(Boolean).slice(0, 10);

  // Remove scripts/styles and get text (limit to 8k for speed)
  $('script, style, nav, footer, header').remove();
  const textContent = $('body').text().replace(/\s+/g, ' ').trim().slice(0, 8000);

  // Quick counts
  const imageCount = $('img').length;
  const linkCount = $('a').length;
  const videoCount = $('video, iframe[src*="youtube"], iframe[src*="vimeo"]').length;
  const audioCount = $('audio').length;

  // Get first 5 image URLs for potential Vision API analysis
  const imageUrls: string[] = [];
  $('img').slice(0, 5).each((_, el) => {
    const src = $(el).attr('src');
    if (src) {
      try {
        imageUrls.push(new URL(src, url).href);
      } catch { /* skip */ }
    }
  });

  const multimedia = analyzeMultimediaFast(html, $);

  return { title, description, keywords, textContent, imageUrls, imageCount, linkCount, videoCount, audioCount, multimedia };
}

// ============================================================================
// OPTIONAL VISION API (Single image, with timeout)
// ============================================================================

async function analyzeImageFast(imageUrl: string): Promise<any> {
  if (!visionClient) return null;

  try {
    const [result] = await Promise.race([
      visionClient.annotateImage({
        image: { source: { imageUri: imageUrl } },
        features: [{ type: 'SAFE_SEARCH_DETECTION' }],
      }),
      new Promise<[null]>((_, reject) => setTimeout(() => reject(new Error('Vision timeout')), 2000)),
    ]);
    return result?.safeSearchAnnotation || null;
  } catch {
    return null;
  }
}

// ============================================================================
// OPTIONAL NLP (With timeout)
// ============================================================================

async function analyzeTextFast(text: string): Promise<{ sentiment: string; entities: string[] } | null> {
  if (!languageClient || !text) return null;

  try {
    const truncated = text.slice(0, 3000);
    const [sentimentResult] = await Promise.race([
      languageClient.analyzeSentiment({ document: { content: truncated, type: 'PLAIN_TEXT' } }),
      new Promise<[null]>((_, reject) => setTimeout(() => reject(new Error('NLP timeout')), 2000)),
    ]);

    const score = sentimentResult?.documentSentiment?.score || 0;
    return {
      sentiment: score > 0.25 ? 'Positive' : score < -0.25 ? 'Concerning' : 'Neutral',
      entities: [],
    };
  } catch {
    return null;
  }
}

function getLikelihoodScore(likelihood: string | number | null | undefined): number {
  const str = String(likelihood || '');
  if (str === 'VERY_LIKELY' || str === '4') return 4;
  if (str === 'LIKELY' || str === '3') return 3;
  if (str === 'POSSIBLE' || str === '2') return 2;
  if (str === 'UNLIKELY' || str === '1') return 1;
  return 0;
}

// ============================================================================
// MAIN OPTIMIZED ANALYSIS
// ============================================================================

async function analyzeUrlOptimized(url: string): Promise<ScanResult> {
  const startTime = Date.now();
  initializeClients();

  try {
    // Step 1: Fetch webpage (fast, 3s timeout)
    const html = await fetchWebpageContentFast(url);
    console.log(`Fetch: ${Date.now() - startTime}ms`);

    // Step 2: Parse HTML (synchronous, fast)
    const parsed = parseHTMLContentFast(html, url);
    console.log(`Parse: ${Date.now() - startTime}ms`);

    // Step 3: Child safety analysis (synchronous, fast with pre-compiled regex)
    const childSafetyAnalysis = analyzeChildSafetyFast(
      parsed.textContent,
      parsed.title,
      parsed.description,
      parsed.keywords
    );
    console.log(`Safety analysis: ${Date.now() - startTime}ms`);

    // Step 4: Run optional API calls in parallel (with timeouts)
    const [visionResult, nlpResult] = await Promise.all([
      parsed.imageUrls[0] ? analyzeImageFast(parsed.imageUrls[0]) : Promise.resolve(null),
      analyzeTextFast(parsed.textContent.slice(0, 2000)),
    ]);
    console.log(`API calls: ${Date.now() - startTime}ms`);

    // Step 5: Calculate scores
    const multimediaRisk = 100 - parsed.multimedia.mediaSafetyScore;
    const ageGroupScores = calculateAgeGroupScores(childSafetyAnalysis, visionResult, multimediaRisk);
    const overallScore = Math.round(
      Object.values(ageGroupScores).reduce((sum, ag) => sum + ag.score, 0) / AGE_GROUPS.length
    );

    // Build risk categories
    const riskCategories = childSafetyAnalysis.unsafeKeywordsFound.slice(0, 5).map(unsafe => ({
      category: unsafe.category,
      severity: CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category)?.severity || 'low',
      matchCount: unsafe.count,
      matchedKeywords: [unsafe.keyword],
      contextSnippets: unsafe.context,
    }));

    // Depth analysis
    const titleLower = parsed.title.toLowerCase();
    const metaLower = (parsed.description + ' ' + parsed.keywords.join(' ')).toLowerCase();
    const titleSafe = !childSafetyAnalysis.unsafeKeywordsFound.some(u => titleLower.includes(u.keyword));
    const metadataSafe = !childSafetyAnalysis.unsafeKeywordsFound.some(u => metaLower.includes(u.keyword));

    console.log(`Total: ${Date.now() - startTime}ms`);

    return {
      url,
      overallScore,
      ageGroupScores,
      contentAnalysis: {
        textAnalysis: {
          sentiment: nlpResult?.sentiment || 'Neutral',
          keyTopics: [],
          languageScore: Math.max(0, 100 - childSafetyAnalysis.riskScore * 2),
          entities: nlpResult?.entities || [],
          unsafeKeywordsFound: childSafetyAnalysis.unsafeKeywordsFound.map(u => u.keyword),
          safeKeywordsFound: childSafetyAnalysis.safeKeywordsFound,
        },
        visualAnalysis: {
          detectedObjects: [],
          safetyScore: visionResult
            ? Math.max(0, 100 - getLikelihoodScore(visionResult.adult) * 20 - getLikelihoodScore(visionResult.violence) * 15)
            : 100,
          concerns: visionResult && getLikelihoodScore(visionResult.adult) >= 3 ? ['Adult content detected'] : [],
          labels: [],
        },
        multimediaAnalysis: parsed.multimedia,
        metadata: {
          title: parsed.title,
          description: parsed.description,
          keywords: parsed.keywords,
          imageCount: parsed.imageCount,
          linkCount: parsed.linkCount,
          videoCount: parsed.videoCount,
          audioCount: parsed.audioCount,
        },
      },
      childSafetyAnalysis: {
        overallRisk: childSafetyAnalysis.riskLevel,
        riskCategories,
        depthAnalysis: {
          titleSafe,
          metadataSafe,
          contentSafe: childSafetyAnalysis.riskLevel === 'safe' || childSafetyAnalysis.riskLevel === 'caution',
          mediaSafe: parsed.multimedia.mediaSafetyScore >= 80,
        },
      },
      timestamp: new Date().toISOString(),
      analysisMethod: visionClient || languageClient ? 'live' : 'demo',
    };
  } catch (error) {
    console.error('Error in analysis, using demo mode:', error);
    return generateDemoAnalysisFast(url);
  }
}

// ============================================================================
// FAST DEMO ANALYSIS (When live fails)
// ============================================================================

function generateDemoAnalysisFast(url: string): ScanResult {
  const urlLower = url.toLowerCase();
  const childSafetyAnalysis = analyzeChildSafetyFast(urlLower, '', '', []);

  // Quick URL pattern detection
  const isEducational = /edu|learn|wiki|school|kids|child/i.test(urlLower);
  const isSocial = /facebook|instagram|tiktok|twitter|snapchat/i.test(urlLower);

  const ageGroupScores = calculateAgeGroupScores(childSafetyAnalysis, null, 0);

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
    ageGroupScores['<10'].action = ageGroupScores['<10'].score >= 50 ? 'GATE' : 'BLOCK';
    ageGroupScores['10-13'].action = ageGroupScores['10-13'].score >= 50 ? 'GATE' : 'BLOCK';
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
        keyTopics: isEducational ? ['Education'] : isSocial ? ['Social Media'] : ['General'],
        languageScore: overallScore,
        unsafeKeywordsFound: childSafetyAnalysis.unsafeKeywordsFound.map(u => u.keyword),
        safeKeywordsFound: childSafetyAnalysis.safeKeywordsFound,
      },
      visualAnalysis: { detectedObjects: [], safetyScore: 100, concerns: [] },
      multimediaAnalysis: { videoDetected: false, audioDetected: false, mediaTypes: [], mediaSafetyScore: 100, mediaConcerns: [] },
      metadata: { title: 'Demo Mode', description: 'URL-based analysis', keywords: [], imageCount: 0, linkCount: 0, videoCount: 0, audioCount: 0 },
    },
    childSafetyAnalysis: {
      overallRisk: childSafetyAnalysis.riskLevel,
      riskCategories: childSafetyAnalysis.unsafeKeywordsFound.slice(0, 3).map(u => ({
        category: u.category,
        severity: CHILD_SAFETY_RISKS.find(r => r.category === u.category)?.severity || 'low',
        matchCount: u.count,
        matchedKeywords: [u.keyword],
        contextSnippets: u.context,
      })),
      depthAnalysis: { titleSafe: true, metadataSafe: true, contentSafe: childSafetyAnalysis.riskLevel === 'safe', mediaSafe: true },
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

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
    }

    const result = await analyzeUrlOptimized(url);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error scanning URL:', error);
    return NextResponse.json({ error: 'Failed to scan URL' }, { status: 500 });
  }
}
