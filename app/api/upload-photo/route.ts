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

    const { photoData } = await request.json();

    if (!photoData || typeof photoData !== 'string') {
      return NextResponse.json({ error: 'No photo data provided' }, { status: 400 });
    }

    // Validate it's a data URL and reasonable size (max ~500KB base64 ≈ ~375KB image)
    if (!photoData.startsWith('data:image/')) {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
    }

    if (photoData.length > 500_000) {
      return NextResponse.json({ error: 'Image too large. Please use a smaller photo.' }, { status: 400 });
    }

    const userId = decoded.uid;

    await db.collection('users').doc(userId).update({
      photoURL: photoData,
    });

    return NextResponse.json({ photoURL: photoData });
  } catch (error) {
    console.error('Photo upload error:', error);
    return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 });
  }
}
