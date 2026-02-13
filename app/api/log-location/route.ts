import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

// Force Node.js runtime — firebase-admin does not work on Edge
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));

    const uid: string | null = body.uid || null;
    const ip: string = body.ip || 'unknown';
    const country: string = body.country || 'unknown';
    const state: string = body.state || 'unknown';
    const city: string = body.city || 'unknown';

    if (!db) {
      console.error('Firestore admin not initialized — check FIREBASE env vars');
      return NextResponse.json({ error: 'Database not available' }, { status: 503 });
    }

    await db.collection('location').add({
      ip,
      country,
      state,
      city,
      uid,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging location:', error);
    return NextResponse.json({ error: 'Failed to log location' }, { status: 500 });
  }
}
