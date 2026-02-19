// ============================================================================
// Revealing Content Scorer (Phase 11)
// Body-region coverage detection with 15 body regions and 6 revealing levels.
// Maps GCP Vision API labels to body regions as approximation.
// Produces per-image revealing scores and age-band actions.
// ============================================================================

import { AGE_GROUPS } from './types';
import type { AgeGroup, AgeAction, VisionSignal } from './types';
import type {
  BodyRegion,
  RevealingLevel,
  RegionCoverage,
  CoverageMap,
} from './body-region-types';
import {
  REVEALING_LEVEL_VALUES,
  REGION_WEIGHTS,
  AGE_BAND_THRESHOLDS,
} from './body-region-types';

// ============================================================================
// Vision Label → Body Region Mapping
// ============================================================================

/**
 * Map Vision API labels to body region detections.
 * This is an approximation - a dedicated body segmentation model
 * (e.g., BodyPix, MediaPipe) would be more accurate.
 */
const LABEL_TO_REGIONS: Record<string, { regions: BodyRegion[]; level: RevealingLevel }> = {
  // Explicit / Near-explicit
  'nudity':        { regions: ['upper_chest', 'lower_chest', 'groin', 'buttocks'], level: 'explicit_exposure' },
  'nude':          { regions: ['upper_chest', 'lower_chest', 'groin', 'buttocks'], level: 'explicit_exposure' },
  'topless':       { regions: ['upper_chest', 'lower_chest', 'upper_abdomen'], level: 'explicit_exposure' },
  'bare chest':    { regions: ['upper_chest', 'lower_chest', 'upper_abdomen'], level: 'near_exposure' },
  'bare torso':    { regions: ['upper_chest', 'lower_chest', 'upper_abdomen', 'lower_abdomen'], level: 'near_exposure' },

  // Minimal coverage
  'bikini':        { regions: ['upper_chest', 'lower_chest', 'upper_abdomen', 'lower_abdomen', 'upper_thigh'], level: 'minimal_coverage' },
  'swimwear':      { regions: ['upper_chest', 'lower_chest', 'upper_abdomen', 'upper_thigh'], level: 'minimal_coverage' },
  'swimsuit':      { regions: ['upper_chest', 'lower_chest', 'upper_abdomen', 'upper_thigh'], level: 'minimal_coverage' },
  'lingerie':      { regions: ['upper_chest', 'lower_chest', 'upper_thigh', 'buttocks'], level: 'minimal_coverage' },
  'underwear':     { regions: ['upper_chest', 'lower_chest', 'groin', 'buttocks'], level: 'minimal_coverage' },
  'bra':           { regions: ['upper_chest', 'lower_chest'], level: 'minimal_coverage' },
  'thong':         { regions: ['buttocks', 'groin'], level: 'near_exposure' },

  // Form fitting
  'bodysuit':      { regions: ['upper_chest', 'lower_chest', 'upper_abdomen', 'lower_abdomen', 'upper_thigh'], level: 'form_fitting' },
  'leotard':       { regions: ['upper_chest', 'lower_chest', 'upper_abdomen', 'lower_abdomen'], level: 'form_fitting' },
  'spandex':       { regions: ['upper_thigh', 'lower_thigh', 'lower_abdomen'], level: 'form_fitting' },
  'yoga pants':    { regions: ['upper_thigh', 'lower_thigh', 'buttocks'], level: 'form_fitting' },
  'leggings':      { regions: ['upper_thigh', 'lower_thigh', 'buttocks'], level: 'form_fitting' },
  'tight dress':   { regions: ['upper_chest', 'lower_chest', 'upper_abdomen', 'lower_abdomen', 'upper_thigh'], level: 'form_fitting' },

  // Partially covered
  'crop top':      { regions: ['upper_abdomen', 'lower_abdomen'], level: 'partially_covered' },
  'tank top':      { regions: ['shoulders', 'upper_arm'], level: 'partially_covered' },
  'shorts':        { regions: ['upper_thigh'], level: 'partially_covered' },
  'mini skirt':    { regions: ['upper_thigh', 'lower_thigh'], level: 'partially_covered' },
  'sleeveless':    { regions: ['shoulders', 'upper_arm'], level: 'partially_covered' },
  'v-neck':        { regions: ['neck', 'upper_chest'], level: 'partially_covered' },
  'backless':      { regions: ['upper_back', 'lower_back'], level: 'partially_covered' },
  'strapless':     { regions: ['shoulders', 'upper_chest'], level: 'partially_covered' },
  'cleavage':      { regions: ['upper_chest', 'lower_chest'], level: 'minimal_coverage' },

  // Skin detection (generic)
  'skin':          { regions: ['upper_arm', 'forearm', 'upper_thigh'], level: 'partially_covered' },
  'bare skin':     { regions: ['upper_abdomen', 'lower_abdomen', 'upper_arm'], level: 'minimal_coverage' },
  'shirtless':     { regions: ['upper_chest', 'lower_chest', 'upper_abdomen'], level: 'near_exposure' },
};

