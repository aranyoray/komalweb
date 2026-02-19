// ============================================================================
// Unified Content Safety Engine Types
// ============================================================================

// Age bands used throughout the safety pipeline
export const AGE_GROUPS = ['<10', '10-13', '13-16', '16+'] as const;
export type AgeGroup = (typeof AGE_GROUPS)[number];

// New age band format for future-facing SafetyReport
export type AgeBand = 'below10' | '10_13' | '13_16' | '16_18';

// Action decisions per age band
export type AgeAction = 'BLOCK' | 'GATE' | 'ALLOW';

// Render behavior for gated/blocked content
export type RenderBehavior = 'placeholder' | 'blur_tap_to_view' | 'show';

// Risk severity levels
export type RiskSeverity = 'critical' | 'high' | 'medium' | 'low';

// Risk level classification
export type RiskLevel = 'safe' | 'caution' | 'unsafe' | 'dangerous';

// Context types for content classification
export type ContextType =
  | 'short_form_video'
  | 'article'
  | 'social_media_post'
  | 'forum'
  | 'news'
  | 'educational'
  | 'entertainment'
  | 'pornographic'
  | 'sports'
  | 'horror'
  | 'commercial'
  | 'speculative_finance'
  | 'get_rich_quick'
  | 'financial_advice'
  | '';

// ============================================================================
// Signal Types (per-pipeline outputs)
// ============================================================================

export interface NlpSignal {
  used: boolean;
  confidence: number;
  categories: { category: string; probability: number }[];
  subcategories: { subcategory: string; probability: number }[];
  keyTopics: string[];
  sentiment: string;
  languageSafetyScore: number;
}

export interface VisionSignal {
  used: boolean;
  confidence: number;
  perImageActions: {
    imageUrl: string;
    action: AgeAction;
    renderBehavior: RenderBehavior;
    labels: string[];
    safeSearch: {
      adult: number;
      violence: number;
      racy: number;
    };
  }[];
  visualSafetyScore: number;
  labels: string[];
}

export interface AudioSignal {
  used: boolean;
  confidence: number;
  categories: { category: string; probability: number }[];
  toneAnalysis?: string;
  audioSafetyScore: number;
}

export interface LinkSignal {
  used: boolean;
  externalLinks: {
    url: string;
    category: string;
    isSponsor: boolean;
    action: AgeAction;
  }[];
  sponsorDetected: boolean;
  affiliateDetected: boolean;
}

// ============================================================================
// Decision Source (tracks which signals contributed)
// ============================================================================

export interface DecisionSource {
  nlp: { used: boolean; confidence: number };
  vision: { used: boolean; confidence: number };
  audio: { used: boolean; confidence: number };
  links: { used: boolean; confidence: number };
  cloud: { used: boolean; confidence: number };
}

// ============================================================================
// Major Category / Subcategory (from CSV rules)
// ============================================================================

export interface MajorCategory {
  name: string;
  probability: number;
  subcategories: SubcategoryMatch[];
}

export interface SubcategoryMatch {
  name: string;
  probability: number;
  ageActions: {
    [key in AgeGroup]: {
      action: AgeAction;
      score: number;
    };
  };
}

// ============================================================================
// Flags
// ============================================================================

export interface SafetyFlags {
  bodyAnxiety: boolean;
  selfHarm: boolean;
  fraudOrScam: boolean;
  extremism: boolean;
}

// ============================================================================
// SafetyReport - The unified output schema (superset of ScanResult)
// ============================================================================

export interface SafetyReport {
  url: string;

  // New unified fields
  overallsafetyscore: number; // 0-1 scale
  languageSafetyScore: number; // 0-1 scale
  visualSafetyScore: number; // 0-1 scale
  audioSafetyScore: number; // 0-1 scale

  ageActions: {
    [key in AgeGroup]: {
      action: AgeAction;
      score: number; // 0-1 scale
      reason: string;
      risks: string[];
    };
  };

  majorCategories: MajorCategory[];
  subcategories: SubcategoryMatch[];
  contextType: ContextType;
  topicTags: string[];
  flags: SafetyFlags;
  decisionSource: DecisionSource;

