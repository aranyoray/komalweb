import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

interface GeoData {
  ip: string;
  country: string;
  regionName: string; // state
  city: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const uid: string | null = body.uid || null;

    // Use public IP sent from client; fall back to headers
    let ip: string = body.ip || '';
    if (!ip) {
      const forwarded = request.headers.get('x-forwarded-for');
      ip = forwarded ? forwarded.split(',')[0].trim() : request.headers.get('x-real-ip') || 'unknown';
      // Strip IPv6-mapped IPv4 prefix
      ip = ip.replace(/^::ffff:/, '');
    }

    // Fetch geolocation data from ip-api.com (free, no key needed)
    let country = 'unknown';
    let state = 'unknown';
    let city = 'unknown';

    try {
      const geoRes = await fetch(`http://ip-api.com/json/${ip}?fields=status,country,regionName,city,query`);
      if (geoRes.ok) {
        const geoData: GeoData = await geoRes.json();
        if ((geoData as GeoData & { status: string }).status === 'success') {
          country = geoData.country;
          state = geoData.regionName;
          city = geoData.city;
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
