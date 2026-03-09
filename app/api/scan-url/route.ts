import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { analyzeUrl, analyzeKeyword, isValidUrl } from '@/lib/safety-engine';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 scans per minute per IP
    const ip = getClientIp(request.headers);
    if (isRateLimited(`scan-url:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json({ error: 'URL or keyword is required' }, { status: 400 });
    }

    if (url.trim().length > 2048) {
      return NextResponse.json({ error: 'Input too long (max 2048 characters)' }, { status: 400 });
    }

    // Check usage limits for authenticated users
    // Uses atomic transaction: check + pre-increment to prevent race conditions
    let userId: string | null = null;
    let preIncremented = false;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ') && db) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decoded = await getAuth().verifyIdToken(token);
        userId = decoded.uid;

        const userRef = db.collection('users').doc(userId);
        const limitReached = await db.runTransaction(async (tx) => {
          const userDoc = await tx.get(userRef);
          if (!userDoc.exists) return false;
          const userData = userDoc.data();
          const plan = userData?.plan || 'free';
          const reportsUsed = userData?.reportsUsed || 0;
          if (plan === 'free' && reportsUsed >= 5) return true;
          // Atomically increment inside the transaction to prevent TOCTOU races
          tx.update(userRef, { reportsUsed: FieldValue.increment(1) });
          return false;
        });
        preIncremented = !limitReached;

        if (limitReached) {
          return NextResponse.json(
            { error: 'FREE_LIMIT_REACHED' },
            { status: 403 }
          );
        }
      } catch (authError) {
        console.log('[scan-url] Auth verification failed, proceeding without usage tracking');
      }
    }

    const input = url.trim();

    let result;
    try {
      if (isValidUrl(input)) {
        result = await analyzeUrl(input, userId);
      } else {
        result = await analyzeKeyword(input, userId);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      // Rollback the pre-incremented counter on failure
      if (preIncremented && userId && db) {
        try {
          await db.collection('users').doc(userId).update({
            reportsUsed: FieldValue.increment(-1),
          });
        } catch { /* best effort rollback */ }
      }
      if (error instanceof Error && error.message === 'ANALYSIS_FAILED') {
        return NextResponse.json({
          error: 'The entered link could not be analyzed. Please re-check the URL and try again.'
        }, { status: 400 });
      }
      return NextResponse.json({ error: 'Failed to analyze. Please try again.' }, { status: 500 });
    }

    // Strip internal debug data before returning to client
    if (result && typeof result === 'object') {
      delete (result as unknown as Record<string, unknown>).pythonDebug;
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in scan endpoint:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
