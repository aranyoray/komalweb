'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function LocationTracker() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;

    const alreadyLogged = sessionStorage.getItem('location_logged');
    if (alreadyLogged) return;

    const logLocation = async () => {
      try {
        // Single call: ipwho.is returns IP + geo data together
        const geoRes = await fetch('https://ipwho.is/');
        const geoData = await geoRes.json();

        await fetch('/api/log-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user?.uid || null,
            ip: geoData.ip || 'unknown',
            country: geoData.country || 'unknown',
            state: geoData.region || 'unknown',
            city: geoData.city || 'unknown',
          }),
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
