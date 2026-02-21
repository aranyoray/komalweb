// ============================================================================
// Body Region Types (Phase 11)
// 15 body regions with 6 revealing levels for coverage detection.
// ============================================================================

// ============================================================================
// Body Regions
// ============================================================================

export type BodyRegion =
  | 'face'
  | 'neck'
  | 'shoulders'
  | 'upper_chest'
  | 'lower_chest'
  | 'upper_abdomen'
  | 'lower_abdomen'
  | 'upper_back'
  | 'lower_back'
  | 'upper_arm'
  | 'forearm'
  | 'upper_thigh'
  | 'lower_thigh'
  | 'buttocks'
  | 'groin';

// ============================================================================
// Revealing Levels (ordered from least to most revealing)
// ============================================================================

export type RevealingLevel =
  | 'fully_covered'       // 0 - Normal clothing, no skin
  | 'partially_covered'   // 1 - Some skin showing (short sleeves, v-neck)
  | 'form_fitting'        // 2 - Tight clothing revealing body shape
  | 'minimal_coverage'    // 3 - Swimwear, crop tops, short shorts
  | 'near_exposure'       // 4 - Very revealing, near-nudity
  | 'explicit_exposure';  // 5 - Full nudity or explicit exposure

/**
 * Numeric value for each revealing level.
 * Used for score computation.
 */
export const REVEALING_LEVEL_VALUES: Record<RevealingLevel, number> = {
  fully_covered: 0,
  partially_covered: 0.1,
  form_fitting: 0.25,
  minimal_coverage: 0.5,
  near_exposure: 0.8,
  explicit_exposure: 1.0,
};

// ============================================================================
// Coverage Map
// ============================================================================

export interface RegionCoverage {
  region: BodyRegion;
  level: RevealingLevel;
  confidence: number;  // 0-1
}

export interface CoverageMap {
  imageUrl: string;
  regions: RegionCoverage[];
  overallRevealingScore: number;  // 0-1
}

// ============================================================================
// Region Sensitivity Weights
// ============================================================================

/**
 * Weight multiplier for each body region when computing the overall score.
 * Sensitive regions (groin, buttocks, chest) have higher weights.
 */
export const REGION_WEIGHTS: Record<BodyRegion, number> = {
  face: 0.2,
  neck: 0.3,
  shoulders: 0.4,
  upper_chest: 0.8,
  lower_chest: 0.9,
  upper_abdomen: 0.6,
  lower_abdomen: 0.7,
  upper_back: 0.3,
  lower_back: 0.5,
  upper_arm: 0.2,
  forearm: 0.1,
  upper_thigh: 0.7,
  lower_thigh: 0.3,
  buttocks: 1.0,
  groin: 1.0,
};

// ============================================================================
// Age-Band Thresholds
// ============================================================================

/**
 * For each age band, the revealing score thresholds for GATE and BLOCK.
 * - below10: very restrictive
 * - 10_13: restrictive
 * - 13_16: moderate
 * - 16_18: permissive
 */
export const AGE_BAND_THRESHOLDS: Record<string, { gate: number; block: number }> = {
  '<10':   { gate: 0.15, block: 0.30 },
  '10-13': { gate: 0.25, block: 0.45 },
  '13-16': { gate: 0.40, block: 0.60 },
  '16+':   { gate: 0.70, block: 0.85 },
};
