import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Rate limit: 20 requests per minute per IP
    const ip = getClientIp(request.headers);
    if (isRateLimited(`ambassadors:${ip}`, 20, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const snapshot = await db
      .collection('users')
      .where('role', '==', 'ambassador')
      .get();

    // Only return URLs that start with https:// to prevent javascript:/phishing URIs
    const safeUrl = (url: unknown): string =>
      typeof url === 'string' && url.startsWith('https://') ? url : '';

    const ambassadors = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        city: data.city || '',
        country: data.country || '',
        grade: data.grade || '',
        bio: data.bio || '',
        photoURL: data.photoURL || '',
        linkedIn: safeUrl(data.linkedIn),
        instagram: safeUrl(data.instagram),
        twitter: safeUrl(data.twitter),
      };
    });

    return NextResponse.json({ ambassadors });
  } catch (error) {
    console.error('Ambassadors fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch ambassadors' }, { status: 500 });
  }
}
