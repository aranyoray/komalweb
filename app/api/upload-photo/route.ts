import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';
import { isRateLimited, getClientIp } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Rate limit: 10 uploads per minute per IP
    const ip = getClientIp(request.headers);
    if (isRateLimited(`upload-photo:${ip}`, 10, 60_000)) {
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

    const { photoData } = await request.json();

    if (!photoData || typeof photoData !== 'string') {
      return NextResponse.json({ error: 'No photo data provided' }, { status: 400 });
    }

    // Validate it's a data URL with an allowed image MIME type
    const allowedMimes = ['data:image/jpeg;', 'data:image/png;', 'data:image/gif;', 'data:image/webp;'];
    if (!allowedMimes.some(m => photoData.startsWith(m))) {
      return NextResponse.json({ error: 'Invalid image format. Allowed: JPEG, PNG, GIF, WebP.' }, { status: 400 });
    }

    if (photoData.length > 500_000) {
      return NextResponse.json({ error: 'Image too large. Please use a smaller photo.' }, { status: 400 });
    }

    // Validate actual file content via magic bytes (prevents MIME spoofing)
    try {
      const base64Part = photoData.split(',')[1];
      if (!base64Part) {
        return NextResponse.json({ error: 'Malformed data URL' }, { status: 400 });
      }
      const bytes = Buffer.from(base64Part, 'base64');
      const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;
      const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;
      const isGif = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;
      const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46
                  && bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;
      if (!isJpeg && !isPng && !isGif && !isWebp) {
        return NextResponse.json({ error: 'File content does not match an allowed image format' }, { status: 400 });
      }
    } catch {
      return NextResponse.json({ error: 'Invalid image data' }, { status: 400 });
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