// ============================================================================
// SafeSearch → Region Inference
// ============================================================================

/**
 * Infer body region coverage from SafeSearch annotations.
 * When specific labels aren't available, SafeSearch scores
 * provide a proxy for likely body exposure.
 */
function inferFromSafeSearch(
  safeSearch: { adult: number; violence: number; racy: number }
): RegionCoverage[] {
  const regions: RegionCoverage[] = [];

  if (safeSearch.adult >= 4) {
    // VERY_LIKELY adult → explicit exposure of sensitive regions
    regions.push(
      { region: 'upper_chest', level: 'explicit_exposure', confidence: 0.7 },
      { region: 'lower_chest', level: 'explicit_exposure', confidence: 0.7 },
      { region: 'groin', level: 'near_exposure', confidence: 0.6 },
      { region: 'buttocks', level: 'near_exposure', confidence: 0.6 },
    );
  } else if (safeSearch.adult >= 3) {
    // LIKELY adult → near exposure
    regions.push(
      { region: 'upper_chest', level: 'near_exposure', confidence: 0.5 },
      { region: 'lower_chest', level: 'near_exposure', confidence: 0.5 },
      { region: 'upper_thigh', level: 'minimal_coverage', confidence: 0.4 },
    );
  }

  if (safeSearch.racy >= 4) {
    // VERY_LIKELY racy → minimal coverage
    regions.push(
      { region: 'upper_chest', level: 'minimal_coverage', confidence: 0.5 },
      { region: 'upper_thigh', level: 'minimal_coverage', confidence: 0.5 },
      { region: 'upper_abdomen', level: 'minimal_coverage', confidence: 0.4 },
    );
  } else if (safeSearch.racy >= 3) {
    // LIKELY racy → partially covered
    regions.push(
      { region: 'shoulders', level: 'partially_covered', confidence: 0.4 },
      { region: 'upper_thigh', level: 'partially_covered', confidence: 0.4 },
    );
  }

  return regions;
}

// ============================================================================
// Coverage Map Builder
// ============================================================================

/**
 * Build a CoverageMap for a single image from Vision API labels and SafeSearch.
 */
