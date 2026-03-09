/**
 * Validates redirect paths to prevent open redirect attacks.
 * Only allows relative paths starting with "/" that don't redirect off-site.
 */
export function safePath(path: unknown, fallback: string): string {
  if (typeof path !== 'string') return fallback;

  const trimmed = path.trim();

  // Reject excessively long paths
  if (trimmed.length > 2048) return fallback;

  // Must start with exactly one slash (block protocol-relative "//evil.com")
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return fallback;

  // Block backslash tricks ("\/evil.com" which some browsers treat as "//evil.com")
  if (trimmed.includes('\\')) return fallback;

  // Block @ in path (can be used for credential-based redirects)
  if (trimmed.includes('@')) return fallback;

  // Block colons (protocol-like patterns e.g. /javascript:, /data:)
  if (trimmed.includes(':')) return fallback;

  // Block carriage return / newline / null bytes / control characters
  if (/[\r\n\0\x01-\x1f]/.test(trimmed)) return fallback;

  // Block URL-encoded bypass attempts (%2f%2f → //, %5c → \, %40 → @, %3a → :)
  try {
    const decoded = decodeURIComponent(trimmed);
    if (decoded !== trimmed) {
      // Re-validate the decoded form
      if (decoded.startsWith('//') || decoded.includes('\\') || decoded.includes('@') || decoded.includes(':')) {
        return fallback;
      }
    }
  } catch {
    return fallback; // malformed percent-encoding
  }

  return trimmed;
}
