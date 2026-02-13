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
        let ip = 'unknown';
        let country = 'unknown';
        let state = 'unknown';
        let city = 'unknown';

        try {
          const res = await fetch('https://ipwho.is/');
          const data = await res.json();
          if (data.success !== false) {
            ip = data.ip || 'unknown';
            country = data.country || 'unknown';
            state = data.region || 'unknown';
            city = data.city || 'unknown';
          }
        } catch {
          // Geo lookup blocked by ad blocker — continue with defaults
        }

        const res = await fetch('/api/log-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            uid: user?.uid || null,
            ip,
            country,
            state,
            city,
          }),
        });

        if (res.ok) {
          sessionStorage.setItem('location_logged', '1');
        }
      } catch (error) {
        console.error('Location logging failed:', error);
      }
    };

    logLocation();
  }, [user, loading]);

  return null;
}
