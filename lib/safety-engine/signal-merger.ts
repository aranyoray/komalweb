// ============================================================================
// Signal Merger (Phase 7)
// Most-restrictive-wins merge across all signals per age band.
// Produces the unified SafetyReport output.
// ============================================================================

import { AGE_GROUPS } from './types';
import type {
  AgeGroup,
  AgeAction,
  NlpSignal,
  VisionSignal,
  AudioSignal,
  LinkSignal,
  DecisionSource,
  SafetyFlags,
  ContextType,
  SafetyReport,
  ScanResult,
  MajorCategory,
  SubcategoryMatch,
  ChildSafetyAnalysis,
} from './types';
import type { ScoringResult } from './category-scorer';
import type { SponsorDetectionResult } from './sponsor-detector';
import type { EscalationResult } from './risk-escalator';

// ============================================================================
// Types
// ============================================================================

export interface MergeInput {
  url: string;

  // Core analysis results (backward compat)
  scanResult: ScanResult;

  // Phase 3: Enhanced NLP
  categoryScoringResult?: ScoringResult | null;

  // Phase 4/5: Vision and Audio signals (optional, may not be implemented yet)
  visionSignal?: VisionSignal | null;
  audioSignal?: AudioSignal | null;

  // Phase 6: Sponsor detection and risk escalation
  sponsorResult?: SponsorDetectionResult | null;
  escalationResult?: EscalationResult | null;

  // Cloud fallback (Phase 8)
  cloudSignal?: { used: boolean; confidence: number } | null;
}

// ============================================================================
// Action Ordering
// ============================================================================

const ACTION_SEVERITY: Record<AgeAction, number> = {
  'ALLOW': 0,
  'GATE': 1,
  'BLOCK': 2,
};

function mostRestrictive(a: AgeAction, b: AgeAction): AgeAction {
  return ACTION_SEVERITY[a] >= ACTION_SEVERITY[b] ? a : b;
}

// ============================================================================
// Context Type Detection
// ============================================================================

function detectContextType(
  scanResult: ScanResult,
  sponsorResult?: SponsorDetectionResult | null
): ContextType {
  const text = (
    (scanResult.contentAnalysis.metadata.title || '') + ' ' +
    (scanResult.contentAnalysis.metadata.description || '') + ' ' +
    scanResult.contentAnalysis.textAnalysis.keyTopics.join(' ')
  ).toLowerCase();

  // Check specific context patterns
  if (/tiktok|shorts|reels|short.?form/i.test(text)) return 'short_form_video';
  if (/porn|xxx|adult|explicit|nsfw/i.test(text)) return 'pornographic';
  if (/horror|scary|creepy|paranormal/i.test(text)) return 'horror';
  if (/news|breaking|headline|reporter|journalist/i.test(text)) return 'news';
  if (/forum|reddit|thread|discussion|community/i.test(text)) return 'forum';
  if (/social\s*media|instagram|twitter|facebook|tiktok/i.test(text)) return 'social_media_post';
  if (/education|learn|school|tutorial|course/i.test(text)) return 'educational';
  if (/sport|game|team|match|championship/i.test(text)) return 'sports';
  if (/crypto|forex|trading|invest|pump|stock/i.test(text)) return 'speculative_finance';
  if (/get\s*rich|mlm|pyramid|passive\s*income/i.test(text)) return 'get_rich_quick';
  if (/financial\s*advice|stock\s*tip/i.test(text)) return 'financial_advice';
  if (/article|blog|post|read|story/i.test(text)) return 'article';
  if (sponsorResult?.sponsorDetected || sponsorResult?.affiliateDetected) return 'commercial';
  if (/movie|music|video|stream|entertainment/i.test(text)) return 'entertainment';

  return '';
}

// ============================================================================
// Topic Tags
// ============================================================================

