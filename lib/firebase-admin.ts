import { initializeApp, getApps, cert, App } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | null = null;
let firestoreDb: Firestore | null = null;

// Only initialize if environment variables are available
const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const rawPrivateKey = process.env.FIREBASE_PRIVATE_KEY;

// Diagnostic log (safe - no secrets exposed)
console.log('[firebase-admin] Init check:', {
  hasProjectId: !!projectId,
  hasClientEmail: !!clientEmail,
  hasPrivateKey: !!rawPrivateKey,
  privateKeyLength: rawPrivateKey?.length,
  startsWithQuote: rawPrivateKey?.startsWith('"'),
  startsWithBegin: rawPrivateKey?.startsWith('-----'),
  containsLiteralBackslashN: rawPrivateKey?.includes('\\n'),
  containsRealNewline: rawPrivateKey?.includes('\n'),
  firstChars: rawPrivateKey?.substring(0, 30),
  appsAlreadyInitialized: getApps().length,
});

// Handle private key: Vercel may store it with literal \n, escaped \\n, or JSON-encoded
let privateKey = rawPrivateKey;
if (privateKey) {
  // If the key is JSON-encoded (wrapped in quotes), parse it
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    try {
      privateKey = JSON.parse(privateKey);
    } catch {
      // fallback to manual replace
    }
  }
  // Replace literal \n sequences with actual newlines
  privateKey = privateKey.replace(/\\n/g, '\n');

  console.log('[firebase-admin] After processing:', {
    startsWithBegin: privateKey?.startsWith('-----'),
    containsRealNewline: privateKey?.includes('\n'),
    processedLength: privateKey?.length,
  });
}

if (projectId && clientEmail && privateKey && !getApps().length) {
  try {
    app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    firestoreDb = getFirestore(app);
    console.log('[firebase-admin] Successfully initialized');
  } catch (error: any) {
    console.error('[firebase-admin] Failed to initialize:', error?.message || error);
  }
} else if (getApps().length > 0) {
  app = getApps()[0];
  firestoreDb = getFirestore(app);
}

// Export db - will be null during build if env vars are not set
export const db = firestoreDb as Firestore;
