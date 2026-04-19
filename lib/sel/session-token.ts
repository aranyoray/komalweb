import { randomBytes, createHmac } from 'crypto';

const SECRET = process.env.GEMINI_API_KEY || 'sel-fallback-secret';

export function generateSessionToken(): { token: string; expiresAt: number } {
  const nonce = randomBytes(16).toString('hex');
  const expiresAt = Date.now() + 30 * 60 * 1000; // 30 minutes
  const payload = `${nonce}:${expiresAt}`;
  const sig = createHmac('sha256', SECRET).update(payload).digest('hex');
  return {
    token: `${payload}:${sig}`,
    expiresAt,
  };
}

export function validateSessionToken(token: string): boolean {
  const parts = token.split(':');
  if (parts.length !== 3) return false;
  const [nonce, expiresAtStr, sig] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;
  const expected = createHmac('sha256', SECRET).update(`${nonce}:${expiresAtStr}`).digest('hex');
  return sig === expected;
}
