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
// CONTEXT-AWARE KEYWORD ANALYSIS (OPTIMIZED - Only flag DANGEROUS contexts)
// Keywords are ONLY flagged when they appear in explicitly harmful contexts
// Neutral/benign usage = NOT flagged
// ============================================================================

// DANGEROUS context patterns - ONLY these will trigger a flag
// If keyword doesn't match any dangerous pattern, it's considered SAFE
const DANGEROUS_CONTEXT_PATTERNS: { [keyword: string]: RegExp[] } = {
  // === WEAPONS - Only flag when promoting violence/illegal activity ===
  'gun': [
    /buy\s*(a\s*)?gun/i, /sell\s*gun/i, /gun\s*for\s*sale/i, /illegal\s*gun/i,
    /shoot\s*(him|her|them|someone|people)/i, /gun\s*violence/i, /loaded\s*gun/i,
    /aim\s*(the\s*)?gun/i, /fire\s*(the\s*)?gun/i, /gun\s*attack/i, /armed\s*with.*gun/i
  ],
  'weapon': [
    /buy\s*weapon/i, /illegal\s*weapon/i, /deadly\s*weapon/i, /weapon.*attack/i,
    /concealed\s*weapon/i, /weapon.*kill/i, /armed.*weapon/i
  ],
  'bomb': [
    /make\s*(a\s*)?bomb/i, /bomb\s*threat/i, /bomb.*attack/i, /plant\s*(a\s*)?bomb/i,
    /bomb\s*recipe/i, /how\s*to\s*bomb/i, /bomb.*explod/i, /detonate.*bomb/i
  ],
  'knife': [
    /stab\s*(him|her|them|someone)/i, /knife\s*attack/i, /knife.*kill/i,
    /cut\s*(him|her|them|someone)/i
  ],

  // === DRUGS - Only flag when promoting use/sale ===
  'drug': [
    /buy\s*drug/i, /sell\s*drug/i, /drug\s*dealer/i, /illegal\s*drug/i,
    /drug\s*high/i, /drug\s*trip/i, /get\s*high.*drug/i, /drug.*overdose/i,
    /inject.*drug/i, /snort.*drug/i
  ],
  'drugs': [
    /buy\s*drugs/i, /sell\s*drugs/i, /illegal\s*drugs/i, /street\s*drugs/i,
    /do\s*drugs/i, /drugs\s*online/i, /take\s*drugs/i, /drugs.*high/i
  ],
  'cocaine': [/buy\s*cocaine/i, /cocaine.*high/i, /snort\s*cocaine/i, /cocaine\s*dealer/i, /use\s*cocaine/i],
  'heroin': [/buy\s*heroin/i, /heroin.*inject/i, /heroin\s*dealer/i, /shoot.*heroin/i, /use\s*heroin/i],
  'meth': [/buy\s*meth/i, /meth\s*lab/i, /cook\s*meth/i, /smoke\s*meth/i, /use\s*meth/i],
  'weed': [/buy\s*weed/i, /sell\s*weed/i, /smoke\s*weed/i, /weed\s*dealer/i, /get\s*high.*weed/i],
  'marijuana': [/buy\s*marijuana/i, /sell\s*marijuana/i, /smoke\s*marijuana/i, /marijuana\s*dealer/i],

  // === GAMBLING - Only flag when promoting real money gambling ===
  'gambling': [
    /online\s*gambling/i, /gambling\s*site/i, /gambling\s*app/i,
    /real\s*money\s*gambling/i, /win\s*money.*gambl/i, /gamble\s*online/i
  ],
  'casino': [
    /online\s*casino/i, /casino\s*bonus/i, /play.*casino.*money/i,
    /casino\s*games.*real.*money/i, /live\s*casino/i, /casino\s*deposit/i
  ],
  'betting': [
    /sports\s*betting/i, /online\s*betting/i, /betting\s*site/i,
    /betting\s*odds/i, /place.*bet.*money/i, /win.*bet/i
  ],
  'slot': [/slot\s*machine.*money/i, /play\s*slots.*real/i, /online\s*slots.*money/i],

  // === VIOLENCE - Only flag explicit threats/instructions ===
  'kill': [
    /how\s*to\s*kill/i, /want\s*to\s*kill/i, /going\s*to\s*kill/i,
    /kill\s*(him|her|them|you|myself|someone|people)/i, /i('ll|.will)\s*kill/i,
    /plan\s*to\s*kill/i, /murder.*kill/i
  ],
  'murder': [
    /how\s*to\s*murder/i, /want\s*to\s*murder/i, /commit\s*murder/i,
    /plan.*murder/i, /murder\s*(him|her|them|someone)/i
  ],
  'attack': [
    /plan\s*(an\s*)?attack/i, /attack\s*(him|her|them|someone|people)/i,
    /violent\s*attack/i, /terrorist\s*attack/i
  ],
  'hurt': [
    /hurt\s*(him|her|them|myself|someone)/i, /want\s*to\s*hurt/i,
    /plan\s*to\s*hurt/i, /going\s*to\s*hurt/i
  ],

  // === SELF-HARM/SUICIDE - Only flag promoting/instructing ===
  'suicide': [
    /commit\s*suicide/i, /how\s*to\s*(commit\s*)?suicide/i, /want\s*to\s*die/i,
    /kill\s*myself/i, /end\s*my\s*life/i, /suicide\s*method/i, /ways\s*to\s*die/i
  ],
  'self-harm': [/how\s*to\s*self.?harm/i, /want\s*to\s*hurt\s*myself/i, /cutting\s*myself/i, /self.?harm.*method/i],
  'cutting': [/cutting\s*myself/i, /cut\s*myself/i, /self.?cutting/i],

  // === EXPLICIT CONTENT - Only flag actual adult content ===
  'porn': [/watch\s*porn/i, /free\s*porn/i, /porn\s*video/i, /porn\s*site/i, /xxx\s*porn/i, /porn\s*hub/i],
  'xxx': [/xxx\s*video/i, /xxx\s*site/i, /xxx\s*movie/i, /xxx\s*porn/i, /xxx\s*adult/i],
  'sex': [
    /have\s*sex/i, /sex\s*video/i, /sex\s*tape/i, /sex\s*chat/i,
    /casual\s*sex/i, /sex\s*hookup/i, /sex\s*scene/i, /sexual\s*content/i
  ],
  'nude': [
    /nude\s*photo/i, /nude\s*pic/i, /send\s*nude/i, /nude\s*video/i,
    /nude\s*girl/i, /nude\s*woman/i, /nude\s*image/i, /see.*nude/i
  ],
  'naked': [
    /naked\s*photo/i, /naked\s*pic/i, /naked\s*girl/i, /naked\s*woman/i,
    /naked\s*video/i, /naked\s*image/i, /see.*naked/i
  ],

  // === PREDATORY - Always dangerous ===
  'grooming': [/child\s*grooming/i, /online\s*grooming/i, /grooming.*minor/i, /grooming.*child/i, /grooming.*kid/i],
  'predator': [/sexual\s*predator/i, /child\s*predator/i, /online\s*predator/i],

  // === HATE/DISCRIMINATION - Only flag when promoting hate ===
  'racist': [/be\s*racist/i, /racist\s*joke/i, /racist\s*slur/i],
  'racism': [/promote\s*racism/i, /racism\s*is\s*(good|right)/i],
  'hate': [/hate\s*(him|her|them|you|jews|muslims|black|white|gay)/i, /hate\s*crime/i, /hate\s*speech/i],

  // === PROFANITY - Only flag in aggressive/abusive context ===
  'fuck': [/fuck\s*(you|off|him|her|them)/i, /go\s*fuck/i, /fucking\s*(idiot|stupid|hate)/i],
  'shit': [/shit.*die/i, /shit.*kill/i, /piece\s*of\s*shit/i],
  'bitch': [/stupid\s*bitch/i, /kill.*bitch/i, /hate.*bitch/i],
};

// Keywords that REQUIRE dangerous context to be flagged
// If found without dangerous context, they are IGNORED (safe by default)
const CONTEXT_REQUIRED_KEYWORDS = new Set([
  // Common words that need context to determine safety
  'gun', 'shoot', 'shooting', 'shot', 'kill', 'killing', 'dead', 'death', 'die', 'dying',
  'drug', 'drugs', 'high', 'pot', 'weed', 'crack', 'smoking', 'meth',
  'bomb', 'weapon', 'knife', 'attack', 'fight', 'hurt', 'harm',
  'bet', 'betting', 'slot', 'slots', 'poker', 'casino', 'gambling',
  'sex', 'sexy', 'nude', 'naked', 'adult',
  'blood', 'bloody', 'violent', 'violence',
  'hate', 'racist', 'racism',
  'hell', 'damn', 'crap', 'suck',
  'ass', 'cock', 'dick', 'bitch',
  'addiction', 'addict', 'drunk',
  'abuse', 'predator', 'grooming', 'escort',
  'suicide', 'suicidal', 'murder', 'rape', 'torture'
]);

// ALWAYS DANGEROUS keywords (no context needed - always flag)
const ALWAYS_DANGEROUS_KEYWORDS = new Set([
  'porn', 'pornography', 'pornhub', 'xvideos', 'xnxx',
  'cocaine', 'heroin', 'methamphetamine', 'fentanyl', 'lsd', 'ecstasy',
  'pedophile', 'pedophilia', 'incest',
  'terrorism', 'terrorist',
  'nigger', 'nigga', 'faggot', 'retard'
]);

// Analyze keyword context - ONLY flag when context is EXPLICITLY harmful
interface ContextAnalysisResult {
  shouldFlag: boolean;  // Whether to flag this keyword
  isDangerous: boolean; // Is it dangerous content
  severity: number;     // 0 = safe, 0.5 = minor, 1 = full severity
  reason: string;
  ageMultipliers: { [key in AgeGroup]: number };
}

function analyzeKeywordContext(keyword: string, context: string): ContextAnalysisResult {
  const lowerKeyword = keyword.toLowerCase();
  const lowerContext = context.toLowerCase();
  
  // Default: NOT flagged (safe until proven dangerous)
  const safeResult: ContextAnalysisResult = {
    shouldFlag: false,
    isDangerous: false,
    severity: 0,
    reason: 'Neutral context - not flagged',
    ageMultipliers: { '<10': 0, '10-13': 0, '13-16': 0, '16+': 0 }
  };

  // ALWAYS DANGEROUS - No context check needed
  if (ALWAYS_DANGEROUS_KEYWORDS.has(lowerKeyword)) {
    return {
      shouldFlag: true,
      isDangerous: true,
      severity: 1,
      reason: 'Always dangerous keyword',
      ageMultipliers: { '<10': 1, '10-13': 1, '13-16': 1, '16+': 1 }
    };
  }

  // Check for DANGEROUS context patterns
  const dangerousPatterns = DANGEROUS_CONTEXT_PATTERNS[lowerKeyword];
  if (dangerousPatterns) {
    for (const pattern of dangerousPatterns) {
      if (pattern.test(lowerContext)) {
        return {
          shouldFlag: true,
          isDangerous: true,
          severity: 1,
          reason: `Dangerous context: ${pattern.source.slice(0, 30)}...`,
          ageMultipliers: { '<10': 1, '10-13': 1, '13-16': 1, '16+': 0.8 }
        };
      }
    }
  }

  // If keyword requires context and no dangerous context found → SAFE
  if (CONTEXT_REQUIRED_KEYWORDS.has(lowerKeyword)) {
    // Check for educational/awareness context (extra safety)
    const educationalPatterns = [
      /awareness/i, /prevention/i, /education/i, /learn\s*about/i, /teach/i,
      /school/i, /help/i, /support/i, /recovery/i, /treatment/i, /safety/i,
      /protect/i, /stop\s/i, /anti[\s-]/i, /against/i, /prevent/i, /avoid/i,
      /warning/i, /danger.*of/i, /harmful.*effect/i, /news/i, /report/i,
      /study/i, /research/i, /article/i, /definition/i, /meaning/i, /history/i
    ];
    
    for (const pattern of educationalPatterns) {
      if (pattern.test(lowerContext)) {
        return {
          ...safeResult,
          reason: 'Educational/informational context'
        };
      }
    }
    
    // No dangerous context found → not flagged
    return safeResult;
  }

  // Keyword not in our lists → not flagged
  return safeResult;
}

// Get extended context around a keyword for better analysis
function getExtendedContext(content: string, keyword: string, position: number): string {
  const contextRadius = 100; // chars before and after (increased for better context)
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
  usedSearchFallback?: boolean; // True when direct page access failed and Google search was used
  performanceMetrics?: {
    totalTimeMs: number;
    steps: {
      name: string;
      durationMs: number;
      details?: string;
    }[];
  };
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
// OPTIMIZED CHILD SAFETY ANALYSIS (Context-Aware - Only Flag Dangerous)
// Keywords are ONLY flagged when they appear in EXPLICITLY HARMFUL contexts
// ============================================================================

interface KeywordFinding {
  category: string;
  keyword: string;
  count: number;
  context: string[];
  contextSafe: boolean;
  isDangerous: boolean;
  severity: number;
  ageMultipliers: { [key in AgeGroup]: number };
}

function analyzeChildSafetyFast(
  text: string,
  title: string = '',
  description: string = '',
  keywords: string[] = []
): {
  unsafeKeywordsFound: KeywordFinding[];
  safeKeywordsFound: string[];
  riskScore: number;
  riskLevel: 'safe' | 'caution' | 'unsafe' | 'dangerous';
  filteredByContext: number;
  ageSpecificRiskScores: { [key in AgeGroup]: number };
} {
  // Combine all content (limit to 20k chars)
  const allContent = `${title} ${description} ${keywords.join(' ')} ${text}`.toLowerCase().slice(0, 20000);
  const unsafeKeywordsFound: KeywordFinding[] = [];
  let filteredByContext = 0;
  const ageSpecificRiskScores: { [key in AgeGroup]: number } = { '<10': 0, '10-13': 0, '13-16': 0, '16+': 0 };

  // Use pre-compiled patterns for fast matching with CONTEXT AWARENESS
  for (const [category, pattern] of Object.entries(CHILD_UNSAFE_PATTERNS)) {
    pattern.lastIndex = 0;
    
    const keywordMatches: { keyword: string; position: number; context: string }[] = [];
    const regex = new RegExp(pattern.source, 'gi');
    let match;
    
    while ((match = regex.exec(allContent)) !== null) {
      const keyword = match[0].toLowerCase();
      const position = match.index;
      const extendedContext = getExtendedContext(allContent, keyword, position);
      keywordMatches.push({ keyword, position, context: extendedContext });
    }
    
    if (keywordMatches.length > 0) {
      // Group by keyword and analyze context for each instance
      const keywordGroups: { 
        [key: string]: { 
          flaggedCount: number;
          notFlaggedCount: number;
          contexts: string[];
          severity: number;
          ageMultipliers: { [key in AgeGroup]: number };
        } 
      } = {};
      
      for (const km of keywordMatches) {
        if (!keywordGroups[km.keyword]) {
          keywordGroups[km.keyword] = { 
            flaggedCount: 0,
            notFlaggedCount: 0,
            contexts: [],
            severity: 0,
            ageMultipliers: { '<10': 0, '10-13': 0, '13-16': 0, '16+': 0 }
          };
        }
        
        // Analyze the context - ONLY flags if context is EXPLICITLY harmful
        const contextAnalysis = analyzeKeywordContext(km.keyword, km.context);
        
        if (contextAnalysis.shouldFlag) {
          // This keyword IS in dangerous context - FLAG IT
          keywordGroups[km.keyword].flaggedCount++;
          keywordGroups[km.keyword].severity = Math.max(keywordGroups[km.keyword].severity, contextAnalysis.severity);
          
          // Update age multipliers (take the maximum/worst)
          for (const ageGroup of AGE_GROUPS) {
            keywordGroups[km.keyword].ageMultipliers[ageGroup] = Math.max(
              keywordGroups[km.keyword].ageMultipliers[ageGroup],
              contextAnalysis.ageMultipliers[ageGroup]
            );
          }
          
          if (keywordGroups[km.keyword].contexts.length < 2) {
            keywordGroups[km.keyword].contexts.push('⚠️ ' + km.context.trim().slice(0, 80));
          }
          console.log(`🚨 FLAGGED: "${km.keyword}" - ${contextAnalysis.reason}`);
        } else {
          // Context is neutral/safe - DO NOT FLAG
          keywordGroups[km.keyword].notFlaggedCount++;
          filteredByContext++;
          // Only log first few to avoid spam
          if (filteredByContext <= 5) {
            console.log(`✅ NOT FLAGGED: "${km.keyword}" - ${contextAnalysis.reason}`);
          }
        }
      }
      
      // Only add keywords that were FLAGGED (dangerous context detected)
      for (const [keyword, data] of Object.entries(keywordGroups)) {
        if (data.flaggedCount > 0) {
          unsafeKeywordsFound.push({
            category,
            keyword,
            count: data.flaggedCount,
            context: data.contexts,
            contextSafe: false,
            isDangerous: data.severity >= 0.8,
            severity: data.severity,
            ageMultipliers: data.ageMultipliers,
          });
        }
      }
    }
  }

  // Find safe keywords
  const safeMatches = allContent.match(SAFE_PATTERN);
  const safeKeywordsFound = safeMatches ? [...new Set(safeMatches.map(m => m.toLowerCase()))] : [];

  // Calculate age-specific risk scores (ONLY from flagged keywords)
  for (const unsafe of unsafeKeywordsFound) {
    const risk = CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category);
    if (risk) {
      const baseSeverity = risk.severity === 'critical' ? 10 : risk.severity === 'high' ? 6 : risk.severity === 'medium' ? 3 : 1;
      const countFactor = Math.min(unsafe.count, 5);
      const severityFactor = unsafe.severity;
      
      for (const ageGroup of AGE_GROUPS) {
        const ageMultiplier = unsafe.ageMultipliers[ageGroup];
        ageSpecificRiskScores[ageGroup] += countFactor * baseSeverity * severityFactor * ageMultiplier;
      }
    }
  }

  // Bonus for safe content (educational sites)
  const safeBonus = Math.min(safeKeywordsFound.length * 3, 40);
  for (const ageGroup of AGE_GROUPS) {
    ageSpecificRiskScores[ageGroup] = Math.max(0, ageSpecificRiskScores[ageGroup] - safeBonus);
  }

  // Overall risk score is the average, but weighted toward younger ages
  const riskScore = Math.round(
    (ageSpecificRiskScores['<10'] * 0.35 + 
     ageSpecificRiskScores['10-13'] * 0.30 + 
     ageSpecificRiskScores['13-16'] * 0.20 + 
     ageSpecificRiskScores['16+'] * 0.15)
  );

  // Determine risk level
  let riskLevel: 'safe' | 'caution' | 'unsafe' | 'dangerous' = 'safe';
  if (riskScore >= 50 || unsafeKeywordsFound.some(u => u.isDangerous)) {
    riskLevel = 'dangerous';
  } else if (riskScore >= 25) {
    riskLevel = 'unsafe';
  } else if (riskScore >= 10) {
    riskLevel = 'caution';
  }

  console.log(`📊 Context Analysis: ${filteredByContext} keywords NOT flagged (neutral context), ${unsafeKeywordsFound.length} flagged`);

  return { 
    unsafeKeywordsFound, 
    safeKeywordsFound, 
    riskScore, 
    riskLevel, 
    filteredByContext,
    ageSpecificRiskScores 
  };
}

// ============================================================================
// OPTIMIZED AGE GROUP SCORING (Context-Aware)
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

  // Apply deductions based on found unsafe keywords WITH CONTEXT-AWARE AGE MULTIPLIERS
  for (const unsafe of childSafetyAnalysis.unsafeKeywordsFound) {
    const risk = CHILD_SAFETY_RISKS.find(r => r.category === unsafe.category);
    if (risk) {
      for (const ageGroup of AGE_GROUPS) {
        // Get the age-specific multiplier from context analysis
        const ageMultiplier = unsafe.ageMultipliers?.[ageGroup] ?? 1;
        
        // If dangerous context, apply full deduction regardless of multiplier
        const effectiveMultiplier = unsafe.isDangerous ? 1 : ageMultiplier;
        
        // Calculate deduction with context-aware multiplier
        const baseDeduction = risk.deduction[ageGroup] * (Math.min(unsafe.count, 5) / 5);
        const deduction = baseDeduction * effectiveMultiplier;
        
        scores[ageGroup].score -= deduction;
        
        // Only add to risks if there's a significant deduction for this age group
        if (deduction > 5 && scores[ageGroup].risks.length < 3) {
          const riskLabel = unsafe.isDangerous 
            ? `⚠️ ${unsafe.category}: "${unsafe.keyword}"` 
            : `${unsafe.category}: "${unsafe.keyword}"`;
          scores[ageGroup].risks.push(riskLabel);
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

  // Bonus for safe content (educational sites get bigger bonus)
  const safeBonus = Math.min(childSafetyAnalysis.safeKeywordsFound.length * 3, 20);
  for (const ageGroup of AGE_GROUPS) {
    scores[ageGroup].score += safeBonus;
  }
  
  // Bonus for content that was filtered by safe context
  if (childSafetyAnalysis.filteredByContext > 0) {
    const contextBonus = Math.min(childSafetyAnalysis.filteredByContext * 2, 15);
    for (const ageGroup of AGE_GROUPS) {
      scores[ageGroup].score += contextBonus;
    }
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
      signal: AbortSignal.timeout(3000), // 3 second timeout
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.text();
  } catch (error) {
    throw error;
  }
}

// ============================================================================
// GOOGLE SEARCH FALLBACK - When direct fetch fails or no content
// ============================================================================

interface SearchResult {
  title: string;
  snippet: string;
  link: string;
  imageUrl?: string;
}

interface SearchAnalysisData {
  searchResults: SearchResult[];
  imageUrls: string[];
  combinedText: string;
  siteName: string;
  siteDescription: string;
}

async function searchForUrlInfo(targetUrl: string): Promise<SearchAnalysisData> {
  console.log(`🔎 [SEARCH FALLBACK] Searching for info about: ${targetUrl}`);
  
  const searchResults: SearchResult[] = [];
  const imageUrls: string[] = [];
  let combinedText = '';
  let siteName = '';
  let siteDescription = '';
  
  try {
    // Extract domain for search query
    const urlObj = new URL(targetUrl);
    const domain = urlObj.hostname.replace('www.', '');
    const searchQuery = encodeURIComponent(`${domain} site review safety`);
    
    // Method 1: Try DuckDuckGo HTML (no API key needed)
    const ddgUrl = `https://html.duckduckgo.com/html/?q=${searchQuery}`;
    
    const response = await fetch(ddgUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(5000),
    });
    
    if (response.ok) {
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Extract search results
      $('.result, .web-result').slice(0, 10).each((_, el) => {
        const title = $(el).find('.result__title, .result__a, a.result__url').first().text().trim();
        const snippet = $(el).find('.result__snippet, .result__body').first().text().trim();
        const link = $(el).find('a').first().attr('href') || '';
        
        if (title && snippet) {
          searchResults.push({ title, snippet, link });
          combinedText += ` ${title} ${snippet}`;
        }
      });
      
      console.log(`✅ [SEARCH] Found ${searchResults.length} results from DuckDuckGo`);
    }
    
    // Method 2: Also search for images using Bing Image search
    const bingImageUrl = `https://www.bing.com/images/search?q=${searchQuery}&first=1`;
    const imgResponse = await fetch(bingImageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': 'text/html',
      },
      signal: AbortSignal.timeout(3000),
    }).catch(() => null);
    
    if (imgResponse?.ok) {
      const imgHtml = await imgResponse.text();
      const $img = cheerio.load(imgHtml);
      
      // Extract image URLs from Bing results
      $img('img.mimg, .imgpt img, a.iusc').slice(0, 5).each((_, el) => {
        const src = $img(el).attr('src') || $img(el).attr('data-src') || '';
        if (src && src.startsWith('http') && !src.includes('bing.com/th')) {
          imageUrls.push(src);
        }
      });
      
      // Also try to extract from metadata
      $img('a.iusc').slice(0, 5).each((_, el) => {
        try {
          const m = $img(el).attr('m');
          if (m) {
            const data = JSON.parse(m);
            if (data.murl) imageUrls.push(data.murl);
          }
        } catch { /* ignore */ }
      });
      
      console.log(`✅ [SEARCH] Found ${imageUrls.length} images from search`);
    }
    
    // Method 3: Try to get site info from common review sites
    const reviewSites = [
      `https://www.trustpilot.com/review/${domain}`,
      `https://www.sitejabber.com/reviews/${domain}`,
    ];
    
    for (const reviewUrl of reviewSites) {
      try {
        const reviewResp = await fetch(reviewUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible)' },
          signal: AbortSignal.timeout(2000),
        });
        
        if (reviewResp.ok) {
          const reviewHtml = await reviewResp.text();
          const $review = cheerio.load(reviewHtml);
          
          const reviewText = $review('meta[name="description"]').attr('content') || '';
          if (reviewText) {
            combinedText += ` ${reviewText}`;
            siteDescription = reviewText.slice(0, 500);
          }
          
          siteName = $review('title').text() || domain;
          break;
        }
      } catch { /* continue */ }
    }
    
    // Fallback site name
    if (!siteName) siteName = domain;
    if (!siteDescription) siteDescription = combinedText.slice(0, 500) || `Analysis based on search results for ${domain}`;
    
  } catch (error) {
    console.error('Search fallback error:', error);
  }
  
  return {
    searchResults,
    imageUrls: [...new Set(imageUrls)].slice(0, 5),
    combinedText: combinedText.slice(0, 10000),
    siteName,
    siteDescription,
  };
}

