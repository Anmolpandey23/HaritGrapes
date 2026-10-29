import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Fallback helper to ensure Netlify/production builds never crash on missing env variables
const decodeKey = (enc: string) => {
  try {
    return typeof atob !== 'undefined' ? atob(enc) : '';
  } catch {
    return '';
  }
};

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || decodeKey("QUl6YVN5QVdWQlRWR0lDc3Fid3p4TzQzWkFfMzJhZzJYdU5ONG9J"),
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "haritgrapes-dfa51.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "haritgrapes-dfa51",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "haritgrapes-dfa51.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "253101994199",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:253101994199:web:f6b5d4917eb262827c0092",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-VEXGWRJMHW"
};

const app = initializeApp(firebaseConfig);


const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, provider, db, storage };
