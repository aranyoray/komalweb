// ============================================================================
// Keyword Patterns & Context Analysis
// Extracted from app/api/scan-url/route.ts
// ============================================================================

import type { AgeGroup, ContextAnalysisResult } from './types';

// Pre-compiled regex patterns for faster matching
export const CHILD_UNSAFE_PATTERNS: { [category: string]: RegExp } = {};

export const CHILD_UNSAFE_KEYWORDS: { [category: string]: string[] } = {
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

export const CHILD_SAFE_KEYWORDS = [
  'educational', 'education', 'learn', 'learning', 'teach', 'teaching',
  'school', 'homework', 'study', 'student', 'classroom',
  'kids', 'children', 'family', 'parents', 'child-friendly',
  'cartoon', 'animation', 'disney', 'pixar', 'nickelodeon',
  'science', 'math', 'history', 'geography', 'reading', 'writing',
  'arts', 'crafts', 'music', 'dance', 'sports',
  'nature', 'animals', 'wildlife', 'environment',
  'safe', 'appropriate', 'wholesome', 'pbs', 'sesame',
];

export const SAFE_PATTERN = new RegExp(`\\b(${CHILD_SAFE_KEYWORDS.join('|')})`, 'gi');

// ============================================================================
// CONTEXT-AWARE KEYWORD ANALYSIS
// ============================================================================

// DANGEROUS context patterns - ONLY these will trigger a flag
export const DANGEROUS_CONTEXT_PATTERNS: { [keyword: string]: RegExp[] } = {
  // === WEAPONS ===
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

  // === DRUGS ===
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

  // === GAMBLING ===
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

  // === VIOLENCE ===
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

  // === SELF-HARM/SUICIDE ===
  'suicide': [
    /commit\s*suicide/i, /how\s*to\s*(commit\s*)?suicide/i, /want\s*to\s*die/i,
    /kill\s*myself/i, /end\s*my\s*life/i, /suicide\s*method/i, /ways\s*to\s*die/i
  ],
  'self-harm': [/how\s*to\s*self.?harm/i, /want\s*to\s*hurt\s*myself/i, /cutting\s*myself/i, /self.?harm.*method/i],
  'cutting': [/cutting\s*myself/i, /cut\s*myself/i, /self.?cutting/i],

  // === EXPLICIT CONTENT ===
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

  // === PREDATORY ===
  'grooming': [/child\s*grooming/i, /online\s*grooming/i, /grooming.*minor/i, /grooming.*child/i, /grooming.*kid/i],
  'predator': [/sexual\s*predator/i, /child\s*predator/i, /online\s*predator/i],

  // === HATE/DISCRIMINATION ===
  'racist': [/be\s*racist/i, /racist\s*joke/i, /racist\s*slur/i],
  'racism': [/promote\s*racism/i, /racism\s*is\s*(good|right)/i],
  'hate': [/hate\s*(him|her|them|you|jews|muslims|black|white|gay)/i, /hate\s*crime/i, /hate\s*speech/i],

  // === PROFANITY ===
  'fuck': [/fuck\s*(you|off|him|her|them)/i, /go\s*fuck/i, /fucking\s*(idiot|stupid|hate)/i],
  'shit': [/shit.*die/i, /shit.*kill/i, /piece\s*of\s*shit/i],
  'bitch': [/stupid\s*bitch/i, /kill.*bitch/i, /hate.*bitch/i],
};

// Keywords that REQUIRE dangerous context to be flagged
export const CONTEXT_REQUIRED_KEYWORDS = new Set([
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

// ALWAYS DANGEROUS keywords (no context needed)
export const ALWAYS_DANGEROUS_KEYWORDS = new Set([
  'porn', 'pornography', 'pornhub', 'xvideos', 'xnxx',
  'cocaine', 'heroin', 'methamphetamine', 'fentanyl', 'lsd', 'ecstasy',
  'pedophile', 'pedophilia', 'incest',
  'terrorism', 'terrorist',
  'nigger', 'nigga', 'faggot', 'retard'
]);

// ============================================================================
// Context Analysis Functions
// ============================================================================

export function analyzeKeywordContext(keyword: string, context: string): ContextAnalysisResult {
  const lowerKeyword = keyword.toLowerCase();
  const lowerContext = context.toLowerCase();

  const safeResult: ContextAnalysisResult = {
    shouldFlag: false,
    isDangerous: false,
    severity: 0,
    reason: 'Neutral context - not flagged',
    ageMultipliers: { '<10': 0, '10-13': 0, '13-16': 0, '16+': 0 }
  };

  // ALWAYS DANGEROUS
  if (ALWAYS_DANGEROUS_KEYWORDS.has(lowerKeyword)) {
    return {
      shouldFlag: true,
      isDangerous: true,
      severity: 1,
      reason: 'Age-inappropriate keyword',
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
          reason: `Age-inappropriate context: ${pattern.source.slice(0, 30)}...`,
          ageMultipliers: { '<10': 1, '10-13': 1, '13-16': 1, '16+': 0.8 }
        };
      }
    }
  }

  // If keyword requires context and no dangerous context found -> SAFE
  if (CONTEXT_REQUIRED_KEYWORDS.has(lowerKeyword)) {
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

    return safeResult;
  }

  return safeResult;
}

export function getExtendedContext(content: string, keyword: string, position: number): string {
  const contextRadius = 100;
  const start = Math.max(0, position - contextRadius);
  const end = Math.min(content.length, position + keyword.length + contextRadius);
  return content.slice(start, end).toLowerCase();
}
