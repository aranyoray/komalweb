// ============================================================================
// Cloud Fallback (Phase 8)
// When all local signals have low confidence, fall back to heavier GCP models.
// Cloud result is another signal in the merger. Cannot downgrade risk.
// ============================================================================

import { getLanguageClient } from './cloud-apis';
import type { NlpSignal } from './types';

// ============================================================================
// Fallback Trigger
// ============================================================================

/**
 * Determine if cloud fallback should be triggered.
 *
 * Trigger when:
 * - Max confidence across all signals < 0.5
 * - AND no BLOCK action exists in any age band
 */
export function shouldTriggerCloudFallback(
  nlpConfidence: number,
  visionConfidence: number,
  audioConfidence: number,
  hasAnyBlock: boolean
): boolean {
  if (hasAnyBlock) return false;

  const maxConfidence = Math.max(nlpConfidence, visionConfidence, audioConfidence);
  return maxConfidence < 0.5;
}

// ============================================================================
// GCP Text Classification
// ============================================================================

/**
 * Use Google Cloud Natural Language classifyText() as a fallback.
 * Requires text of at least 20 tokens for meaningful classification.
 */
export async function classifyTextWithGcp(
  text: string
): Promise<{ categories: { name: string; confidence: number }[] } | null> {
  const client = getLanguageClient();
  if (!client || !text || text.split(/\s+/).length < 20) return null;

  try {
    const truncated = text.slice(0, 5000);
    const [result] = await Promise.race([
      client.classifyText({
        document: { content: truncated, type: 'PLAIN_TEXT' },
      }),
      new Promise<[null]>((_, reject) =>
        setTimeout(() => reject(new Error('Cloud classify timeout')), 5000)
      ),
    ]);

    if (!result || !result.categories) return null;

    const categories = result.categories
      .filter((c: any) => (c.confidence || 0) > 0.3)
      .map((c: any) => ({
        name: c.name || '',
        confidence: c.confidence || 0,
      }));

    return { categories };
  } catch (error) {
    console.warn('[CloudFallback] classifyText failed:', error);
    return null;
  }
}

// ============================================================================
// Map GCP Categories to Safety Categories
// ============================================================================

const GCP_CATEGORY_MAP: Record<string, string> = {
  // Adult
  '/Adult': 'explicit',
  '/Sensitive Subjects': 'violence',

  // Violence
  '/News/War & Conflicts': 'violence',

  // Gambling
  '/Games/Gambling': 'gambling',

  // Finance
  '/Finance/Investing': 'financial_advice',
  '/Finance/Credit & Lending': 'financial_advice',

  // Health (potential body-anxiety)
  '/Health/Health Conditions/Pain Management': 'substances',
  '/Health/Substance Abuse': 'substances',

  // Shopping
  '/Shopping': 'commercial',

  // Sensitive
  '/Sensitive Subjects/Accidents & Disasters': 'violence',
  '/Sensitive Subjects/War & Conflict': 'violence',
};

/**
 * Map GCP content categories to safety engine categories.
 */
function mapGcpCategory(gcpCategoryPath: string): string | null {
  // Direct match
  if (GCP_CATEGORY_MAP[gcpCategoryPath]) {
    return GCP_CATEGORY_MAP[gcpCategoryPath];
  }

  // Prefix match
  for (const [prefix, category] of Object.entries(GCP_CATEGORY_MAP)) {
    if (gcpCategoryPath.startsWith(prefix)) {
      return category;
    }
  }

  return null;
}

// ============================================================================
// Build Cloud Signal
// ============================================================================

export interface CloudFallbackResult {
  used: boolean;
  confidence: number;
  categories: { category: string; probability: number }[];
  languageSafetyScore: number;
}

/**
 * Run cloud fallback analysis and return signal.
 * This signal CANNOT downgrade risk - it can only maintain or increase it.
 */
export async function runCloudFallback(
  text: string,
  currentNlpSignal?: NlpSignal | null
): Promise<CloudFallbackResult> {
  const gcpResult = await classifyTextWithGcp(text);

  if (!gcpResult || gcpResult.categories.length === 0) {
    return { used: false, confidence: 0, categories: [], languageSafetyScore: 1.0 };
  }

  const safetyCategories: { category: string; probability: number }[] = [];
  let minSafetyScore = 1.0;

  for (const gcpCat of gcpResult.categories) {
    const mapped = mapGcpCategory(gcpCat.name);
    if (mapped) {
      safetyCategories.push({ category: mapped, probability: gcpCat.confidence });
      // Higher confidence in risky category → lower safety score
      minSafetyScore = Math.min(minSafetyScore, 1 - gcpCat.confidence);
    }
  }

  // Cloud signal cannot improve safety beyond current NLP signal
  const currentSafety = currentNlpSignal?.languageSafetyScore ?? 1.0;
  const finalSafetyScore = Math.min(currentSafety, minSafetyScore);

  return {
    used: true,
    confidence: Math.max(...gcpResult.categories.map(c => c.confidence), 0),
    categories: safetyCategories,
    languageSafetyScore: Math.round(finalSafetyScore * 1000) / 1000,
  };
}
