import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { getParentChildren } from '@/lib/safety-engine/parent-controls';
import { getNotifications } from '@/lib/safety-engine/parent-controls';
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
// GET /api/parent-controls
// Returns a summary: children list + unread notification count
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    if (isRateLimited(`parent-controls:${ip}`, 30, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const [children, notifications] = await Promise.all([
      getParentChildren(auth.uid),
      getNotifications(auth.uid, 10, true),
    ]);

    return NextResponse.json({
      children,
      unreadNotifications: notifications.length,
      recentNotifications: notifications.slice(0, 5),
    });
  } catch (error) {
    console.error('[parent-controls] Error:', error);
    return NextResponse.json({ error: 'Failed to fetch parent controls' }, { status: 500 });
  }
}
