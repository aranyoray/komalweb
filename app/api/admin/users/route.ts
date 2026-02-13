import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { getAuth } from 'firebase-admin/auth';

const PAGE_SIZE = 10;

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.split('Bearer ')[1];
  try {
    const decoded = await getAuth().verifyIdToken(token);
    const uid = decoded.uid;

    // Double-layer: check Firestore role
    const userDoc = await db.collection('users').doc(uid).get();
    if (userDoc.data()?.role !== 'fin-auth') return null;

    return uid;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const adminUid = await verifyAdmin(request);
    if (!adminUid) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
    const search = (searchParams.get('search') || '').trim().toLowerCase();
    const filter = searchParams.get('filter') || 'all'; // all | paid | not-paid

    // Fetch only Canada/China users
    const snapshot = await db.collection('users').get();
    let users = snapshot.docs
      .map((doc) => {
        const d = doc.data();
        const country = d.country || null;
        const subscriptionStatus = d.subscriptionStatus || null;
        const plan = d.plan || 'free';
        const isPaid =
          subscriptionStatus === 'active' ||
          subscriptionStatus === 'canceling' ||
          plan === 'ambassador';
        return {
          uid: doc.id,
          name: d.name || '',
          email: d.email || '',
          plan,
          subscriptionStatus,
          subscriptionEndDate: d.subscriptionEndDate || null,
          country,
          role: d.role || null,
          paid: isPaid,
        };
      })
      .filter(
        (u) =>
          u.country &&
          ['CA', 'CN'].includes(u.country.toUpperCase())
      );

    // Search filter (case-insensitive contains on name + email)
    if (search) {
      users = users.filter(
        (u) =>
          u.name.toLowerCase().includes(search) ||
          u.email.toLowerCase().includes(search)
      );
    }

    // Paid / not-paid filter
    if (filter === 'paid') {
      users = users.filter(
        (u) =>
          u.subscriptionStatus === 'active' ||
          u.subscriptionStatus === 'canceling' ||
          u.plan === 'ambassador'
      );
    } else if (filter === 'not-paid') {
      users = users.filter(
        (u) =>
          u.subscriptionStatus !== 'active' &&
          u.subscriptionStatus !== 'canceling' &&
          u.plan !== 'ambassador'
      );
    }

    const total = users.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const safePage = Math.min(page, totalPages);
    const offset = (safePage - 1) * PAGE_SIZE;
    const paged = users.slice(offset, offset + PAGE_SIZE);

    return NextResponse.json({
      users: paged,
      page: safePage,
      totalPages,
      total,
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
