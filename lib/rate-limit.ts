/**
 * Simple in-memory rate limiter for API routes.
 * Uses a sliding window approach with automatic cleanup.
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries every 5 minutes (unref to allow clean process exit)
const cleanupInterval = setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store) {
    if (now > entry.resetAt) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);
if (typeof cleanupInterval.unref === 'function') cleanupInterval.unref();

/**
 * Check if a request is rate limited.
 * @param key - Unique identifier (e.g., IP + route)
 * @param limit - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds
 * @returns true if the request should be blocked
 */
export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return false;
  }

  entry.count++;
  return entry.count > limit;
}

/**
 * Get client IP from request headers.
 *
 * Priority:
 * 1. x-vercel-forwarded-for — set by Vercel infrastructure, cannot be spoofed by clients
 * 2. x-forwarded-for (rightmost non-private IP) — standard proxy header
 * 3. x-real-ip — fallback
 * 4. 'unknown' — last resort (all unknowns share one bucket)
 */
export function getClientIp(headers: Headers): string {
  // Vercel sets this header from the actual connection; it cannot be spoofed
  const vercelIp = headers.get('x-vercel-forwarded-for')?.split(',')[0]?.trim();
  if (vercelIp) return vercelIp;

  // For x-forwarded-for, take the RIGHTMOST entry (closest to our server)
  // which is the one appended by our own trusted reverse proxy.
  // The leftmost entry can be set by the client and is untrustworthy.
  const xff = headers.get('x-forwarded-for');
  if (xff) {
    const parts = xff.split(',').map(s => s.trim()).filter(Boolean);
    // Rightmost is most trustworthy (appended by last proxy before us)
    if (parts.length > 0) return parts[parts.length - 1];
  }

  return headers.get('x-real-ip') || 'unknown';
}
