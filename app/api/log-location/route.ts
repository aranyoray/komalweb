import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const uid: string | null = body.uid || null;

    // Use public IP sent from client; fall back to headers
    let ip: string = body.ip || '';
    if (!ip) {
      const forwarded = request.headers.get('x-forwarded-for');
      ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
      ip = ip.replace(/^::ffff:/, '');
    }

    // Fetch geolocation from ipwho.is (free, HTTPS, no key needed)
    let country = 'unknown';
    let state = 'unknown';
    let city = 'unknown';

    try {
      const geoRes = await fetch(`https://ipwho.is/${ip}`);
      if (geoRes.ok) {
        const geoData = await geoRes.json();
        if (geoData.success !== false) {
          country = geoData.country || 'unknown';
          state = geoData.region || 'unknown';
          city = geoData.city || 'unknown';
        }
      }
    } catch (geoError) {
      console.error('Geolocation lookup failed:', geoError);
    }

    // Write to Firestore 'location' collection
    if (db) {
      await db.collection('location').add({
        ip,
        country,
        state,
        city,
        uid,
        timestamp: new Date().toISOString(),
        userAgent: request.headers.get('user-agent') || 'unknown',
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error logging location:', error);
    return NextResponse.json({ error: 'Failed to log location' }, { status: 500 });
  }
}
