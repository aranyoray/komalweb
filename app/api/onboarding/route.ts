import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

export async function POST(request: NextRequest) {
  try {
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

    const { firstName, lastName, phone, phoneCountryCode, country, referralCode, photoURL, linkedIn, instagram, twitter } = await request.json();

    if (!firstName?.trim() || !lastName?.trim()) {
      return NextResponse.json({ error: 'First name and last name are required' }, { status: 400 });
    }

    if (!country?.trim()) {
      return NextResponse.json({ error: 'Country is required' }, { status: 400 });
    }

    const userId = decoded.uid;

    await db.collection('users').doc(userId).update({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phone: phone?.trim() || '',
      phoneCountryCode: phoneCountryCode || '',
      country: country.trim(),
      referralCode: referralCode?.trim() || '',
      photoURL: photoURL || '',
      linkedIn: linkedIn?.trim() || '',
      instagram: instagram?.trim() || '',
      twitter: twitter?.trim() || '',
      onboardingCompleted: true,
      onboardingStatus: 'completed',
    });

    return NextResponse.json({ success: true, country: country.trim() });
  } catch (error) {
    console.error('Onboarding error:', error);
    return NextResponse.json({ error: 'Failed to save onboarding data' }, { status: 500 });
  }
}
