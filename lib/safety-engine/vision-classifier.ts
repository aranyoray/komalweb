// ============================================================================
// Vision Classifier (Phase 4)
// Per-image BLOCK/GATE/ALLOW with rendering behavior.
// Analyzes up to 5 images. Maps Vision API labels to categories.
// ============================================================================

import { AGE_GROUPS } from './types';
import type { AgeGroup, AgeAction, RenderBehavior, VisionSignal } from './types';
import { getVisionClient, getLikelihoodScore } from './cloud-apis';

// ============================================================================
// Label-to-Category Mapping
// ============================================================================

const LABEL_CATEGORY_MAP: Record<string, string> = {
  // Violence
  'weapon': 'violence', 'gun': 'violence', 'firearm': 'violence', 'rifle': 'violence',
  'knife': 'violence', 'sword': 'violence', 'blood': 'violence', 'injury': 'violence',
  'fight': 'violence', 'explosion': 'violence', 'military': 'violence', 'tank': 'violence',

  // Explicit
  'nudity': 'explicit', 'lingerie': 'explicit', 'underwear': 'explicit',
  'swimwear': 'explicit', 'bikini': 'explicit',

  // Substances
  'alcohol': 'substances', 'beer': 'substances', 'wine': 'substances',
  'cocktail': 'substances', 'cigarette': 'substances', 'smoking': 'substances',
  'drug': 'substances', 'pill': 'substances', 'syringe': 'substances',

  // Gambling
  'casino': 'gambling', 'poker': 'gambling', 'dice': 'gambling',
  'slot machine': 'gambling', 'roulette': 'gambling', 'cards': 'gambling',

  // Horror
  'skull': 'horror', 'skeleton': 'horror', 'monster': 'horror',
  'ghost': 'horror', 'zombie': 'horror', 'darkness': 'horror',
};

// Categories that are ban-sensitive (lower thresholds)
const BAN_SENSITIVE_VISUAL = new Set(['explicit', 'violence']);

// ============================================================================
// Per-Image Action Determination
// ============================================================================

interface PerImageResult {
  imageUrl: string;
  action: AgeAction;
  renderBehavior: RenderBehavior;
  labels: string[];
  safeSearch: {
    adult: number;
    violence: number;
    racy: number;
  };
  categories: string[];
  confidence: number;
}

function determineImageAction(
  safeSearch: { adult: number; violence: number; racy: number },
  labels: string[]
): { action: AgeAction; renderBehavior: RenderBehavior; confidence: number } {
  // Check safe search annotations
  if (safeSearch.adult >= 3 || safeSearch.violence >= 3) {
    return { action: 'BLOCK', renderBehavior: 'placeholder', confidence: 0.9 };
  }

  if (safeSearch.adult >= 2 || safeSearch.violence >= 2 || safeSearch.racy >= 3) {
    return { action: 'GATE', renderBehavior: 'blur_tap_to_view', confidence: 0.7 };
  }

  // Check labels for concerning content
  const mappedCategories = labels
    .map(l => LABEL_CATEGORY_MAP[l.toLowerCase()])
    .filter(Boolean);

  if (mappedCategories.some(c => BAN_SENSITIVE_VISUAL.has(c))) {
    return { action: 'GATE', renderBehavior: 'blur_tap_to_view', confidence: 0.6 };
  }

  if (safeSearch.racy >= 2) {
    return { action: 'GATE', renderBehavior: 'blur_tap_to_view', confidence: 0.5 };
  }

  return { action: 'ALLOW', renderBehavior: 'show', confidence: 0.8 };
}

// ============================================================================
// Main Vision Classification
// ============================================================================

/**
 * Classify up to 5 images and produce a VisionSignal.
 * Each image gets a per-image action and render behavior.
 * The overall signal uses worst-case aggregation.
 */
