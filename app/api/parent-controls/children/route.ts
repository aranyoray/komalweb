import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getParentChildren, addChild, ageToAgeBand } from '@/lib/safety-engine/parent-controls';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

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
    const ip = getClientIp(request.headers);
    if (isRateLimited(`parent-children-get:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

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
    const ip = getClientIp(request.headers);
    if (isRateLimited(`parent-children-post:${ip}`, 10, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

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

    // Validate and sanitize array entries (max 100 items each, max 2048 chars per entry)
    const sanitizeArray = (arr: unknown[], maxLen = 100, maxChars = 2048): string[] =>
      (arr || [])
        .slice(0, maxLen)
        .map((item: unknown) => String(item).trim().slice(0, maxChars))
        .filter(Boolean);

    const child = await addChild(auth.uid, {
      name: name.trim().slice(0, 100),
      age,
      ageBand: ageToAgeBand(age),
      blockedUrls: sanitizeArray(blockedUrls || []),
      blockedKeywords: sanitizeArray(blockedKeywords || []),
      allowedUrls: sanitizeArray(allowedUrls || []),
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
