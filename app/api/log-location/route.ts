import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  console.log('[log-location] API hit');

  try {
    const body = await request.json();
    const uid: string | null = body.uid || null;

    const forwarded = request.headers.get('x-forwarded-for');
    let ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    ip = ip.replace(/^::ffff:/, '');

    console.log('[log-location] IP:', ip, 'UID:', uid, 'DB exists:', !!db);

    let country = 'unknown';
    let state = 'unknown';
    let city = 'unknown';

    try {
      const geoRes = await fetch(`https://ipwho.is/${ip}`, { signal: AbortSignal.timeout(3000) });
      const geoData = await geoRes.json();
      if (geoData.success !== false) {
        country = geoData.country || 'unknown';
        state = geoData.region || 'unknown';
        city = geoData.city || 'unknown';
      }
      console.log('[log-location] Geo:', country, state, city);
    } catch (geoErr) {
      console.error('[log-location] Geo lookup failed:', geoErr);
    }

    const docId = `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log('[log-location] Writing doc:', docId);

    await db.collection('location').doc(docId).set({
      ip,
      country,
      state,
      city,
      uid,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    console.log('[log-location] Write success');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[log-location] Error:', error);
    return NextResponse.json({ error: 'Failed to log location' }, { status: 500 });
  }
}
