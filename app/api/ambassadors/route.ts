import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET() {
  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not available' }, { status: 500 });
    }

    const snapshot = await db
      .collection('users')
      .where('role', '==', 'ambassador')
      .get();

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
        linkedIn: data.linkedIn || '',
        instagram: data.instagram || '',
        twitter: data.twitter || '',
      };
    });

    return NextResponse.json({ ambassadors });
  } catch (error) {
    console.error('Ambassadors fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch ambassadors' }, { status: 500 });
  }
}