  // Backward-compatible fields (old schema)
  overallScore: number; // 0-100 scale
  ageGroupScores: {
    [key in AgeGroup]: {
      score: number;
      action: AgeAction;
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
    overallRisk: RiskLevel;
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
  usedSearchFallback?: boolean;
  performanceMetrics?: {
    totalTimeMs: number;
    steps: {
      name: string;
      durationMs: number;
      details?: string;
    }[];
  };
  pythonDebug?: any;
}

// ============================================================================
// Legacy ScanResult (backward compat - same as before refactor)
// ============================================================================

export interface ScanResult {
  url: string;
  overallScore: number;
  ageGroupScores: {
    [key in AgeGroup]: {
      score: number;
      action: AgeAction;
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
    overallRisk: RiskLevel;
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
  usedSearchFallback?: boolean;
  performanceMetrics?: {
    totalTimeMs: number;
    steps: {
      name: string;
      durationMs: number;
      details?: string;
    }[];
  };
  pythonDebug?: any;
}

// ============================================================================
// Internal types used across modules
// ============================================================================

export interface DangerousSiteInfo {
  category: string;
  reason: string;
  severity: RiskSeverity;
}

export interface KeywordFinding {
  category: string;
  keyword: string;
  count: number;
  context: string[];
  contextSafe: boolean;
  isDangerous: boolean;
  severity: number;
  ageMultipliers: { [key in AgeGroup]: number };
}

export interface ContextAnalysisResult {
  shouldFlag: boolean;
  isDangerous: boolean;
  severity: number;
  reason: string;
  ageMultipliers: { [key in AgeGroup]: number };
}

export interface ChildSafetyRisk {
  category: string;
  severity: RiskSeverity;
  deduction: { '<10': number; '10-13': number; '13-16': number; '16+': number };
}

export interface ChildSafetyAnalysis {
  unsafeKeywordsFound: KeywordFinding[];
  safeKeywordsFound: string[];
  riskScore: number;
  riskLevel: RiskLevel;
  filteredByContext: number;
  ageSpecificRiskScores: { [key in AgeGroup]: number };
}

export interface GoogleSearchResult {
  title: string;
  link: string;
  snippet: string;
  pagemap?: {
    cse_image?: { src: string }[];
    cse_thumbnail?: { src: string }[];
    metatags?: { [key: string]: string }[];
  };
}

export interface GoogleSearchResponse {
  items?: GoogleSearchResult[];
  searchInformation?: {
    totalResults: string;
    searchTime: number;
  };
  error?: {
    code: number;
    message: string;
  };
}

export interface GoogleImageResult {
  title: string;
  link: string;
  image: {
    contextLink: string;
    thumbnailLink: string;
    thumbnailHeight: number;
    thumbnailWidth: number;
  };
}

export interface GoogleImageSearchResponse {
  items?: GoogleImageResult[];
  error?: {
    code: number;
    message: string;
  };
}

export interface SearchResult {
  title: string;
  snippet: string;
  link: string;
  imageUrl?: string;
}

export interface SearchAnalysisData {
  searchResults: SearchResult[];
  imageUrls: string[];
  combinedText: string;
  siteName: string;
  siteDescription: string;
}

export interface SerpApiOrganicResult {
  title?: string;
  link?: string;
  snippet?: string;
}

export interface SerpApiImageResult {
  original?: string;
  link?: string;
}

export interface SerpApiResponse {
  organic_results?: SerpApiOrganicResult[];
  images_results?: SerpApiImageResult[];
  knowledge_graph?: { title?: string; description?: string };
  search_information?: { total_results?: number };
}

// ============================================================================
// Parent Controls Types
// ============================================================================

export interface ParentChild {
  id?: string;
  name: string;
  age: number;
  ageBand: AgeGroup;
  blockedUrls: string[];
  blockedKeywords: string[];
  allowedUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ParentControlResult {
  action: 'BLOCK' | 'ALLOW' | null;
  reason: string;
  matchedRule?: string;
  childId?: string;
  childName?: string;
}

export interface BlockNotification {
  id?: string;
  childId: string;
  childName: string;
  type: 'blocked_url' | 'blocked_keyword';
  url: string;
  keyword?: string;
  matchedRule: string;
  timestamp: string;
  read: boolean;
}

// CSV Rules Engine types
export interface CsvRule {
  majorCategory: string;
  subcategory: string;
  keywords: string[];
  contextualKeywords: string[];
  nlpCategoryCheck: string;
  nlpSubcategoryCheck: string;
  schema: string;
  ageActions: {
    '<10': AgeAction;
    '10-13': AgeAction;
    '13-16': AgeAction;
    '16+': AgeAction;
  };
  visionDescription: string;
  audioDescription: string;
}

// Performance tracking
export interface PerformanceTracker {
  trackStep: (name: string, details?: string) => void;
  getSteps: () => { name: string; durationMs: number; details?: string }[];
  getTotalTime: () => number;
}
