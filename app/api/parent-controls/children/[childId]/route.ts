import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getChild, updateChild, deleteChild } from '@/lib/safety-engine/parent-controls';

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
// GET /api/parent-controls/children/[childId]
// Get a single child profile
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { childId } = await params;
    const child = await getChild(auth.uid, childId);

    if (!child) {
      return NextResponse.json({ error: 'Child not found' }, { status: 404 });
    }

    return NextResponse.json({ child });
  } catch (error) {
    console.error('[parent-controls/children/[childId]] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch child' }, { status: 500 });
  }
}

// ============================================================================
// PATCH /api/parent-controls/children/[childId]
// Update a child profile (partial update)
// Body: { name?, age?, blockedUrls?, blockedKeywords?, allowedUrls? }
// ============================================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { childId } = await params;
    const body = await request.json();
    const { name, age, blockedUrls, blockedKeywords, allowedUrls } = body;

    // Validate inputs if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }
    if (age !== undefined && (typeof age !== 'number' || age < 0 || age > 18)) {
      return NextResponse.json({ error: 'Invalid age (0-18)' }, { status: 400 });
    }
    if (blockedUrls !== undefined && !Array.isArray(blockedUrls)) {
      return NextResponse.json({ error: 'blockedUrls must be an array' }, { status: 400 });
    }
    if (blockedKeywords !== undefined && !Array.isArray(blockedKeywords)) {
      return NextResponse.json({ error: 'blockedKeywords must be an array' }, { status: 400 });
    }
    if (allowedUrls !== undefined && !Array.isArray(allowedUrls)) {
      return NextResponse.json({ error: 'allowedUrls must be an array' }, { status: 400 });
    }

    // Build updates object with only provided fields
    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name.trim();
    if (age !== undefined) updates.age = age;
    if (blockedUrls !== undefined) updates.blockedUrls = blockedUrls.map((u: string) => u.trim()).filter(Boolean);
    if (blockedKeywords !== undefined) updates.blockedKeywords = blockedKeywords.map((k: string) => k.trim()).filter(Boolean);
    if (allowedUrls !== undefined) updates.allowedUrls = allowedUrls.map((u: string) => u.trim()).filter(Boolean);

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: 'No fields to update' }, { status: 400 });
    }

    const child = await updateChild(auth.uid, childId, updates);

    if (!child) {
      return NextResponse.json({ error: 'Child not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({ child });
  } catch (error) {
    console.error('[parent-controls/children/[childId]] PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update child' }, { status: 500 });
  }
}

// ============================================================================
// DELETE /api/parent-controls/children/[childId]
// Delete a child profile
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ childId: string }> }
) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { childId } = await params;
    const success = await deleteChild(auth.uid, childId);

    if (!success) {
      return NextResponse.json({ error: 'Child not found or delete failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Child profile deleted' });
  } catch (error) {
    console.error('[parent-controls/children/[childId]] DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete child' }, { status: 500 });
  }
}
