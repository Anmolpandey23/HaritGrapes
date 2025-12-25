import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAWVBTVGICsqbwzxO43ZA_32ag2XuNN4oI",
  authDomain: "haritgrapes-dfa51.firebaseapp.com",
  projectId: "haritgrapes-dfa51",
  storageBucket: "haritgrapes-dfa51.firebasestorage.app",
  messagingSenderId: "253101994199",
  appId: "1:253101994199:web:f6b5d4917eb262827c0092",
  measurementId: "G-VEXGWRJMHW"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, provider, db, storage };
