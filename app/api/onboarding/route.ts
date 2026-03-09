import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 5 onboarding attempts per minute per IP
    const ip = getClientIp(request.headers);
    if (isRateLimited(`onboarding:${ip}`, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const authHeader = request.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decoded;
    try {
      decoded = await getAuth().verifyIdToken(token);
    } catch {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Explicitly destructure only allowed fields — never allow role, plan, or subscription fields
    const { firstName, lastName, phone, phoneCountryCode, country, referralCode, photoURL, linkedIn, instagram, twitter, city, grade, bio } = await request.json();

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    if (!country?.trim()) {
      return NextResponse.json({ error: 'Country is required' }, { status: 400 });
    }

    if (!city?.trim()) {
      return NextResponse.json({ error: 'City is required' }, { status: 400 });
    }

    if (!grade?.trim()) {
      return NextResponse.json({ error: 'Grade is required' }, { status: 400 });
    }

    const userId = decoded.uid;

    // Validate photoURL format if provided (must be a data:image/* URI, max 500KB)
    const allowedMimes = ['data:image/jpeg;', 'data:image/png;', 'data:image/gif;', 'data:image/webp;'];
    if (photoURL && typeof photoURL === 'string' && photoURL.length > 0) {
      if (!allowedMimes.some(m => photoURL.startsWith(m))) {
        return NextResponse.json({ error: 'Invalid photo URL format. Allowed: JPEG, PNG, GIF, WebP data URIs.' }, { status: 400 });
      }
      if (photoURL.length > 500_000) {
        return NextResponse.json({ error: 'Photo too large. Please use a smaller image.' }, { status: 400 });
      }
    }

    // Truncate all string fields to prevent excessive data storage
    const s = (v: string | undefined, max = 200) => (v?.trim() || '').slice(0, max);

    await db!.collection('users').doc(userId).update({
      firstName: s(firstName, 100),
      lastName: s(lastName, 100),
      phone: s(phone, 20),
      phoneCountryCode: s(phoneCountryCode, 5),
      country: s(country, 100),
      referralCode: s(referralCode, 50),
      photoURL: photoURL || '',
      linkedIn: s(linkedIn, 200),
      instagram: s(instagram, 200),
      twitter: s(twitter, 200),
      city: s(city, 100),
      grade: s(grade, 50),
      bio: s(bio, 1000),
      onboardingCompleted: true,
      onboardingStatus: 'completed',
    });

    return NextResponse.json({ success: true, country: country.trim() });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }
}
