/**
 * Authentication helper for Stripe Connect API routes.
 *
 * Verifies Firebase auth token, then checks that the authenticated user
 * owns the given Stripe accountId by looking up `stripeAccountId` in Firestore.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { db } from '@/lib/firebase-admin';

export interface ConnectAuthResult {
  userId: string;
  accountId?: string;
}

const UNAUTHORIZED = () =>
  NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });

const FORBIDDEN = () =>
  NextResponse.json({ success: false, error: 'Forbidden: you do not own this account' }, { status: 403 });

/**
 * Verify Firebase auth token from Authorization header.
 * Returns the user's UID or null.
 */
async function verifyToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(token);
    return decoded.uid;
  } catch {
    return null;
  }
}

/**
 * Require authenticated user. Returns 401 response if not authenticated.
 */
export async function requireAuth(
  request: NextRequest
): Promise<ConnectAuthResult | NextResponse> {
  const userId = await verifyToken(request);
  if (!userId) return UNAUTHORIZED();
  return { userId };
}

/**
 * Require authenticated user who owns the given Stripe accountId.
 * Checks Firestore `users/{uid}.stripeAccountId === accountId`.
 * Returns 401 if not authenticated, 403 if user doesn't own the account.
 */
export async function requireAccountOwner(
  request: NextRequest,
  accountId: string
): Promise<ConnectAuthResult | NextResponse> {
  const userId = await verifyToken(request);
  if (!userId) return UNAUTHORIZED();

  if (!db) return UNAUTHORIZED();

  const userDoc = await db.collection('users').doc(userId).get();
  const userData = userDoc.data();

  if (userData?.stripeAccountId !== accountId) {
    return FORBIDDEN();
  }

  return { userId, accountId };
}

/** Type guard: true if the result is an error response */
export function isAuthError(
  result: ConnectAuthResult | NextResponse
): result is NextResponse {
  return result instanceof NextResponse;
}
