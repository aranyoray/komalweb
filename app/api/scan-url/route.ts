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

// ============================================================================
// CONTEXT-AWARE KEYWORD ANALYSIS
// Safe context patterns that indicate benign usage of potentially flagged words
// ============================================================================

const SAFE_CONTEXT_PATTERNS: { [keyword: string]: RegExp[] } = {
  // Violence-related words in safe contexts
  'gun': [/water\s*gun/i, /glue\s*gun/i, /nail\s*gun/i, /spray\s*gun/i, /gun\s*control/i, /nerf\s*gun/i, /toy\s*gun/i, /starter\s*gun/i, /gun\s*safety/i],
  'shoot': [/photo\s*shoot/i, /shoot\s*photos/i, /shoot\s*video/i, /basketball\s*shoot/i, /shoot\s*hoops/i, /shoot\s*for/i, /trouble\s*shoot/i],
  'shooting': [/photo\s*shooting/i, /shooting\s*star/i, /shooting\s*hoops/i, /basketball\s*shooting/i, /video\s*shooting/i, /trouble\s*shooting/i],
  'kill': [/kill\s*time/i, /kill\s*two\s*birds/i, /killing\s*it/i, /kill\s*the\s*engine/i, /kill\s*switch/i, /kill\s*bill/i, /dressed\s*to\s*kill/i, /overkill/i],
  'killing': [/killing\s*it/i, /killing\s*time/i, /mercy\s*killing/i, /not\s*killing/i],
  'bomb': [/bomb\s*diggity/i, /bomb\.com/i, /da\s*bomb/i, /bomb\s*dot\s*com/i, /bath\s*bomb/i, /cherry\s*bomb/i, /bomb\s*pop/i, /bomb\s*squad.*game/i],
  'shot': [/screen\s*shot/i, /shot\s*glass/i, /shot\s*put/i, /big\s*shot/i, /long\s*shot/i, /flu\s*shot/i, /vaccine\s*shot/i, /photo\s*shot/i, /one\s*shot/i],
  'stab': [/stab\s*at/i, /take\s*a\s*stab/i],
  'wound': [/wound\s*up/i, /wound\s*around/i, /wound\s*down/i],
  'bloody': [/bloody\s*mary/i, /bloody\s*hell/i, /bloody\s*good/i], // British slang
  'weapon': [/secret\s*weapon/i, /weapon\s*of\s*choice/i],
  
  // Substance-related words in safe contexts
  'drug': [/drug\s*store/i, /drug\s*free/i, /anti\s*drug/i, /drug\s*awareness/i, /drug\s*prevention/i, /drug\s*education/i, /pharmaceutical\s*drug/i, /prescription\s*drug/i, /over\s*the\s*counter\s*drug/i, /drug\s*safety/i],
  'drugs': [/drug\s*store/i, /drugs\s*free/i, /anti\s*drugs/i, /say\s*no\s*to\s*drugs/i, /prescription\s*drugs/i, /drugs\.com/i, /drugs\s*awareness/i],
  'weed': [/weed\s*killer/i, /pull\s*weeds/i, /garden\s*weed/i, /weed\s*out/i, /weed\s*free/i, /sea\s*weed/i, /weeds\s*in/i],
  'high': [/high\s*school/i, /high\s*score/i, /high\s*quality/i, /high\s*five/i, /high\s*jump/i, /high\s*definition/i, /high\s*speed/i, /high\s*tech/i, /high\s*performance/i, /sky\s*high/i],
  'pot': [/flower\s*pot/i, /pot\s*plant/i, /cooking\s*pot/i, /pot\s*pie/i, /melting\s*pot/i, /pot\s*luck/i, /crock\s*pot/i, /instant\s*pot/i, /pot\s*roast/i, /jackpot/i],
  'crack': [/crack\s*the\s*code/i, /crack\s*open/i, /crack\s*a\s*joke/i, /crack\s*up/i, /safe\s*crack/i, /crack\s*of\s*dawn/i, /crack\s*down/i, /firecracker/i],
  'smoking': [/smoking\s*hot/i, /no\s*smoking/i, /smoking\s*gun/i, /quit\s*smoking/i, /stop\s*smoking/i, /anti\s*smoking/i],
  'addiction': [/gaming\s*addiction/i, /phone\s*addiction/i, /social\s*media\s*addiction/i, /addiction\s*recovery/i, /addiction\s*help/i, /addiction\s*treatment/i, /overcome\s*addiction/i],
  'addict': [/coffee\s*addict/i, /game\s*addict/i, /book\s*addict/i, /music\s*addict/i, /chocolate\s*addict/i, /fitness\s*addict/i],
  'drunk': [/punch\s*drunk/i, /drunk\s*driving\s*awareness/i, /don't\s*drink.*drunk/i, /anti.*drunk/i],
  
  // Gambling-related words in safe contexts
  'bet': [/you\s*bet/i, /bet\s*you/i, /i\s*bet/i, /safe\s*bet/i, /best\s*bet/i, /bet\s*on\s*yourself/i, /alphabet/i],
  'poker': [/poker\s*face/i, /fire\s*poker/i],
  'slot': [/time\s*slot/i, /slot\s*machine.*game/i, /expansion\s*slot/i, /memory\s*slot/i, /slot\s*in/i, /parking\s*slot/i],
  'slots': [/time\s*slots/i, /expansion\s*slots/i, /available\s*slots/i, /memory\s*slots/i],
  'casino': [/casino\s*royale/i, /monte\s*carlo.*history/i], // Movie references or history
  
  // Profanity in safe contexts
  'ass': [/bass/i, /class/i, /pass/i, /mass/i, /grass/i, /glass/i, /brass/i, /compass/i, /assess/i, /assistant/i, /ассе/i, /massive/i, /classic/i, /passion/i, /embassy/i],
  'cock': [/cockpit/i, /peacock/i, /rooster.*cock/i, /hancock/i, /cocktail/i, /weathercock/i, /stopcock/i, /cock-a-doodle/i],
  'dick': [/moby\s*dick/i, /dick\s*tracy/i, /dickens/i, /dictionary/i, /dick\s*clark/i, /dick\s*van\s*dyke/i],
  'tits': [/tit\s*for\s*tat/i, /titmouse/i, /tit.*bird/i],
  'xxx': [/size\s*xxx/i, /xxx-large/i, /xxxl/i],
  
  // Hate-related words in safe contexts  
  'discriminat': [/anti\s*discriminat/i, /non\s*discriminat/i, /stop\s*discriminat/i, /against\s*discriminat/i, /discriminat.*wrong/i, /discriminat.*awareness/i],
  'racist': [/anti\s*racist/i, /not\s*racist/i, /stop\s*racist/i, /against\s*racist/i, /racist.*wrong/i],
  'racism': [/anti\s*racism/i, /stop\s*racism/i, /end\s*racism/i, /against\s*racism/i, /racism.*awareness/i, /racism\s*is\s*wrong/i],
  
  // Other potentially flagged words in safe contexts
  'sex': [/sex\s*education/i, /sex\s*ed/i, /unisex/i, /middlesex/i, /essex/i, /sussex/i, /same\s*sex\s*marriage/i, /biological\s*sex/i, /sex\s*and\s*the\s*city/i],
  'nude': [/nude\s*color/i, /nude\s*lipstick/i, /nude\s*shade/i, /nude\s*heel/i, /nude\s*palette/i, /nude\s*makeup/i],
  'naked': [/naked\s*eye/i, /naked\s*truth/i, /buck\s*naked/i, /naked\s*juice/i],
  'predator': [/apex\s*predator/i, /predator\s*prey/i, /natural\s*predator/i, /predator.*animal/i, /predator.*wildlife/i, /predator\s*vs\s*prey/i, /predator.*movie/i, /predator.*alien/i],
  'grooming': [/dog\s*grooming/i, /pet\s*grooming/i, /cat\s*grooming/i, /horse\s*grooming/i, /grooming\s*kit/i, /personal\s*grooming/i, /grooming\s*products/i, /hair\s*grooming/i],
  'escort': [/police\s*escort/i, /security\s*escort/i, /escort\s*service.*shipping/i, /escort\s*mission/i, /ford\s*escort/i],
  'abuse': [/substance\s*abuse\s*awareness/i, /abuse\s*prevention/i, /stop\s*abuse/i, /anti\s*abuse/i, /abuse\s*hotline/i, /report\s*abuse/i],
  'torture': [/torture\s*test/i, /don't\s*torture/i],
  'suicide': [/suicide\s*prevention/i, /suicide\s*awareness/i, /suicide\s*hotline/i, /anti\s*suicide/i, /prevent\s*suicide/i, /suicide\s*squad.*movie/i],
  'suicidal': [/suicidal\s*thoughts\s*help/i, /suicidal.*prevention/i, /help.*suicidal/i],
};

// Check if a keyword appears in a safe context
function isKeywordInSafeContext(keyword: string, context: string): boolean {
  const safePatterns = SAFE_CONTEXT_PATTERNS[keyword.toLowerCase()];
  if (!safePatterns) return false;
  
  return safePatterns.some(pattern => pattern.test(context));
}

// Get extended context around a keyword for better analysis
function getExtendedContext(content: string, keyword: string, position: number): string {
  const contextRadius = 60; // chars before and after
  const start = Math.max(0, position - contextRadius);
  const end = Math.min(content.length, position + keyword.length + contextRadius);
  return content.slice(start, end).toLowerCase();
}

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
  unsafeKeywordsFound: { category: string; keyword: string; count: number; context: string[]; contextSafe: boolean }[];
  safeKeywordsFound: string[];
  riskScore: number;
  riskLevel: 'safe' | 'caution' | 'unsafe' | 'dangerous';
  filteredByContext: number; // Count of keywords filtered out due to safe context
} {
  // Combine all content (limit to 15k chars for speed)
  const allContent = `${title} ${description} ${keywords.join(' ')} ${text}`.toLowerCase().slice(0, 15000);
  const unsafeKeywordsFound: { category: string; keyword: string; count: number; context: string[]; contextSafe: boolean }[] = [];
  let filteredByContext = 0;

  // Use pre-compiled patterns for fast matching with CONTEXT AWARENESS
  for (const [category, pattern] of Object.entries(CHILD_UNSAFE_PATTERNS)) {
    // Reset lastIndex for global regex
    pattern.lastIndex = 0;
    
    // Find all matches with their positions
    let match;
    const keywordMatches: { keyword: string; position: number; context: string }[] = [];
    const tempContent = allContent;
    
    // Use matchAll for position tracking
    const regex = new RegExp(pattern.source, 'gi');
    while ((match = regex.exec(tempContent)) !== null) {
      const keyword = match[0].toLowerCase();
      const position = match.index;
      const extendedContext = getExtendedContext(tempContent, keyword, position);
      keywordMatches.push({ keyword, position, context: extendedContext });
    }
    
    if (keywordMatches.length > 0) {
      // Group by keyword and analyze context for each
      const keywordGroups: { [key: string]: { safeCount: number; unsafeCount: number; contexts: string[] } } = {};
      
      for (const km of keywordMatches) {
        if (!keywordGroups[km.keyword]) {
          keywordGroups[km.keyword] = { safeCount: 0, unsafeCount: 0, contexts: [] };
        }
        
        // Check if this specific instance is in a safe context
        const isSafe = isKeywordInSafeContext(km.keyword, km.context);
        
        if (isSafe) {
          keywordGroups[km.keyword].safeCount++;
          filteredByContext++;
        } else {
          keywordGroups[km.keyword].unsafeCount++;
          if (keywordGroups[km.keyword].contexts.length < 2) {
            keywordGroups[km.keyword].contexts.push('...' + km.context.trim() + '...');
          }
        }
      }
      
      // Only add keywords that have unsafe instances
      for (const [keyword, data] of Object.entries(keywordGroups)) {
        if (data.unsafeCount > 0) {
          unsafeKeywordsFound.push({
            category,
            keyword,
            count: data.unsafeCount, // Only count unsafe instances
            context: data.contexts,
            contextSafe: false,
          });
        }
      }
    }
  }

  // Find safe keywords using pre-compiled pattern
  const safeMatches = allContent.match(SAFE_PATTERN);
  const safeKeywordsFound = safeMatches ? [...new Set(safeMatches.map(m => m.toLowerCase()))] : [];

  // Calculate risk score (only for keywords NOT in safe context)
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
  
  // Additional reduction if many keywords were filtered by safe context
  if (filteredByContext > 0) {
    riskScore = Math.max(0, riskScore - filteredByContext * 2);
  }

  // Determine risk level
  let riskLevel: 'safe' | 'caution' | 'unsafe' | 'dangerous' = 'safe';
  if (riskScore >= 50) riskLevel = 'dangerous';
  else if (riskScore >= 25) riskLevel = 'unsafe';
  else if (riskScore >= 10) riskLevel = 'caution';

  return { unsafeKeywordsFound, safeKeywordsFound, riskScore, riskLevel, filteredByContext };
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
// FAST CONTENT FETCHING (2 second timeout)
// ============================================================================

async function fetchWebpageContentFast(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(2000), // 2 second hard timeout
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
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
// FAST IMAGE ANALYSIS (Direct URL analysis, no Puppeteer)
// ============================================================================

async function analyzeImageUrlFast(imageUrl: string): Promise<any> {
  if (!visionClient) return null;

  try {
    const [result] = await Promise.race([
      visionClient.annotateImage({
        image: { source: { imageUri: imageUrl } },
        features: [
          { type: 'SAFE_SEARCH_DETECTION' },
          { type: 'LABEL_DETECTION', maxResults: 5 },
        ],
      }),
      new Promise<[null]>((_, reject) => setTimeout(() => reject(new Error('Vision timeout')), 1500)),
    ]);
    return result;
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
    const truncated = text.slice(0, 1500); // Reduced for speed
    const [sentimentResult] = await Promise.race([
      languageClient.analyzeSentiment({ document: { content: truncated, type: 'PLAIN_TEXT' } }),
      new Promise<[null]>((_, reject) => setTimeout(() => reject(new Error('NLP timeout')), 1500)),
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

/**
 * Analyze images using Google Cloud Vision API (Fast version - max 2 images, 1.5s timeout each)
 */
async function analyzeImagesWithVisionFast(imageUrls: string[]) {
  if (!visionClient || imageUrls.length === 0) {
    return null;
  }

  try {
    const results = {
      labels: [] as string[],
      safeSearchAnnotation: null as any,
      detectedObjects: [] as string[],
    };

    // Only analyze first 2 images in parallel with aggressive timeout
    const requests = imageUrls.slice(0, 2).map(imageUrl =>
      Promise.race([
        visionClient!.annotateImage({
          image: { source: { imageUri: imageUrl } },
          features: [
            { type: 'SAFE_SEARCH_DETECTION' },
            { type: 'LABEL_DETECTION', maxResults: 5 },
          ],
        }).catch(() => [null]),
        new Promise<[null]>(resolve => setTimeout(() => resolve([null]), 1500)),
      ])
    );

    const allResults = await Promise.all(requests);

    for (const [result] of allResults) {
      if (!result) continue;

      const highConfLabels = result.labelAnnotations
        ?.filter((l: any) => (l.score || 0) > 0.7)
        ?.map((l: any) => l.description || '') || [];
      results.labels.push(...highConfLabels);

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

    results.labels = [...new Set(results.labels)].slice(0, 8);
    return results;
  } catch {
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
// MAIN OPTIMIZED ANALYSIS (Target: <4 seconds)
// ============================================================================

async function analyzeUrlOptimized(url: string): Promise<ScanResult> {
  const startTime = Date.now();
  const MAX_TOTAL_TIME = 3500; // 3.5 second hard limit
  const getElapsed = () => ((Date.now() - startTime) / 1000).toFixed(3);
  
  console.log(`\n🔍 [KOMAL ANALYSIS] Starting scan for: ${url}`);
  console.log(`⏱️  [0.000s] Step 1: Initializing...`);
  
  initializeClients();

  try {
    // Step 1: Fetch HTML with 2s timeout
    console.log(`⏱️  [${getElapsed()}s] Step 2: Fetching webpage content...`);
    const html = await fetchWebpageContentFast(url);
    console.log(`✅ [${getElapsed()}s] Step 2 Complete: Fetched ${(html.length / 1024).toFixed(1)}KB of HTML`);

    // Step 2: Parse HTML (synchronous, <50ms)
    console.log(`⏱️  [${getElapsed()}s] Step 3: Parsing HTML content...`);
    const parsed = parseHTMLContentFast(html, url);
    console.log(`✅ [${getElapsed()}s] Step 3 Complete: Found ${parsed.imageCount} images, ${parsed.linkCount} links, ${parsed.videoCount} videos`);

    // Step 3: Run child safety analysis
    console.log(`⏱️  [${getElapsed()}s] Step 4: Running context-aware keyword analysis...`);
    const childSafetyAnalysis = analyzeChildSafetyFast(
      parsed.textContent,
      parsed.title,
      parsed.description,
      parsed.keywords
    );
    console.log(`✅ [${getElapsed()}s] Step 4 Complete: ${childSafetyAnalysis.unsafeKeywordsFound.length} risks found, ${childSafetyAnalysis.filteredByContext} safe-context keywords excluded`);

    // Calculate remaining time for API calls
    const remainingTime = MAX_TOTAL_TIME - (Date.now() - startTime);
    
    // Run NLP and Vision in parallel with remaining time budget
    type NlpResult = { sentiment: string; entities: string[] } | null;
    type VisionResult = { labels: string[]; safeSearchAnnotation: any; detectedObjects: string[] } | null;
    
    let nlpResults: NlpResult = null;
    let visionResults: VisionResult = null;

    if (remainingTime > 500) {
      console.log(`⏱️  [${getElapsed()}s] Step 5: Running AI APIs in parallel (NLP + Vision)...`);
      
      // Create promises that resolve to their results
      const nlpPromise: Promise<NlpResult> = languageClient && parsed.textContent
        ? analyzeTextFast(parsed.textContent).catch(() => null)
        : Promise.resolve(null);
      
      const visionPromise: Promise<VisionResult> = visionClient && parsed.imageUrls.length > 0
        ? analyzeImagesWithVisionFast(parsed.imageUrls).catch(() => null)
        : Promise.resolve(null);

      // Race against timeout
      const timeout = Math.min(remainingTime - 200, 2000);
      const results = await Promise.race([
        Promise.all([nlpPromise, visionPromise]),
        new Promise<[NlpResult, VisionResult]>(resolve => 
          setTimeout(() => resolve([null, null]), timeout)
        ),
      ]);
      
      [nlpResults, visionResults] = results;
      console.log(`✅ [${getElapsed()}s] Step 5 Complete: NLP=${nlpResults ? 'success' : 'skipped'}, Vision=${visionResults ? 'success' : 'skipped'}`);
    } else {
      console.log(`⚠️  [${getElapsed()}s] Step 5: Skipped AI APIs (insufficient time budget: ${remainingTime}ms)`);
    }

    // Step 4: Calculate scores (fast, <10ms)
    console.log(`⏱️  [${getElapsed()}s] Step 6: Calculating age-group scores...`);
    const multimediaRisk = 100 - parsed.multimedia.mediaSafetyScore;
    const ageGroupScores = calculateAgeGroupScores(
      childSafetyAnalysis,
      visionResults?.safeSearchAnnotation,
      multimediaRisk
    );

    const overallScore = Math.round(
      Object.values(ageGroupScores).reduce((sum, ag) => sum + ag.score, 0) / AGE_GROUPS.length
    );
    console.log(`✅ [${getElapsed()}s] Step 6 Complete: Overall safety score = ${overallScore}/100`);

    // Build risk categories
    console.log(`⏱️  [${getElapsed()}s] Step 7: Building final report...`);
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

    console.log(`✅ [${getElapsed()}s] Step 7 Complete: Report generated`);
    console.log(`\n🎯 [KOMAL ANALYSIS] COMPLETE in ${getElapsed()}s | Score: ${overallScore}/100 | Risk: ${childSafetyAnalysis.riskLevel}\n`);

    return {
      url,
      overallScore,
      ageGroupScores,
      contentAnalysis: {
        textAnalysis: {
          sentiment: nlpResults?.sentiment || 'Neutral',
          keyTopics: detectTopics(parsed.textContent, parsed.title),
          languageScore: Math.max(0, 100 - childSafetyAnalysis.riskScore * 2),
          entities: nlpResults?.entities || [],
          unsafeKeywordsFound: childSafetyAnalysis.unsafeKeywordsFound.map((u: { keyword: string }) => u.keyword),
          safeKeywordsFound: childSafetyAnalysis.safeKeywordsFound,
        },
        visualAnalysis: {
          detectedObjects: visionResults?.detectedObjects || [],
          safetyScore: visionResults?.safeSearchAnnotation
            ? Math.max(0, 100 - getLikelihoodScore(visionResults.safeSearchAnnotation.adult) * 20 - getLikelihoodScore(visionResults.safeSearchAnnotation.violence) * 15)
            : 100,
          concerns: visionResults?.safeSearchAnnotation && getLikelihoodScore(visionResults.safeSearchAnnotation.adult) >= 3 ? ['Adult content detected'] : [],
          labels: visionResults?.labels || [],
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
      analysisMethod: (nlpResults || visionResults) ? 'live' : 'demo',
    };
  } catch (error) {
    const errorTime = ((Date.now() - startTime) / 1000).toFixed(3);
    console.error(`\n❌ [KOMAL ANALYSIS] ERROR at ${errorTime}s:`, error);
    console.log(`⚠️  [${errorTime}s] Falling back to demo mode...`);
    return generateDemoAnalysisFast(url);
  }
}

// Fast topic detection without external API
function detectTopics(text: string, title: string): string[] {
  const content = (title + ' ' + text).toLowerCase();
  const topics: string[] = [];
  
  const topicPatterns: { [key: string]: RegExp } = {
    'Education': /\b(learn|education|school|study|course|tutorial|lesson|teach)\b/i,
    'News': /\b(news|breaking|report|headline|journalist|media)\b/i,
    'Entertainment': /\b(movie|music|game|entertainment|video|stream|watch)\b/i,
    'Social Media': /\b(social|share|post|follow|like|comment|profile)\b/i,
    'Shopping': /\b(buy|shop|cart|price|sale|discount|order)\b/i,
    'Technology': /\b(tech|software|app|computer|digital|internet|online)\b/i,
    'Health': /\b(health|medical|doctor|wellness|fitness|diet)\b/i,
    'Sports': /\b(sport|game|team|player|score|match|championship)\b/i,
  };
  
  for (const [topic, pattern] of Object.entries(topicPatterns)) {
    if (pattern.test(content)) {
      topics.push(topic);
      if (topics.length >= 3) break;
    }
  }
  
  return topics.length > 0 ? topics : ['General'];
}

// ============================================================================
// FAST DEMO ANALYSIS (When live fails)
// ============================================================================

function generateDemoAnalysisFast(url: string): ScanResult {
  const startTime = Date.now();
  const getElapsed = () => ((Date.now() - startTime) / 1000).toFixed(3);
  
  console.log(`\n🔍 [KOMAL DEMO MODE] Starting URL-based analysis for: ${url}`);
  console.log(`⏱️  [${getElapsed()}s] Running keyword analysis on URL...`);
  
  const urlLower = url.toLowerCase();
  const childSafetyAnalysis = analyzeChildSafetyFast(urlLower, '', '', []);

  // Quick URL pattern detection
  const isEducational = /edu|learn|wiki|school|kids|child/i.test(urlLower);
  const isSocial = /facebook|instagram|tiktok|twitter|snapchat/i.test(urlLower);
  
  console.log(`✅ [${getElapsed()}s] Pattern detection: Educational=${isEducational}, Social=${isSocial}`);

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
  
  console.log(`🎯 [KOMAL DEMO MODE] COMPLETE in ${getElapsed()}s | Score: ${overallScore}/100 | Risk: ${childSafetyAnalysis.riskLevel}\n`);

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
