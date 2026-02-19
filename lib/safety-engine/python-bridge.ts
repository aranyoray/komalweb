// ============================================================================
// Python Hybrid Moderation Service Bridge
// Extracted from app/api/scan-url/route.ts
// ============================================================================

export async function runPythonAnalysis(
  text: string,
  ageGroup: string = '13-16',
  contentId: string = 'api-request'
): Promise<any> {
  const serviceUrl = process.env.MODERATION_SERVICE_URL;

  if (!serviceUrl) {
    console.warn('MODERATION_SERVICE_URL not configured. Skipping Python hybrid analysis.');
    return { _debug: { status: 'skipped', reason: 'URL_NOT_SET' } };
  }

  console.log(`[KOMAL] Calling External Moderation Service at: ${serviceUrl}`);

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    const response = await fetch(`${serviceUrl}/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text || '',
        age_group: ageGroup,
        content_id: contentId
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Moderation service error: ${response.status} ${response.statusText}`);
      return { _debug: { status: 'error', code: response.status, url: serviceUrl } };
    }

    const data = await response.json();
    console.log(`[KOMAL] Python service response: ${data.final_decision?.decision}`);
    return { ...data, _debug: { status: 'success', url: serviceUrl } };
  } catch (error) {
    console.error('Failed to call moderation service:', error);
    return { _debug: { status: 'failed', error: String(error), url: serviceUrl } };
  }
}

/**
 * Map Python category strings to internal category names
 */
export function mapPythonCategory(pythonCategory: string): string {
  const lower = pythonCategory.toLowerCase();
  if (lower.includes('porn') || lower.includes('explicit') || lower.includes('sexual')) return 'explicit';
  if (lower.includes('violence') || lower.includes('disturbing')) return 'violence';
  if (lower.includes('gambling') || lower.includes('betting')) return 'gambling';
  if (lower.includes('drug') || lower.includes('substance')) return 'substances';
  if (lower.includes('hate') || lower.includes('extremist')) return 'hate';
  return 'dangerous';
}
