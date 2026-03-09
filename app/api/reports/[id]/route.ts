import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

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

// Helper to verify Firebase ID token and extract user ID
async function verifyAuthToken(request: NextRequest): Promise<string | null> {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await getAuth().verifyIdToken(token);
    return decodedToken.uid;
  } catch (error) {
    console.error('Error verifying auth token:', error);
    return null;
  }
}

// GET - Fetch a specific report by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request.headers);
    if (isRateLimited(`report-id-get:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const userId = await verifyAuthToken(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    // Get the report from Firestore
    const reportDoc = await db.collection(COLLECTION).doc(id).get();

    if (!reportDoc.exists) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const report = reportDoc.data() as SavedReport;

    // Verify ownership — return 404 to prevent report ID enumeration
    if (report.uid !== userId) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ report });
  } catch (error) {
    console.error('Error fetching report:', error);
    return NextResponse.json({ error: 'Failed to fetch report' }, { status: 500 });
  }
}

// DELETE - Delete a specific report by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request.headers);
    if (isRateLimited(`report-id-delete:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const userId = await verifyAuthToken(request);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    // Get the report to verify ownership
    const reportDoc = await db.collection(COLLECTION).doc(id).get();

    if (!reportDoc.exists) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const reportData = reportDoc.data();
    if (reportData?.uid !== userId) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    // Delete the report
    await db.collection(COLLECTION).doc(id).delete();

    return NextResponse.json({ success: true, message: 'Report deleted successfully' });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json({ error: 'Failed to delete report' }, { status: 500 });
  }
}
