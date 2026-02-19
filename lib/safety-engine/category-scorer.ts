// ============================================================================
// Category Scorer
// Probability-based major category scoring using:
//   - CSV rules engine keywords (direct matches)
//   - TF-IDF keyword vectorization (fuzzy/semantic matches)
//   - Subcategory cluster decision logic
//
// Rules:
//   A. No category >= 0.30 → re-run with focused keyword search
//   B. Single category >= 0.30 → primary category
//   C. Ban-sensitive categories at 0.20 threshold → wider subcategory exploration
// ============================================================================

import type { CsvRule, AgeGroup, AgeAction, NlpSignal } from './types';
import { loadRules } from './rules-engine';
import type { TextBlock, PreprocessedText } from './text-preprocessor';
import {
  loadAndVectorizeKeywords,
  extractWordFrequencies,
  findSimilarKeywords,
  deepContextSearch,
} from '@/lib/keyword-vectorization';

// Ban-sensitive major categories (lower threshold: 0.20)
const BAN_SENSITIVE_CATEGORIES = new Set([
  '1. Violence & Disturbing Content',
  '2. Explicit & Body-Related Content',
]);

// ============================================================================
// Types
// ============================================================================

export interface CategoryScore {
  category: string;
  probability: number;
  matchedKeywords: string[];
  subcategoryScores: SubcategoryScore[];
  primarySubcategory: SubcategoryScore | null;
}

export interface SubcategoryScore {
  subcategory: string;
  majorCategory: string;
  probability: number;
  matchedKeywords: string[];
  ageActions: { [key in AgeGroup]: AgeAction };
}

export interface ScoringResult {
  primaryCategory: CategoryScore | null;
  allCategories: CategoryScore[];
  nlpSignal: NlpSignal;
  ruleApplied: 'A' | 'B' | 'C' | 'none';
}

// ============================================================================
// Keyword Density Scoring
// ============================================================================

/**
 * Score text against CSV rule keywords using direct matching.
 * Returns a map of category -> { matchCount, matchedKeywords }.
 */
