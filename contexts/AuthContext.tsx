'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  OAuthProvider,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface UserData {
  name: string;
  email: string;
  createdAt: string;
  reportsUsed: number;
  plan: 'free' | 'grow' | 'thrive' | 'partner' | 'ambassador';
  stripeCustomerId?: string;
  subscriptionId?: string;
  subscriptionStatus?: string;
  subscriptionPriceId?: string;
  subscriptionEndDate?: string;
  planName?: string;
  onboardingCompleted?: boolean;
  firstName?: string;
  lastName?: string;
  phone?: string;
  phoneCountryCode?: string;
  country?: string;
  referralCode?: string;
  role?: string;
  onboardingStatus?: 'pending' | 'completed';
  photoURL?: string;
  linkedIn?: string;
  instagram?: string;
  twitter?: string;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
  refreshUserData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If auth is not initialized (during SSR or when config is missing), set loading to false
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser && db) {
        // Fetch user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData({
              reportsUsed: 0,
              plan: 'free',
              ...data,
            } as UserData);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase auth not initialized');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUp = async (email: string, password: string, name: string) => {
    if (!auth || !db) throw new Error('Firebase not initialized');

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update display name
    await updateProfile(firebaseUser, { displayName: name });

    // Store user data in Firestore
    const userDocData: UserData = {
      name,
      email,
      createdAt: new Date().toISOString(),
      reportsUsed: 0,
      plan: 'free',
      onboardingCompleted: false,
      onboardingStatus: 'pending',
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userDocData);
    setUserData(userDocData);
  };

  const signInWithGoogle = async () => {
    if (!auth || !db) throw new Error('Firebase not initialized');
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Create user doc if it doesn't exist
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      const userDocData: UserData = {
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        createdAt: new Date().toISOString(),
        reportsUsed: 0,
        plan: 'free',
        onboardingCompleted: false,
        onboardingStatus: 'pending',
      };
      await setDoc(userDocRef, userDocData);
      setUserData(userDocData);
    }
  };

  const signInWithApple = async () => {
    if (!auth || !db) throw new Error('Firebase not initialized');
    const provider = new OAuthProvider('apple.com');
    provider.addScope('email');
    provider.addScope('name');
    const result = await signInWithPopup(auth, provider);
    const firebaseUser = result.user;

    // Create user doc if it doesn't exist
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      const userDocData: UserData = {
        name: firebaseUser.displayName || 'User',
        email: firebaseUser.email || '',
        createdAt: new Date().toISOString(),
        reportsUsed: 0,
        plan: 'free',
        onboardingCompleted: false,
        onboardingStatus: 'pending',
      };
      await setDoc(userDocRef, userDocData);
      setUserData(userDocData);
    }
  };

  const logout = async () => {
    if (!auth) throw new Error('Firebase auth not initialized');
    await signOut(auth);
    setUser(null);
    setUserData(null);
  };

  const getIdToken = async (): Promise<string | null> => {
    if (user) {
      return await user.getIdToken();
    }
    return null;
  };

  const refreshUserData = async () => {
    if (!user || !db) return;
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const data = userDoc.data();
        setUserData({
          reportsUsed: 0,
          plan: 'free',
          ...data,
        } as UserData);
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
    }
  };

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithApple,
    logout,
    getIdToken,
    refreshUserData,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
