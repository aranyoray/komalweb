'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LocationTracker() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const alreadyLogged = sessionStorage.getItem('location_logged');
    if (alreadyLogged) return;

    fetch('/api/log-location', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user?.uid || null }),
    })
      .then((res) => {
        if (res.ok) sessionStorage.setItem('location_logged', '1');
      })
      .catch(() => {});
  }, [user, loading]);

  return null;
}