function scoreWithDirectMatching(
  text: string,
  rules: CsvRule[]
): Map<string, { matchCount: number; matchedKeywords: string[]; subcategories: Map<string, { matchCount: number; matchedKeywords: string[] }> }> {
  const textLower = text.toLowerCase();
  const categoryMap = new Map<string, {
    matchCount: number;
    matchedKeywords: string[];
    subcategories: Map<string, { matchCount: number; matchedKeywords: string[] }>;
  }>();

  for (const rule of rules) {
    if (!rule.majorCategory || !rule.subcategory) continue;

    let ruleMatchCount = 0;
    const ruleMatchedKeywords: string[] = [];

    // Check subcategory keywords
    for (const kw of rule.keywords) {
      if (!kw || kw.length < 3) continue;
      try {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\b${escaped}`, 'gi');
        const matches = textLower.match(regex);
        if (matches) {
          ruleMatchCount += matches.length;
          ruleMatchedKeywords.push(kw);
        }
      } catch {
        if (textLower.includes(kw)) {
          ruleMatchCount++;
          ruleMatchedKeywords.push(kw);
        }
      }
    }

    // Check contextual keywords (lower weight)
    for (const kw of rule.contextualKeywords) {
      if (!kw || kw.length < 3) continue;
      if (textLower.includes(kw)) {
        ruleMatchCount += 0.5;
        ruleMatchedKeywords.push(`~${kw}`);
      }
    }

    if (ruleMatchCount > 0) {
      if (!categoryMap.has(rule.majorCategory)) {
        categoryMap.set(rule.majorCategory, {
          matchCount: 0,
          matchedKeywords: [],
          subcategories: new Map(),
        });
      }

      const cat = categoryMap.get(rule.majorCategory)!;
      cat.matchCount += ruleMatchCount;
      cat.matchedKeywords.push(...ruleMatchedKeywords);

      cat.subcategories.set(rule.subcategory, {
        matchCount: ruleMatchCount,
        matchedKeywords: ruleMatchedKeywords,
      });
    }
  }

  return categoryMap;
}

// ============================================================================
// TF-IDF Scoring (from keyword-vectorization.ts)
// ============================================================================

/**
 * Score text using TF-IDF vectorization and cosine similarity.
 * Returns category -> probability scores.
 */
function scoreWithTfIdf(
  text: string
): Map<string, { score: number; matchedKeywords: string[] }> {
  const categoryScores = new Map<string, { score: number; matchedKeywords: string[] }>();

  try {
    const categoryKeywords = loadAndVectorizeKeywords();
    if (categoryKeywords.length === 0) return categoryScores;

    const wordFreqs = extractWordFrequencies(text);
    if (wordFreqs.length === 0) return categoryScores;

    const matches = findSimilarKeywords(wordFreqs, categoryKeywords, 100, text);

    // Aggregate matches by category
    for (const match of matches) {
      if (!categoryScores.has(match.category)) {
        categoryScores.set(match.category, { score: 0, matchedKeywords: [] });
      }
      const cat = categoryScores.get(match.category)!;
      cat.score += match.score;
      if (!cat.matchedKeywords.includes(match.keyword)) {
        cat.matchedKeywords.push(match.keyword);
      }
    }

    // Also run deep context search for additional signal
    const contextResults = deepContextSearch(text, categoryKeywords, 50);
    for (const result of contextResults) {
      if (!categoryScores.has(result.category)) {
        categoryScores.set(result.category, { score: 0, matchedKeywords: [] });
      }
      const cat = categoryScores.get(result.category)!;
      cat.score += result.contextMatches.length * 0.5;
      for (const cm of result.contextMatches) {
        if (!cat.matchedKeywords.includes(cm.keyword)) {
          cat.matchedKeywords.push(cm.keyword);
        }
      }
    }
  } catch (error) {
    console.warn('[CategoryScorer] TF-IDF scoring failed:', error);
  }

  return categoryScores;
}

// ============================================================================
// Combined Probability Computation
// ============================================================================

/**
 * Combine direct keyword matches and TF-IDF scores into a probability
 * for each major category (0-1 scale).
 */
function computeCategoryProbabilities(
  directScores: Map<string, { matchCount: number; matchedKeywords: string[]; subcategories: Map<string, { matchCount: number; matchedKeywords: string[] }> }>,
  tfidfScores: Map<string, { score: number; matchedKeywords: string[] }>,
  rules: CsvRule[],
  textLength: number
): CategoryScore[] {
  const allCategories = new Set<string>();
  for (const key of directScores.keys()) allCategories.add(key);
  for (const key of tfidfScores.keys()) {
    // Map TF-IDF category names to CSV major category names
    const mapped = mapTfidfCategoryToMajor(key, rules);
    if (mapped) allCategories.add(mapped);
  }

  const results: CategoryScore[] = [];

  for (const category of allCategories) {
    const direct = directScores.get(category);
    const tfidf = findTfidfScoreForCategory(category, tfidfScores, rules);

    // Compute probability from direct matches
    // Normalize by text length (more matches in shorter text → higher probability)
    const directMatchCount = direct?.matchCount || 0;
    const normalizer = Math.max(textLength / 500, 1); // Normalize for ~500 word document
    const directProbability = Math.min(directMatchCount / (10 * normalizer), 1.0);

    // Compute probability from TF-IDF
    const tfidfScore = tfidf?.score || 0;
    const tfidfProbability = Math.min(tfidfScore / 50, 1.0); // Normalize TF-IDF to 0-1

    // Combined probability: weighted average
    // Direct matches: 0.6 weight, TF-IDF: 0.4 weight
    const combinedProbability = (directProbability * 0.6) + (tfidfProbability * 0.4);

    // Merge matched keywords
    const matchedKeywords = [
      ...(direct?.matchedKeywords || []),
      ...(tfidf?.matchedKeywords || []),
    ].filter((kw, idx, arr) => arr.indexOf(kw) === idx).slice(0, 20);

    // Compute subcategory scores
    const subcategoryScores = computeSubcategoryScores(
      category,
      direct?.subcategories || new Map(),
      rules,
      textLength
    );

    // Pick primary subcategory using cluster decision logic
    const primarySubcategory = pickPrimarySubcategory(subcategoryScores);

    results.push({
      category,
      probability: Math.round(combinedProbability * 1000) / 1000,
      matchedKeywords,
      subcategoryScores,
      primarySubcategory,
    });
  }

  // Sort by probability descending
  results.sort((a, b) => b.probability - a.probability);

  return results;
}

/**
 * Map TF-IDF category name (from Models_Masterdoc.csv) to the major category
 * name used in Models_Masterdoc_Test.csv rules.
 */
function mapTfidfCategoryToMajor(tfidfCategory: string, rules: CsvRule[]): string | null {
  // Direct match
  const directMatch = rules.find(r =>
    r.majorCategory.toLowerCase() === tfidfCategory.toLowerCase()
  );
  if (directMatch) return directMatch.majorCategory;

  // Partial match
  const partialMatch = rules.find(r =>
    r.majorCategory.toLowerCase().includes(tfidfCategory.toLowerCase()) ||
    tfidfCategory.toLowerCase().includes(r.majorCategory.toLowerCase())
  );
  if (partialMatch) return partialMatch.majorCategory;

  return tfidfCategory; // Return as-is
}

/**
 * Find TF-IDF score for a major category, accounting for name differences.
 */
function findTfidfScoreForCategory(
  majorCategory: string,
  tfidfScores: Map<string, { score: number; matchedKeywords: string[] }>,
  rules: CsvRule[]
): { score: number; matchedKeywords: string[] } | null {
  // Direct lookup
  if (tfidfScores.has(majorCategory)) return tfidfScores.get(majorCategory)!;

  // Try partial match
  for (const [key, value] of tfidfScores) {
    if (key.toLowerCase().includes(majorCategory.toLowerCase().split('.')[1]?.trim() || '')) {
      return value;
    }
  }
  return null;
}

// ============================================================================
// Subcategory Scoring & Cluster Decision
// ============================================================================

function computeSubcategoryScores(
  majorCategory: string,
  directSubcategories: Map<string, { matchCount: number; matchedKeywords: string[] }>,
  rules: CsvRule[],
  textLength: number
): SubcategoryScore[] {
  const catRules = rules.filter(r => r.majorCategory === majorCategory);
  const results: SubcategoryScore[] = [];

  for (const rule of catRules) {
    const direct = directSubcategories.get(rule.subcategory);
    const matchCount = direct?.matchCount || 0;
    const normalizer = Math.max(textLength / 500, 1);
    const probability = Math.min(matchCount / (5 * normalizer), 1.0);

    results.push({
      subcategory: rule.subcategory,
      majorCategory: rule.majorCategory,
      probability: Math.round(probability * 1000) / 1000,
      matchedKeywords: direct?.matchedKeywords || [],
      ageActions: rule.ageActions,
    });
  }

  results.sort((a, b) => b.probability - a.probability);
  return results;
}

/**
 * Subcategory cluster decision:
 * - If top 2 subcategories are within +/-10% → pick most restrictive age action
 * - If gap > 10% → pick top scorer
 */
function pickPrimarySubcategory(subcategories: SubcategoryScore[]): SubcategoryScore | null {
  if (subcategories.length === 0) return null;
  if (subcategories.length === 1) return subcategories[0];

  const top = subcategories[0];
  const second = subcategories[1];

  // If no meaningful scores, return top
  if (top.probability === 0) return null;

  // Check if top two are within 10% of each other
  const gap = top.probability - second.probability;
  const threshold = top.probability * 0.10;

  if (gap <= threshold && second.probability > 0) {
    // Tie-breaker: pick the one with most restrictive age action
    const topRestriction = countRestrictions(top.ageActions);
    const secondRestriction = countRestrictions(second.ageActions);
    return secondRestriction > topRestriction ? second : top;
  }

  return top;
}

/**
 * Count how restrictive age actions are (BLOCK=2, GATE=1, ALLOW=0).
 */
function countRestrictions(ageActions: { [key in AgeGroup]: AgeAction }): number {
  let score = 0;
  for (const action of Object.values(ageActions)) {
    if (action === 'BLOCK') score += 2;
    else if (action === 'GATE') score += 1;
  }
  return score;
}

// ============================================================================
// Multi-Block Scoring
// ============================================================================

/**
 * Score each text block and aggregate weighted probabilities.
 */
function scoreTextBlocks(
  preprocessed: PreprocessedText,
  rules: CsvRule[]
): CategoryScore[] {
  // If we have blocks, score each and combine
  if (preprocessed.blocks.length === 0) {
    return [];
  }

  // Aggregate scores across all blocks
  const aggregated = new Map<string, {
    totalWeightedProbability: number;
    totalWeight: number;
    matchedKeywords: string[];
    subcategoryScores: Map<string, SubcategoryScore>;
  }>();

  for (const block of preprocessed.blocks) {
    if (!block.text || block.text.trim().length < 10) continue;

    const directScores = scoreWithDirectMatching(block.text, rules);
    const tfidfScores = scoreWithTfIdf(block.text);
    const blockWordCount = block.text.split(/\s+/).length;

    const blockCategories = computeCategoryProbabilities(
      directScores,
      tfidfScores,
      rules,
      blockWordCount
    );

    for (const cat of blockCategories) {
      if (!aggregated.has(cat.category)) {
        aggregated.set(cat.category, {
          totalWeightedProbability: 0,
          totalWeight: 0,
          matchedKeywords: [],
          subcategoryScores: new Map(),
        });
      }

      const agg = aggregated.get(cat.category)!;
      agg.totalWeightedProbability += cat.probability * block.weight;
      agg.totalWeight += block.weight;
      agg.matchedKeywords.push(...cat.matchedKeywords);

      // Merge subcategory scores (keep highest probability)
      for (const sub of cat.subcategoryScores) {
        const existing = agg.subcategoryScores.get(sub.subcategory);
        if (!existing || sub.probability > existing.probability) {
          agg.subcategoryScores.set(sub.subcategory, sub);
        }
      }
    }
  }

  // Convert aggregated scores to CategoryScore[]
  const results: CategoryScore[] = [];
  for (const [category, agg] of aggregated) {
    const probability = agg.totalWeight > 0
      ? agg.totalWeightedProbability / agg.totalWeight
      : 0;

    const subcategoryScores = Array.from(agg.subcategoryScores.values())
      .sort((a, b) => b.probability - a.probability);

    results.push({
      category,
      probability: Math.round(probability * 1000) / 1000,
      matchedKeywords: [...new Set(agg.matchedKeywords)].slice(0, 20),
      subcategoryScores,
      primarySubcategory: pickPrimarySubcategory(subcategoryScores),
    });
  }

  results.sort((a, b) => b.probability - a.probability);
  return results;
}

// ============================================================================
// Main Entry Point
// ============================================================================

/**
 * Score content against all major categories and return NLP signal.
 *
 * Implements:
 *   Rule A: No category >= 0.30 → re-run with focused keyword search
 *   Rule B: Single category >= 0.30 → primary
 *   Rule C: Ban-sensitive categories at 0.20 threshold → wider subcategory exploration
 */
export function scoreCategories(preprocessed: PreprocessedText): ScoringResult {
  const rules = loadRules();

  if (rules.length === 0 || preprocessed.blocks.length === 0) {
    return {
      primaryCategory: null,
      allCategories: [],
      nlpSignal: buildNlpSignal(null, []),
      ruleApplied: 'none',
    };
  }

  let allCategories = scoreTextBlocks(preprocessed, rules);
  let ruleApplied: 'A' | 'B' | 'C' | 'none' = 'none';

  // Rule C: Check ban-sensitive categories at 0.20 threshold
  const banSensitive = allCategories.find(
    c => BAN_SENSITIVE_CATEGORIES.has(c.category) && c.probability >= 0.20
  );

  if (banSensitive && banSensitive.probability < 0.30) {
    // Wider subcategory exploration for ban-sensitive categories
    ruleApplied = 'C';
    // Already has subcategory scores from the scoring pass
  }

  // Rule B: Single category >= 0.30
  const highConfidence = allCategories.filter(c => c.probability >= 0.30);

  if (highConfidence.length >= 1) {
    ruleApplied = ruleApplied === 'C' ? 'C' : 'B';
    return {
      primaryCategory: highConfidence[0],
      allCategories,
      nlpSignal: buildNlpSignal(highConfidence[0], allCategories),
      ruleApplied,
    };
  }

  // Rule A: No category >= 0.30 → try focused keyword search
  if (allCategories.length > 0 && allCategories[0].probability < 0.30) {
    ruleApplied = 'A';

    // Re-run with just the full text as a single block (focused search)
    const focusedDirect = scoreWithDirectMatching(preprocessed.fullText, rules);
    const focusedTfidf = scoreWithTfIdf(preprocessed.fullText);
    const focusedCategories = computeCategoryProbabilities(
      focusedDirect,
      focusedTfidf,
      rules,
      preprocessed.wordCount
    );

    // Merge: take the higher probability between block-based and focused
    for (const focused of focusedCategories) {
      const existing = allCategories.find(c => c.category === focused.category);
      if (existing) {
        if (focused.probability > existing.probability) {
          existing.probability = focused.probability;
          existing.matchedKeywords = [
            ...new Set([...existing.matchedKeywords, ...focused.matchedKeywords]),
          ].slice(0, 20);
        }
      } else {
        allCategories.push(focused);
      }
    }

    allCategories.sort((a, b) => b.probability - a.probability);
  }

  // Check ban-sensitive again after re-run
  const banSensitiveAfter = allCategories.find(
    c => BAN_SENSITIVE_CATEGORIES.has(c.category) && c.probability >= 0.20
  );

  const primary = allCategories[0]?.probability > 0 ? allCategories[0] : null;

  return {
    primaryCategory: banSensitiveAfter || primary,
    allCategories,
    nlpSignal: buildNlpSignal(banSensitiveAfter || primary, allCategories),
    ruleApplied,
  };
}

// ============================================================================
// Build NLP Signal
// ============================================================================

function buildNlpSignal(
  primary: CategoryScore | null,
  allCategories: CategoryScore[]
): NlpSignal {
  const categories = allCategories
    .filter(c => c.probability > 0.05)
    .slice(0, 10)
    .map(c => ({ category: c.category, probability: c.probability }));

  const subcategories = primary?.subcategoryScores
    .filter(s => s.probability > 0.05)
    .slice(0, 5)
    .map(s => ({ subcategory: s.subcategory, probability: s.probability })) || [];

  const keyTopics = primary?.matchedKeywords.slice(0, 5) || [];

  const confidence = primary ? Math.min(primary.probability * 1.5, 1.0) : 0;
  const languageSafetyScore = primary
    ? Math.max(0, 1 - primary.probability)
    : 1.0;

  return {
    used: categories.length > 0,
    confidence: Math.round(confidence * 1000) / 1000,
    categories,
    subcategories,
    keyTopics,
    sentiment: primary && primary.probability >= 0.30 ? 'Unsafe' : 'Neutral',
    languageSafetyScore: Math.round(languageSafetyScore * 1000) / 1000,
  };
}
