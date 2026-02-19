import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '@/lib/safety-engine/parent-controls';

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
// GET /api/parent-controls/notifications
// Fetch notifications for the authenticated parent
// Query params: ?limit=50&unreadOnly=false
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 100);
    const unreadOnly = searchParams.get('unreadOnly') === 'true';

    const notifications = await getNotifications(auth.uid, limit, unreadOnly);

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('[parent-controls/notifications] GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

// ============================================================================
// POST /api/parent-controls/notifications
// Mark notifications as read
// Body: { notificationId: string } or { markAllRead: true }
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAuth(request);
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { notificationId, markAllRead } = body;

    if (markAllRead) {
      const success = await markAllNotificationsRead(auth.uid);
      return NextResponse.json({ success, message: success ? 'All notifications marked as read' : 'Failed' });
    }

    if (!notificationId || typeof notificationId !== 'string') {
      return NextResponse.json({ error: 'notificationId is required' }, { status: 400 });
    }

    const success = await markNotificationRead(auth.uid, notificationId);

    if (!success) {
      return NextResponse.json({ error: 'Notification not found or update failed' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('[parent-controls/notifications] POST error:', error);
    return NextResponse.json({ error: 'Failed to update notification' }, { status: 500 });
  }
}
