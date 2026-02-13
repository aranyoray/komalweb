import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

const COLLECTION = 'report-history';

interface SavedReport {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  url: string;
  overallScore: number;
  overallRisk: string;
  timestamp: string;
  title?: string;
  fullReport: Record<string, unknown>;
}

type AuthResult =
  | { success: true; user: { uid: string; email: string; name: string } }
  | { success: false; reason: string };

// Helper to verify Firebase ID token and extract user info
async function verifyAuthToken(request: NextRequest): Promise<AuthResult> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const reason = 'Missing or malformed Authorization header';
    console.error('[reports] Auth failed:', reason);
    return { success: false, reason };
  }

  const token = authHeader.split('Bearer ')[1];

  if (!token || token.length < 10) {
    const reason = 'Token is empty or too short';
    console.error('[reports] Auth failed:', reason);
    return { success: false, reason };
  }

  // Check if Firebase Admin SDK is initialized
  if (!db) {
    const reason = 'Firebase Admin SDK not initialized - check FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY env vars in Vercel';
    console.error('[reports] Auth failed:', reason);
    return { success: false, reason };
  }

  // Log token format for debugging
  const tokenParts = token.split('.');
  // Decode JWT payload to check audience/issuer
  let tokenPayload: any = {};
  try {
    tokenPayload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
  } catch { /* ignore */ }

  console.log('[reports] Token debug:', {
    tokenLength: token.length,
    jwtParts: tokenParts.length,
    tokenAud: tokenPayload.aud,
    tokenIss: tokenPayload.iss,
    serverProjectId: process.env.FIREBASE_PROJECT_ID,
    projectIdMatch: tokenPayload.aud === process.env.FIREBASE_PROJECT_ID,
  });

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    // Fetch full user record for display name
    const userRecord = await getAuth().getUser(decodedToken.uid);
    return {
      success: true,
      user: {
        uid: decodedToken.uid,
        email: userRecord.email || decodedToken.email || '',
        name: userRecord.displayName || decodedToken.name || '',
      },
    };
  } catch (error: any) {
    const reason = `verifyIdToken error: ${error?.code || error?.message || 'unknown'} - ${error?.stack?.split('\n')[1]?.trim() || ''}`;
    console.error('[reports] Auth failed:', reason);
    return { success: false, reason };
  }
}

// GET - Fetch all reports for the authenticated user
export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuthToken(request);

    if (!auth.success) {
      return NextResponse.json({ error: 'Unauthorized', reason: auth.reason }, { status: 401 });
    }

    const userInfo = auth.user;

    // Query report-history collection for this user
    const reportsSnapshot = await db
      .collection(COLLECTION)
      .where('uid', '==', userInfo.uid)
      .limit(100)
      .get();

    const reports: SavedReport[] = [];
    reportsSnapshot.forEach((doc) => {
      reports.push(doc.data() as SavedReport);
    });

    // Sort by timestamp descending (client-side to avoid composite index requirement)
    reports.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json({ reports });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json({ error: 'Failed to fetch reports' }, { status: 500 });
  }
}

// POST - Save a new report for the authenticated user
export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuthToken(request);

    if (!auth.success) {
      return NextResponse.json({ error: 'Unauthorized', reason: auth.reason }, { status: 401 });
    }

    const userInfo = auth.user;

    const body = await request.json();
    const { report } = body;

    if (!report) {
      return NextResponse.json({ error: 'Report is required' }, { status: 400 });
    }

    // Generate unique report ID
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create saved report object with user data
    const savedReport: SavedReport = {
      id: reportId,
      uid: userInfo.uid,
      userName: userInfo.name,
      userEmail: userInfo.email,
      url: report.url,
      overallScore: report.overallScore,
      overallRisk: report.childSafetyAnalysis?.overallRisk || 'unknown',
      timestamp: report.timestamp || new Date().toISOString(),
      title: report.contentAnalysis?.metadata?.title || report.url,
      fullReport: report,
    };

    // Save to Firestore report-history collection
    await db.collection(COLLECTION).doc(reportId).set(savedReport);

    return NextResponse.json({
      success: true,
      report: savedReport,
      message: 'Report saved successfully'
    });
  } catch (error) {
    console.error('Error saving report:', error);
    return NextResponse.json({ error: 'Failed to save report' }, { status: 500 });
  }
}

// DELETE - Delete a specific report
export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAuthToken(request);

    if (!auth.success) {
      return NextResponse.json({ error: 'Unauthorized', reason: auth.reason }, { status: 401 });
    }

    const userInfo = auth.user;

    const { searchParams } = new URL(request.url);
    const reportId = searchParams.get('id');

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    // Get the report to verify ownership
    const reportDoc = await db.collection(COLLECTION).doc(reportId).get();

    if (!reportDoc.exists) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const reportData = reportDoc.data();
    if (reportData?.uid !== userInfo.uid) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    // Delete the report
    await db.collection(COLLECTION).doc(reportId).delete();

    return NextResponse.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
