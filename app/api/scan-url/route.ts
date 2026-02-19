import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { FieldValue } from 'firebase-admin/firestore';
import { analyzeUrl, analyzeKeyword, isValidUrl } from '@/lib/safety-engine';

// ============================================================================
// API ROUTE HANDLER
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url } = body;

    if (!url || typeof url !== 'string' || url.trim().length === 0) {
      return NextResponse.json({ error: 'URL or keyword is required' }, { status: 400 });
    }

    // Check usage limits for authenticated users
    let userId: string | null = null;
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer ') && db) {
      const token = authHeader.split('Bearer ')[1];
      try {
        const decoded = await getAuth().verifyIdToken(token);
        userId = decoded.uid;

        const userDoc = await db.collection('users').doc(userId).get();
        if (userDoc.exists) {
          const userData = userDoc.data();
          const plan = userData?.plan || 'free';
          const reportsUsed = userData?.reportsUsed || 0;

          if (plan === 'free' && reportsUsed >= 5) {
            return NextResponse.json(
              { error: 'FREE_LIMIT_REACHED' },
              { status: 403 }
            );
          }
        }
      } catch (authError) {
        console.log('[scan-url] Auth verification failed, proceeding without usage tracking');
      }
    }

    const input = url.trim();

    let result;
    if (isValidUrl(input)) {
      try {
        result = await analyzeUrl(input, userId);
      } catch (error) {
        console.error('URL analysis failed:', error);
        if (error instanceof Error && error.message === 'ANALYSIS_FAILED') {
          return NextResponse.json({
            error: 'The entered link could not be analyzed. Please re-check the URL and try again.'
          }, { status: 400 });
        }
        return NextResponse.json({ error: 'Failed to analyze URL' }, { status: 500 });
      }
    } else {
      console.log(`[KOMAL] Input "${input}" is not a URL, treating as keyword search`);
      try {
        result = await analyzeKeyword(input, userId);
      } catch (error) {
        console.error('Keyword analysis failed:', error);
        return NextResponse.json({
          error: 'Failed to analyze the keyword. Please try again.'
        }, { status: 500 });
      }
    }

    // Increment reportsUsed for authenticated users after successful scan
    if (userId && db) {
      try {
        await db.collection('users').doc(userId).update({
          reportsUsed: FieldValue.increment(1),
        });
      } catch (incError) {
        console.error('[scan-url] Failed to increment reportsUsed:', incError);
      }
    }

    // Debug: log new SafetyReport fields
    console.log('[scan-url] SafetyReport fields present:', {
      hasOverallSafetyScore: result.overallsafetyscore !== undefined,
      overallsafetyscore: result.overallsafetyscore,
      hasAgeActions: !!result.ageActions,
      hasDecisionSource: !!result.decisionSource,
      hasMajorCategories: !!result.majorCategories,
      majorCategoriesCount: result.majorCategories?.length,
      contextType: result.contextType,
      topicTagsCount: result.topicTags?.length,
      flags: result.flags,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in scan endpoint:', error);
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 });
  }
}
