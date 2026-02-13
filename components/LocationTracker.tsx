'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LocationTracker() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    // Avoid duplicate logging in the same session
    const alreadyLogged = sessionStorage.getItem('location_logged');
    if (alreadyLogged) return;

    const logLocation = async () => {
      try {
        // Fetch real public IP from client side
        const ipRes = await fetch('https://api.ipify.org?format=json');
        const { ip } = await ipRes.json();

        await fetch('/api/log-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user?.uid || null, ip }),
        });
        sessionStorage.setItem('location_logged', '1');
      } catch (error) {
        console.error('Location logging failed:', error);
      }
    };

    logLocation();
  }, [user, loading]);

  return null;
}
