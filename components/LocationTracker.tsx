'use client';

import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function LocationTracker() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !db) return;

    const alreadyLogged = sessionStorage.getItem('location_logged');
    if (alreadyLogged) return;

    const logLocation = async () => {
      try {
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

        await addDoc(collection(db!, 'location'), {
          ip,
          country,
          state,
          city,
          uid: user?.uid || null,
          timestamp: new Date().toISOString(),
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
