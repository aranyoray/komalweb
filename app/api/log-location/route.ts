import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { uid, ip, country, state, city } = body;

    const docData = {
      ip: ip || 'unknown',
      country: country || 'unknown',
      state: state || 'unknown',
      city: city || 'unknown',
      uid: uid || null,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    const docId = `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.collection('location').doc(docId).set(docData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging location:', error);
    return NextResponse.json({ error: 'Failed to log location' }, { status: 500 });
  }
}