// Analyze content from search results
async function analyzeFromSearchResults(
  url: string,
  searchData: SearchAnalysisData,
  trackStep: (name: string, details?: string) => void
): Promise<{
  childSafetyAnalysis: ReturnType<typeof analyzeChildSafetyFast>;
  visionResults: { labels: string[]; safeSearchAnnotation: any; detectedObjects: string[] } | null;
  nlpResults: { sentiment: string; entities: string[] } | null;
  parsed: {
    title: string;
    description: string;
    keywords: string[];
    textContent: string;
    imageUrls: string[];
    imageCount: number;
    linkCount: number;
    videoCount: number;
    audioCount: number;
    multimedia: ReturnType<typeof analyzeMultimediaFast>;
  };
}> {
  // Analyze the combined text from search results
  const childSafetyAnalysis = analyzeChildSafetyFast(
    searchData.combinedText,
    searchData.siteName,
    searchData.siteDescription,
    []
  );
  trackStep('Search Analysis', `${childSafetyAnalysis.unsafeKeywordsFound.length} risks from search data`);
  
  // Try Vision API on found images
  let visionResults: { labels: string[]; safeSearchAnnotation: any; detectedObjects: string[] } | null = null;
  if (visionClient && searchData.imageUrls.length > 0) {
    visionResults = await analyzeImagesWithVisionFast(searchData.imageUrls).catch(() => null);
    trackStep('Vision Analysis', `Analyzed ${searchData.imageUrls.length} images from search`);
  }
  
  // Try NLP on combined text
  let nlpResults: { sentiment: string; entities: string[] } | null = null;
  if (languageClient && searchData.combinedText) {
    nlpResults = await analyzeTextFast(searchData.combinedText).catch(() => null);
    trackStep('NLP Analysis', nlpResults ? 'Sentiment analyzed' : 'Skipped');
  }
  
  return {
    childSafetyAnalysis,
    visionResults,
    nlpResults,
    parsed: {
      title: searchData.siteName,
      description: searchData.siteDescription,
      keywords: [],
      textContent: searchData.combinedText,
      imageUrls: searchData.imageUrls,
      imageCount: searchData.imageUrls.length,
      linkCount: searchData.searchResults.length,
      videoCount: 0,
      audioCount: 0,
      multimedia: {
        videoDetected: false,
        audioDetected: false,
        mediaTypes: [],
        mediaSafetyScore: 100,
        mediaConcerns: [],
      },
    },
  };
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
// MAIN OPTIMIZED ANALYSIS (With Search Fallback)
// ============================================================================

async function analyzeUrlOptimized(url: string): Promise<ScanResult> {
  const startTime = Date.now();
  const performanceSteps: { name: string; durationMs: number; details?: string }[] = [];
  let lastStepTime = startTime;
  
  const trackStep = (name: string, details?: string) => {
    const now = Date.now();
    performanceSteps.push({ name, durationMs: now - lastStepTime, details });
    lastStepTime = now;
  };
  
  console.log(`\n🔍 [KOMAL ANALYSIS] Starting scan for: ${url}`);
  trackStep('Initialize', 'Setting up clients');
  initializeClients();

  let html: string | null = null;
  let fetchFailed = false;
  let useSearchFallback = false;

  // Step 1: Try to fetch HTML directly
  try {
    html = await fetchWebpageContentFast(url);
    trackStep('Fetch HTML', `${(html.length / 1024).toFixed(1)}KB`);
  } catch (error) {
    fetchFailed = true;
    trackStep('Fetch HTML', `FAILED - ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log(`⚠️ [KOMAL] Direct fetch failed, will use search fallback`);
  }

  let parsed: ReturnType<typeof parseHTMLContentFast> | null = null;
  let childSafetyAnalysis: ReturnType<typeof analyzeChildSafetyFast>;
  let nlpResults: { sentiment: string; entities: string[] } | null = null;
  let visionResults: { labels: string[]; safeSearchAnnotation: any; detectedObjects: string[] } | null = null;

  if (html && !fetchFailed) {
    // Step 2: Parse HTML
    parsed = parseHTMLContentFast(html, url);
    trackStep('Parse HTML', `${parsed.imageCount} imgs, ${parsed.linkCount} links, ${parsed.videoCount} videos`);

    // Step 3: Run child safety analysis on page content
    childSafetyAnalysis = analyzeChildSafetyFast(
      parsed.textContent,
      parsed.title,
      parsed.description,
      parsed.keywords
    );
    trackStep('Keyword Analysis', `${childSafetyAnalysis.unsafeKeywordsFound.length} risks, ${childSafetyAnalysis.filteredByContext} filtered`);

    // Check if we have enough content - if no images and little text, use search fallback
    const hasEnoughContent = parsed.imageUrls.length > 0 || parsed.textContent.length > 500;
    
    if (!hasEnoughContent) {
      console.log(`⚠️ [KOMAL] Page has minimal content (${parsed.imageUrls.length} images, ${parsed.textContent.length} chars), using search fallback`);
      useSearchFallback = true;
    }

    // Run NLP and Vision in parallel (no time budget - run all)
    const apiPromises: Promise<void>[] = [];
    
    // NLP analysis
    if (languageClient && parsed.textContent) {
      apiPromises.push(
        analyzeTextFast(parsed.textContent)
          .then(r => { nlpResults = r; })
          .catch(() => {})
      );
    }
    
    // Vision analysis - if we have images
    if (visionClient && parsed.imageUrls.length > 0) {
      apiPromises.push(
        analyzeImagesWithVisionFast(parsed.imageUrls)
          .then(r => { visionResults = r; })
          .catch(() => {})
      );
    } else if (useSearchFallback) {
      // No images on page - search for images
      console.log(`🔎 [KOMAL] No images on page, searching for images...`);
      const searchData = await searchForUrlInfo(url);
      trackStep('Search Images', `Found ${searchData.imageUrls.length} images from search`);
      
      if (visionClient && searchData.imageUrls.length > 0) {
        apiPromises.push(
          analyzeImagesWithVisionFast(searchData.imageUrls)
            .then(r => { visionResults = r; })
            .catch(() => {})
        );
      }
      
      // Also add search text to our analysis
      if (searchData.combinedText) {
        const searchSafetyAnalysis = analyzeChildSafetyFast(searchData.combinedText, '', '', []);
        // Merge search findings with page findings
        childSafetyAnalysis.unsafeKeywordsFound.push(...searchSafetyAnalysis.unsafeKeywordsFound);
        childSafetyAnalysis.safeKeywordsFound.push(...searchSafetyAnalysis.safeKeywordsFound);
      }
    }

    // Wait for all API calls to complete
    if (apiPromises.length > 0) {
      await Promise.all(apiPromises);
      trackStep('AI APIs', `NLP=${nlpResults ? '✓' : '✗'}, Vision=${visionResults ? '✓' : '✗'}`);
    }

  } else {
    // Fetch failed completely - use full search fallback
    console.log(`🔎 [KOMAL] Using full search fallback for analysis`);
    const searchData = await searchForUrlInfo(url);
    trackStep('Search Fallback', `${searchData.searchResults.length} results, ${searchData.imageUrls.length} images`);
    
    const searchAnalysis = await analyzeFromSearchResults(url, searchData, trackStep);
    childSafetyAnalysis = searchAnalysis.childSafetyAnalysis;
    visionResults = searchAnalysis.visionResults;
    nlpResults = searchAnalysis.nlpResults;
    parsed = searchAnalysis.parsed;
  }

  // Ensure we have parsed data
  if (!parsed) {
    // Last resort - create minimal parsed data
    const urlObj = new URL(url);
    parsed = {
      title: urlObj.hostname,
      description: '',
      keywords: [],
      textContent: '',
      imageUrls: [],
      imageCount: 0,
      linkCount: 0,
      videoCount: 0,
      audioCount: 0,
      multimedia: { videoDetected: false, audioDetected: false, mediaTypes: [], mediaSafetyScore: 100, mediaConcerns: [] },
    };
    childSafetyAnalysis = analyzeChildSafetyFast(url, '', '', []);
  }

  // Step 4: Calculate scores
  const multimediaRisk = 100 - parsed.multimedia.mediaSafetyScore;
  const ageGroupScores = calculateAgeGroupScores(
    childSafetyAnalysis,
    visionResults?.safeSearchAnnotation,
    multimediaRisk
  );

  const overallScore = Math.round(
    Object.values(ageGroupScores).reduce((sum, ag) => sum + ag.score, 0) / AGE_GROUPS.length
  );
  trackStep('Calculate Scores', `Score: ${overallScore}/100`);

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
  trackStep('Build Report', 'Complete');

  const totalTimeMs = Date.now() - startTime;
  const analysisMethod = (nlpResults || visionResults) ? 'live' : (fetchFailed || useSearchFallback ? 'live' : 'demo');
  
  console.log(`\n🎯 [KOMAL ANALYSIS] COMPLETE in ${(totalTimeMs/1000).toFixed(3)}s | Score: ${overallScore}/100 | Risk: ${childSafetyAnalysis.riskLevel} | Method: ${analysisMethod}\n`);

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
    analysisMethod: analysisMethod as 'live' | 'demo',
    usedSearchFallback: fetchFailed || useSearchFallback,
    performanceMetrics: {
      totalTimeMs,
      steps: performanceSteps,
    },
  };
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

function generateDemoAnalysisFast(url: string, priorTimeMs: number = 0): ScanResult {
  const startTime = Date.now();
  const performanceSteps: { name: string; durationMs: number; details?: string }[] = [];
  
  if (priorTimeMs > 0) {
    performanceSteps.push({ name: 'Error Recovery', durationMs: priorTimeMs, details: 'Fallback to demo mode' });
  }
  
  const urlLower = url.toLowerCase();
  const childSafetyAnalysis = analyzeChildSafetyFast(urlLower, '', '', []);
  performanceSteps.push({ name: 'URL Analysis', durationMs: Date.now() - startTime, details: 'Keyword scan' });

  // Quick URL pattern detection
  const isEducational = /edu|learn|wiki|school|kids|child/i.test(urlLower);
  const isSocial = /facebook|instagram|tiktok|twitter|snapchat/i.test(urlLower);
  performanceSteps.push({ name: 'Pattern Detection', durationMs: 1, details: `Edu=${isEducational}, Social=${isSocial}` });

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
  
  const totalTimeMs = priorTimeMs + (Date.now() - startTime);
  performanceSteps.push({ name: 'Calculate Scores', durationMs: Date.now() - startTime, details: `Score: ${overallScore}` });
  
  console.log(`🎯 [KOMAL DEMO] COMPLETE in ${(totalTimeMs/1000).toFixed(3)}s | Score: ${overallScore}/100\n`);

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
    performanceMetrics: {
      totalTimeMs,
      steps: performanceSteps,
    },
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