export async function classifyImages(imageUrls: string[]): Promise<VisionSignal> {
  const client = getVisionClient();

  if (!client || imageUrls.length === 0) {
    return {
      used: false,
      confidence: 0,
      perImageActions: [],
      visualSafetyScore: 1.0,
      labels: [],
    };
  }

  const urls = imageUrls.slice(0, 5); // Max 5 images
  const perImageResults: PerImageResult[] = [];
  const allLabels: string[] = [];

  // Analyze each image with timeout
  const imagePromises = urls.map(async (imageUrl): Promise<PerImageResult | null> => {
    try {
      const [result] = await Promise.race([
        client.annotateImage({
          image: { source: { imageUri: imageUrl } },
          features: [
            { type: 'SAFE_SEARCH_DETECTION' },
            { type: 'LABEL_DETECTION', maxResults: 10 },
            { type: 'OBJECT_LOCALIZATION', maxResults: 5 },
          ],
        }),
        new Promise<[null]>((_, reject) =>
          setTimeout(() => reject(new Error('Vision timeout')), 3000)
        ),
      ]);

      if (!result) return null;

      const safeSearch = {
        adult: getLikelihoodScore(result.safeSearchAnnotation?.adult),
        violence: getLikelihoodScore(result.safeSearchAnnotation?.violence),
        racy: getLikelihoodScore(result.safeSearchAnnotation?.racy),
      };

      const labels = (result.labelAnnotations || [])
        .filter((l: any) => (l.score || 0) > 0.6)
        .map((l: any) => l.description || '');

      const objects = (result.localizedObjectAnnotations || [])
        .map((o: any) => o.name || '');

      const combinedLabels = [...new Set([...labels, ...objects])];

      const categories = combinedLabels
        .map(l => LABEL_CATEGORY_MAP[l.toLowerCase()])
        .filter(Boolean);

      const { action, renderBehavior, confidence } = determineImageAction(safeSearch, combinedLabels);

      return {
        imageUrl,
        action,
        renderBehavior,
        labels: combinedLabels,
        safeSearch,
        categories: [...new Set(categories)],
        confidence,
      };
    } catch {
      return null;
    }
  });

  const results = await Promise.all(imagePromises);

  for (const result of results) {
    if (result) {
      perImageResults.push(result);
      allLabels.push(...result.labels);
    }
  }

  if (perImageResults.length === 0) {
    return {
      used: false,
      confidence: 0,
      perImageActions: [],
      visualSafetyScore: 1.0,
      labels: [],
    };
  }

  // Worst-case aggregation across all images
  const worstAction = perImageResults.reduce<AgeAction>(
    (worst, img) => {
      const severity = { ALLOW: 0, GATE: 1, BLOCK: 2 };
      return severity[img.action] > severity[worst] ? img.action : worst;
    },
    'ALLOW'
  );

  // Compute visual safety score (0-1, lower = more dangerous)
  let visualSafetyScore = 1.0;
  for (const img of perImageResults) {
    if (img.action === 'BLOCK') visualSafetyScore -= 0.4;
    else if (img.action === 'GATE') visualSafetyScore -= 0.2;

    // Additional penalty from safe search
    if (img.safeSearch.adult >= 3) visualSafetyScore -= 0.3;
    if (img.safeSearch.violence >= 3) visualSafetyScore -= 0.2;
    if (img.safeSearch.racy >= 3) visualSafetyScore -= 0.1;
  }
  visualSafetyScore = Math.max(0, Math.min(1, visualSafetyScore));

  const avgConfidence = perImageResults.reduce((sum, r) => sum + r.confidence, 0) / perImageResults.length;

  return {
    used: true,
    confidence: Math.round(avgConfidence * 1000) / 1000,
    perImageActions: perImageResults.map(r => ({
      imageUrl: r.imageUrl,
      action: r.action,
      renderBehavior: r.renderBehavior,
      labels: r.labels,
      safeSearch: r.safeSearch,
    })),
    visualSafetyScore: Math.round(visualSafetyScore * 1000) / 1000,
    labels: [...new Set(allLabels)].slice(0, 15),
  };
}

/**
 * Map detected labels to major categories from the CSV.
 * Returns a list of categories found in the images.
 */
export function mapLabelsToCategories(labels: string[]): string[] {
  const categories = new Set<string>();
  for (const label of labels) {
    const cat = LABEL_CATEGORY_MAP[label.toLowerCase()];
    if (cat) categories.add(cat);
  }
  return [...categories];
}
