// ============================================================================
// Audio Analyzer (Phase 5)
// Extracts audio/video URLs from HTML, performs speech-to-text,
// runs NLP on transcription, and produces AudioSignal.
// ============================================================================

import type { AudioSignal } from './types';
import type { ScoringResult } from './category-scorer';

// ============================================================================
// Audio URL Extraction
// ============================================================================

export interface ExtractedAudioSource {
  url: string;
  type: 'audio' | 'video' | 'embed';
  platform?: string;
}

/**
 * Extract audio/video source URLs from parsed HTML.
 * Looks at <audio>, <video>, and iframe embed URLs.
 */
export function extractAudioSources(
  html: string,
  $?: any // cheerio instance
): ExtractedAudioSource[] {
  const sources: ExtractedAudioSource[] = [];

  if (!$ || !html) return sources;

  // <audio> elements
  $('audio source, audio[src]').each((_: number, el: any) => {
    const src = $(el).attr('src');
    if (src) {
      sources.push({ url: src, type: 'audio' });
    }
  });

  // <video> elements
  $('video source, video[src]').each((_: number, el: any) => {
    const src = $(el).attr('src');
    if (src) {
      sources.push({ url: src, type: 'video' });
    }
  });

  // iframe embeds (YouTube, Vimeo, etc.)
  $('iframe').each((_: number, el: any) => {
    const src = $(el).attr('src') || '';
    if (src.includes('youtube') || src.includes('youtu.be')) {
      sources.push({ url: src, type: 'embed', platform: 'youtube' });
    } else if (src.includes('vimeo')) {
      sources.push({ url: src, type: 'embed', platform: 'vimeo' });
    } else if (src.includes('soundcloud')) {
      sources.push({ url: src, type: 'embed', platform: 'soundcloud' });
    } else if (src.includes('spotify')) {
      sources.push({ url: src, type: 'embed', platform: 'spotify' });
    } else if (src.includes('tiktok')) {
      sources.push({ url: src, type: 'embed', platform: 'tiktok' });
    }
  });

  return sources.slice(0, 5); // Limit to 5 sources
}

// ============================================================================
// Speech-to-Text (Stub - requires Google Cloud Speech API or similar)
// ============================================================================

/**
 * Transcribe audio content using speech-to-text.
 * Currently a stub that returns null - requires Google Cloud Speech-to-Text
 * or Video Intelligence API to be configured.
 *
 * When implemented, this will:
 * 1. Download first 30 seconds of audio
 * 2. Send to Speech-to-Text API with 10s timeout
 * 3. Return transcription text
 */
export async function transcribeAudio(
  _audioUrl: string,
  _timeoutMs: number = 10000
): Promise<string | null> {
  // TODO: Implement when Google Cloud Speech-to-Text is configured
  // const speechClient = new SpeechClient({ apiKey: process.env.GOOGLE_CLOUD_API_KEY });
  // const [response] = await speechClient.recognize({ ... });
  // return response.results?.map(r => r.alternatives?.[0]?.transcript).join(' ') || null;
  return null;
}

// ============================================================================
// Short-Circuit Check
// ============================================================================

/**
 * Determine if audio analysis should be skipped.
 * Skip when NLP + Vision already returned ban-sensitive category with P >= 0.80.
 */
export function shouldSkipAudio(
  nlpConfidence: number,
  visionConfidence: number,
  hasBanSensitiveBlock: boolean
): boolean {
  // If we already have high-confidence BLOCK from NLP + Vision, skip audio
  if (hasBanSensitiveBlock && (nlpConfidence >= 0.80 || visionConfidence >= 0.80)) {
    return true;
  }

  // If combined confidence is very high, skip
  if (nlpConfidence + visionConfidence >= 1.5 && hasBanSensitiveBlock) {
    return true;
  }

  return false;
}

// ============================================================================
// Audio Signal Builder
// ============================================================================

/**
 * Build an AudioSignal from transcription analysis.
 */
function buildAudioSignal(
  used: boolean,
  confidence: number,
  categories: { category: string; probability: number }[],
  audioSafetyScore: number,
  toneAnalysis?: string
): AudioSignal {
  return {
    used,
    confidence: Math.round(confidence * 1000) / 1000,
    categories,
    toneAnalysis,
    audioSafetyScore: Math.round(audioSafetyScore * 1000) / 1000,
  };
}

// ============================================================================
// Main Audio Analysis
// ============================================================================

/**
 * Analyze audio content from a page.
 *
 * Steps:
 * 1. Check if audio analysis should be skipped (short-circuit)
 * 2. Extract audio sources from HTML
 * 3. Transcribe first audio source (first 30s, 10s timeout)
 * 4. Run NLP category scoring on transcription
 * 5. Build and return AudioSignal
 */
export async function analyzeAudio(
  audioSources: ExtractedAudioSource[],
  nlpConfidence: number,
  visionConfidence: number,
  hasBanSensitiveBlock: boolean,
  categoryScorerFn?: (text: string) => ScoringResult | null
): Promise<AudioSignal> {
  // Short-circuit check
  if (shouldSkipAudio(nlpConfidence, visionConfidence, hasBanSensitiveBlock)) {
    return buildAudioSignal(false, 0, [], 1.0, 'Skipped: high-confidence decision from NLP/Vision');
  }

  if (audioSources.length === 0) {
    return buildAudioSignal(false, 0, [], 1.0);
  }

  // Try to transcribe the first audio source
  const transcription = await transcribeAudio(audioSources[0].url);

  if (!transcription) {
    // Cannot transcribe - return neutral signal based on platform detection
    const hasTikTok = audioSources.some(s => s.platform === 'tiktok');
    const hasUnknown = audioSources.some(s => !s.platform);

    let safetyScore = 1.0;
    const categories: { category: string; probability: number }[] = [];

    if (hasTikTok) {
      safetyScore = 0.7;
      categories.push({ category: 'short_form_video', probability: 0.3 });
    }
    if (hasUnknown) {
      safetyScore = Math.min(safetyScore, 0.8);
    }

    return buildAudioSignal(
      audioSources.length > 0,
      0.2,
      categories,
      safetyScore,
      'No transcription available'
    );
  }

  // Run NLP on transcription using the provided scorer
  let categories: { category: string; probability: number }[] = [];
  let audioSafetyScore = 1.0;
  let confidence = 0.5;

  if (categoryScorerFn) {
    const scoringResult = categoryScorerFn(transcription);
    if (scoringResult) {
      categories = scoringResult.nlpSignal.categories;
      audioSafetyScore = scoringResult.nlpSignal.languageSafetyScore;
      confidence = scoringResult.nlpSignal.confidence;
    }
  }

  // Determine tone from transcription patterns
  let toneAnalysis = 'neutral';
  const lowerTranscript = transcription.toLowerCase();
  if (/scream|yell|shout|angry|furious/i.test(lowerTranscript)) toneAnalysis = 'aggressive';
  else if (/cry|sob|sad|depress|lonely/i.test(lowerTranscript)) toneAnalysis = 'distressed';
  else if (/laugh|happy|fun|awesome|great/i.test(lowerTranscript)) toneAnalysis = 'positive';
  else if (/whisper|secret|don't tell|private/i.test(lowerTranscript)) toneAnalysis = 'secretive';

  return buildAudioSignal(true, confidence, categories, audioSafetyScore, toneAnalysis);
}
