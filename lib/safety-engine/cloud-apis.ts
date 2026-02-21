// ============================================================================
// Google Cloud API Wrappers (Vision & Language)
// Extracted from app/api/scan-url/route.ts
// ============================================================================

import { ImageAnnotatorClient } from '@google-cloud/vision';
import { LanguageServiceClient } from '@google-cloud/language';
import type { protos } from '@google-cloud/vision';

// ============================================================================
// Lazy-loaded clients
// ============================================================================

let visionClient: ImageAnnotatorClient | null = null;
let languageClient: LanguageServiceClient | null = null;
let clientsInitialized = false;

export function initializeClients() {
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

export function getVisionClient(): ImageAnnotatorClient | null {
  return visionClient;
}

export function getLanguageClient(): LanguageServiceClient | null {
  return languageClient;
}

// ============================================================================
// Likelihood score conversion
// ============================================================================

export function getLikelihoodScore(
  likelihood: protos.google.cloud.vision.v1.Likelihood | string | null | undefined
): number {
  if (typeof likelihood === 'number') {
    switch (likelihood) {
      case 5: return 4;
      case 4: return 3;
      case 3: return 2;
      case 2: return 1;
      case 1: return 0;
      default: return 0;
    }
  }

  switch (likelihood) {
    case 'VERY_UNLIKELY': case '0': return 0;
    case 'UNLIKELY': case '1': return 1;
    case 'POSSIBLE': case '2': return 2;
    case 'LIKELY': case '3': return 3;
    case 'VERY_LIKELY': case '4': return 4;
    default: return 0;
  }
}

// ============================================================================
// Vision API - Single image analysis
// ============================================================================

export async function analyzeImageUrlFast(imageUrl: string): Promise<any> {
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
// Vision API - Multiple images (max 2, 1.5s timeout each)
// ============================================================================

export async function analyzeImagesWithVisionFast(imageUrls: string[]) {
  if (!visionClient || imageUrls.length === 0) {
    return null;
  }

  try {
    const results = {
      labels: [] as string[],
      safeSearchAnnotation: null as any,
      detectedObjects: [] as string[],
    };

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

// ============================================================================
// NLP - Text sentiment analysis
// ============================================================================

export async function analyzeTextFast(text: string): Promise<{ sentiment: string; entities: string[] } | null> {
  if (!languageClient || !text) return null;

  try {
    const truncated = text.slice(0, 1500);
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
