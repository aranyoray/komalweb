// ============================================================================
// Safety Engine - Barrel Export
// ============================================================================

// Types
export type {
  AgeGroup,
  AgeBand,
  AgeAction,
  RenderBehavior,
  RiskSeverity,
  RiskLevel,
  ContextType,
  NlpSignal,
  VisionSignal,
  AudioSignal,
  LinkSignal,
  DecisionSource,
  MajorCategory,
  SubcategoryMatch,
  SafetyFlags,
  SafetyReport,
  ScanResult,
  DangerousSiteInfo,
  KeywordFinding,
  ContextAnalysisResult,
  ChildSafetyRisk,
  ChildSafetyAnalysis,
  CsvRule,
  PerformanceTracker,
  SearchAnalysisData,
  ParentChild,
  ParentControlResult,
  BlockNotification,
} from './types';

export { AGE_GROUPS } from './types';

// Pipeline (main entry points)
export { analyzeUrl, analyzeKeyword, generateDemoAnalysis, isValidUrl } from './pipeline';

// Domain lists
export { isDangerousSite, isSocialMediaSite } from './domain-lists';

// Age scoring
export { analyzeChildSafetyFast, calculateAgeGroupScores, detectTopics } from './age-scoring';

// Cloud APIs
export { initializeClients, getLikelihoodScore } from './cloud-apis';

// Rules engine
export { loadRules, getRulesForCategory, getMajorCategories, getSubcategories } from './rules-engine';

// Content fetcher
export { fetchWebpageContentFast, searchForUrlInfo } from './content-fetcher';

// HTML parser
export { parseHTMLContentFast } from './html-parser';

// Python bridge
export { runPythonAnalysis } from './python-bridge';

// Text preprocessor
export { preprocessText, getCombinedWeightedText } from './text-preprocessor';
export type { TextBlock, PreprocessedText } from './text-preprocessor';

// Category scorer
export { scoreCategories } from './category-scorer';
export type { CategoryScore, SubcategoryScore, ScoringResult } from './category-scorer';

// Signal merger
export { mergeSignals } from './signal-merger';
export type { MergeInput } from './signal-merger';

// Sponsor detection
export { detectSponsors, detectDisclosure } from './sponsor-detector';
export type { DetectedLink, SponsorDetectionResult } from './sponsor-detector';

// Risk escalation
export { escalateRisk } from './risk-escalator';
export type { EscalationResult, EscalationDetail } from './risk-escalator';

// Parent controls
export {
  checkParentControls,
  getParentChildren,
  addChild,
  getChild,
  updateChild,
  deleteChild,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  ageToAgeBand,
} from './parent-controls';

// Vision classifier
export { classifyImages, mapLabelsToCategories } from './vision-classifier';

// Audio analyzer
export { extractAudioSources, analyzeAudio, shouldSkipAudio } from './audio-analyzer';
export type { ExtractedAudioSource } from './audio-analyzer';

// Cloud fallback
export { shouldTriggerCloudFallback, runCloudFallback, classifyTextWithGcp } from './cloud-fallback';
export type { CloudFallbackResult } from './cloud-fallback';

// Body region types
export type { BodyRegion, RevealingLevel, RegionCoverage, CoverageMap } from './body-region-types';
export { REVEALING_LEVEL_VALUES, REGION_WEIGHTS, AGE_BAND_THRESHOLDS } from './body-region-types';

// Revealing scorer
export { buildCoverageMap, getRevealingAction, getRevealingActionsAllBands, scoreRevealingContent } from './revealing-scorer';
export type { RevealingScorerResult } from './revealing-scorer';