export function buildCoverageMap(
  imageUrl: string,
  labels: string[],
  safeSearch: { adult: number; violence: number; racy: number }
): CoverageMap {
  const regionMap = new Map<BodyRegion, RegionCoverage>();

  // Process labels
  for (const label of labels) {
    const key = label.toLowerCase();
    const mapping = LABEL_TO_REGIONS[key];
    if (!mapping) continue;

    for (const region of mapping.regions) {
      const existing = regionMap.get(region);
      const newValue = REVEALING_LEVEL_VALUES[mapping.level];
      const existingValue = existing ? REVEALING_LEVEL_VALUES[existing.level] : -1;

      // Keep the most revealing level per region
      if (newValue > existingValue) {
        regionMap.set(region, {
          region,
          level: mapping.level,
          confidence: 0.6, // Label-based detection confidence
        });
      }
    }
  }

  // Augment with SafeSearch inference
  const safeSearchRegions = inferFromSafeSearch(safeSearch);
  for (const sr of safeSearchRegions) {
    const existing = regionMap.get(sr.region);
    const newValue = REVEALING_LEVEL_VALUES[sr.level];
    const existingValue = existing ? REVEALING_LEVEL_VALUES[existing.level] : -1;

    // Only upgrade, never downgrade
    if (newValue > existingValue) {
      regionMap.set(sr.region, sr);
    }
  }

  const regions = [...regionMap.values()];
  const overallScore = computeRevealingScore(regions);

  return { imageUrl, regions, overallRevealingScore: overallScore };
}

// ============================================================================
// Revealing Score Computation
// ============================================================================

/**
 * Compute a 0-1 revealing score from region coverages.
 * Weight sensitive regions higher. Confidence-adjusted.
 */
function computeRevealingScore(regions: RegionCoverage[]): number {
  if (regions.length === 0) return 0;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const rc of regions) {
    const weight = REGION_WEIGHTS[rc.region] || 0.5;
    const value = REVEALING_LEVEL_VALUES[rc.level];
    const adjusted = value * rc.confidence;

    weightedSum += adjusted * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return 0;

  // Normalize to 0-1, capped at 1.0
  const score = Math.min(1.0, weightedSum / totalWeight);
  return Math.round(score * 1000) / 1000;
}

// ============================================================================
// Age-Band Action from Revealing Score
// ============================================================================

/**
 * Determine action per age band based on the revealing score.
 */
export function getRevealingAction(
  revealingScore: number,
  ageBand: AgeGroup
): AgeAction {
  const thresholds = AGE_BAND_THRESHOLDS[ageBand];
  if (!thresholds) return 'ALLOW';

  if (revealingScore >= thresholds.block) return 'BLOCK';
  if (revealingScore >= thresholds.gate) return 'GATE';
  return 'ALLOW';
}

/**
 * Get actions for all age bands from a revealing score.
 */
export function getRevealingActionsAllBands(
  revealingScore: number
): Record<AgeGroup, AgeAction> {
  const actions = {} as Record<AgeGroup, AgeAction>;
  for (const ag of AGE_GROUPS) {
    actions[ag] = getRevealingAction(revealingScore, ag);
  }
  return actions;
}

// ============================================================================
// Integration with Vision Signal
// ============================================================================

export interface RevealingScorerResult {
  used: boolean;
  coverageMaps: CoverageMap[];
  maxRevealingScore: number;
  ageActions: Record<AgeGroup, AgeAction>;
}

/**
 * Analyze revealing content across all images from a VisionSignal.
 * Returns per-image coverage maps, max revealing score, and age-band actions.
 *
 * The revealing score only ESCALATES risk - it never reduces it.
 */
export function scoreRevealingContent(
  visionSignal: VisionSignal | null
): RevealingScorerResult {
  if (!visionSignal || !visionSignal.used || visionSignal.perImageActions.length === 0) {
    return {
      used: false,
      coverageMaps: [],
      maxRevealingScore: 0,
      ageActions: { '<10': 'ALLOW', '10-13': 'ALLOW', '13-16': 'ALLOW', '16+': 'ALLOW' },
    };
  }

  const coverageMaps: CoverageMap[] = [];
  let maxScore = 0;

  for (const img of visionSignal.perImageActions) {
    const map = buildCoverageMap(img.imageUrl, img.labels, img.safeSearch);
    coverageMaps.push(map);
    maxScore = Math.max(maxScore, map.overallRevealingScore);
  }

  const ageActions = getRevealingActionsAllBands(maxScore);

  return {
    used: true,
    coverageMaps,
    maxRevealingScore: Math.round(maxScore * 1000) / 1000,
    ageActions,
  };
}