function buildTopicTags(
  scanResult: ScanResult,
  categoryScoringResult?: ScoringResult | null
): string[] {
  const tags = new Set<string>();

  // From key topics
  for (const topic of scanResult.contentAnalysis.textAnalysis.keyTopics) {
    if (topic !== 'General' && topic !== 'Blocked Content') {
      tags.add(topic.toLowerCase());
    }
  }

  // From risk categories
  for (const rc of scanResult.childSafetyAnalysis.riskCategories) {
    tags.add(rc.category.toLowerCase());
  }

  // From category scorer
  if (categoryScoringResult?.primaryCategory) {
    // Extract the category name without the number prefix
    const catName = categoryScoringResult.primaryCategory.category
      .replace(/^\d+\.\s*/, '')
      .toLowerCase();
    tags.add(catName);

    if (categoryScoringResult.primaryCategory.primarySubcategory) {
      tags.add(categoryScoringResult.primaryCategory.primarySubcategory.subcategory.toLowerCase());
    }
  }

  // From unsafe keywords
  for (const kw of scanResult.contentAnalysis.textAnalysis.unsafeKeywordsFound.slice(0, 5)) {
    tags.add(kw.toLowerCase());
  }

  return [...tags].slice(0, 15);
}

// ============================================================================
// Safety Flags
// ============================================================================

function detectFlags(scanResult: ScanResult): SafetyFlags {
  const allText = (
    scanResult.contentAnalysis.textAnalysis.keyTopics.join(' ') + ' ' +
    scanResult.contentAnalysis.textAnalysis.unsafeKeywordsFound.join(' ') + ' ' +
    (scanResult.contentAnalysis.metadata.title || '') + ' ' +
    (scanResult.contentAnalysis.metadata.description || '')
  ).toLowerCase();

  return {
    bodyAnxiety: /body\s*anxiety|eating\s*disorder|anorexia|bulimia|thinspo|body\s*sham|perfect\s*body|crash\s*diet|steroid/i.test(allText),
    selfHarm: /self.?harm|suicide|suicidal|cut\s*myself|kill\s*myself|want\s*to\s*die/i.test(allText),
    fraudOrScam: /scam|fraud|pump.?dump|pyramid|mlm|get\s*rich\s*quick|fake\s*investment/i.test(allText),
    extremism: /extremis|terrorist|isis|al.?qaeda|radical|propaganda|white\s*supremac/i.test(allText),
  };
}

// ============================================================================
// Decision Source Builder
// ============================================================================

function buildDecisionSource(
  input: MergeInput
): DecisionSource {
  const nlpConfidence = input.categoryScoringResult?.nlpSignal?.confidence || 0;

  return {
    nlp: {
      used: !!input.categoryScoringResult?.nlpSignal?.used,
      confidence: nlpConfidence,
    },
    vision: {
      used: !!input.visionSignal?.used,
      confidence: input.visionSignal?.confidence || 0,
    },
    audio: {
      used: !!input.audioSignal?.used,
      confidence: input.audioSignal?.confidence || 0,
    },
    links: {
      used: !!input.sponsorResult?.linkSignal?.used,
      confidence: input.sponsorResult ? 0.8 : 0,
    },
    cloud: {
      used: !!input.cloudSignal?.used,
      confidence: input.cloudSignal?.confidence || 0,
    },
  };
}

// ============================================================================
// Major Categories / Subcategories for SafetyReport
// ============================================================================

function buildMajorCategories(
  categoryScoringResult?: ScoringResult | null
): { majorCategories: MajorCategory[]; subcategories: SubcategoryMatch[] } {
  if (!categoryScoringResult) {
    return { majorCategories: [], subcategories: [] };
  }

  const majorCategories: MajorCategory[] = categoryScoringResult.allCategories
    .filter(c => c.probability > 0.05)
    .slice(0, 10)
    .map(c => ({
      name: c.category,
      probability: c.probability,
      subcategories: c.subcategoryScores
        .filter(s => s.probability > 0.05)
        .slice(0, 5)
        .map(s => ({
          name: s.subcategory,
          probability: s.probability,
          ageActions: Object.fromEntries(
            AGE_GROUPS.map(ag => [ag, { action: s.ageActions[ag], score: s.probability }])
          ) as SubcategoryMatch['ageActions'],
        })),
    }));

  const subcategories: SubcategoryMatch[] = categoryScoringResult.primaryCategory?.subcategoryScores
    .filter(s => s.probability > 0.05)
    .slice(0, 5)
    .map(s => ({
      name: s.subcategory,
      probability: s.probability,
      ageActions: Object.fromEntries(
        AGE_GROUPS.map(ag => [ag, { action: s.ageActions[ag], score: s.probability }])
      ) as SubcategoryMatch['ageActions'],
    })) || [];

  return { majorCategories, subcategories };
}

