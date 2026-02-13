import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const uid: string | null = body.uid || null;

    // Vercel sets x-forwarded-for with the real client IP
    const forwarded = request.headers.get('x-forwarded-for');
    let ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown';
    ip = ip.replace(/^::ffff:/, '');

    // Geo lookup server-side via HTTPS
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
    } catch {
      // Geo lookup failed — continue with IP only
    }

    const docId = `loc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    await db.collection('location').doc(docId).set({
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
