import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getParentChildren, addChild, ageToAgeBand } from '@/lib/safety-engine/parent-controls';

// ============================================================================
// Auth helper
// ============================================================================

async function verifyAuth(request: NextRequest): Promise<{ uid: string } | null> {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ') || !db) return null;

  try {
    const token = authHeader.split('Bearer ')[1];
    const decoded = await getAuth().verifyIdToken(token);
    return { uid: decoded.uid };
  } catch {
    return null;
  }
}

// ============================================================================
// GET /api/parent-controls/children
// List all children for the authenticated parent
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const children = await getParentChildren(auth.uid);
    return NextResponse.json({ children });
  } catch (error) {
    console.error('[parent-controls/children] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch children' }, { status: 500 });
  }
}

// ============================================================================
// POST /api/parent-controls/children
// Add a new child profile
// Body: { name, age, blockedUrls?, blockedKeywords?, allowedUrls? }
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, age, blockedUrls, blockedKeywords, allowedUrls } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Child name is required' }, { status: 400 });
    }

    if (age === undefined || typeof age !== 'number' || age < 0 || age > 18) {
      return NextResponse.json({ error: 'Valid age (0-18) is required' }, { status: 400 });
    }

    // Validate arrays
    if (blockedUrls && !Array.isArray(blockedUrls)) {
      return NextResponse.json({ error: 'blockedUrls must be an array' }, { status: 400 });
    }
    if (blockedKeywords && !Array.isArray(blockedKeywords)) {
      return NextResponse.json({ error: 'blockedKeywords must be an array' }, { status: 400 });
    }
    if (allowedUrls && !Array.isArray(allowedUrls)) {
      return NextResponse.json({ error: 'allowedUrls must be an array' }, { status: 400 });
    }

    const child = await addChild(auth.uid, {
      name: name.trim(),
      age,
      ageBand: ageToAgeBand(age),
      blockedUrls: (blockedUrls || []).map((u: string) => u.trim()).filter(Boolean),
      blockedKeywords: (blockedKeywords || []).map((k: string) => k.trim()).filter(Boolean),
      allowedUrls: (allowedUrls || []).map((u: string) => u.trim()).filter(Boolean),
    });

    if (!child) {
      return NextResponse.json({ error: 'Failed to create child profile' }, { status: 500 });
    }

    return NextResponse.json({ child }, { status: 201 });
  } catch (error) {
    console.error('[parent-controls/children] POST error:', error);
    return NextResponse.json({ error: 'Failed to create child profile' }, { status: 500 });
  }
}
