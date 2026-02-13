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
        // Try to get geo data; if blocked by ad blocker, still log with uid
        let ip = 'unknown';
        let country = 'unknown';
        let state = 'unknown';
        let city = 'unknown';

        try {
          const geoRes = await fetch('https://ipwho.is/');
          const geoData = await geoRes.json();
          if (geoData.success !== false) {
            ip = geoData.ip || 'unknown';
            country = geoData.country || 'unknown';
            state = geoData.region || 'unknown';
            city = geoData.city || 'unknown';
          }
        } catch {
          // Geo lookup blocked/failed — continue with defaults
        }

        const res = await fetch('/api/log-location', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ uid: user?.uid || null, ip, country, state, city }),
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