// ============================================================================
// Main Merge Function
// ============================================================================

/**
 * Merge all signals into a unified SafetyReport using most-restrictive-wins.
 */
export function mergeSignals(input: MergeInput): SafetyReport {
  const { scanResult, categoryScoringResult, visionSignal, audioSignal, sponsorResult, escalationResult } = input;

  // Start with the base age actions from the scan result
  const mergedAgeActions = {} as SafetyReport['ageActions'];

  for (const ag of AGE_GROUPS) {
    const base = scanResult.ageGroupScores[ag];
    let action = base.action;
    const risks = [...base.risks];

    // Merge vision signal (if available)
    if (visionSignal?.used && visionSignal.perImageActions.length > 0) {
      const worstVisionAction = visionSignal.perImageActions.reduce(
        (worst, img) => mostRestrictive(worst, img.action), 'ALLOW' as AgeAction
      );
      action = mostRestrictive(action, worstVisionAction);
    }

    // Merge audio signal (if available)
    if (audioSignal?.used) {
      const audioAction: AgeAction = audioSignal.audioSafetyScore < 0.3 ? 'BLOCK'
        : audioSignal.audioSafetyScore < 0.6 ? 'GATE'
        : 'ALLOW';
      action = mostRestrictive(action, audioAction);
    }

    // Merge link/sponsor escalation
    if (escalationResult?.escalated && escalationResult.ageActionOverrides[ag]) {
      const escalatedAction = escalationResult.ageActionOverrides[ag]!;
      action = mostRestrictive(action, escalatedAction);
      const relatedEscalations = escalationResult.escalations.filter(e => e.ageBand === ag);
      for (const esc of relatedEscalations) {
        risks.push(esc.reason);
      }
    }

    mergedAgeActions[ag] = {
      action,
      score: action === 'BLOCK' ? 0 : action === 'GATE' ? 0.5 : Math.max(0, base.score / 100),
      reason: base.reason,
      risks: risks.slice(0, 5),
    };
  }

  // Compute safety scores (0-1 scale)
  const nlpSignal = categoryScoringResult?.nlpSignal;
  const languageSafetyScore = nlpSignal?.languageSafetyScore ?? (scanResult.contentAnalysis.textAnalysis.languageScore / 100);
  const visualSafetyScore = visionSignal?.visualSafetyScore ?? (scanResult.contentAnalysis.visualAnalysis.safetyScore / 100);
  const audioSafetyScore = audioSignal?.audioSafetyScore ?? 1.0;

  const overallsafetyscore = Math.round(
    (languageSafetyScore * 0.40 + visualSafetyScore * 0.35 + audioSafetyScore * 0.25) * 1000
  ) / 1000;

  // Context type, topic tags, flags
  const contextType = detectContextType(scanResult, sponsorResult);
  const topicTags = buildTopicTags(scanResult, categoryScoringResult);
  const flags = detectFlags(scanResult);
  const decisionSource = buildDecisionSource(input);
  const { majorCategories, subcategories } = buildMajorCategories(categoryScoringResult);

  return {
    url: scanResult.url,

    // New unified fields
    overallsafetyscore,
    languageSafetyScore,
    visualSafetyScore,
    audioSafetyScore,
    ageActions: mergedAgeActions,
    majorCategories,
    subcategories,
    contextType,
    topicTags,
    flags,
    decisionSource,

    // Backward-compatible fields
    overallScore: scanResult.overallScore,
    ageGroupScores: scanResult.ageGroupScores,
    contentAnalysis: scanResult.contentAnalysis,
    childSafetyAnalysis: scanResult.childSafetyAnalysis,
    timestamp: scanResult.timestamp,
    analysisMethod: scanResult.analysisMethod,
    usedSearchFallback: scanResult.usedSearchFallback,
    performanceMetrics: scanResult.performanceMetrics,
    pythonDebug: scanResult.pythonDebug,
  };
}
