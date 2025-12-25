import { db, storage } from './firebaseConfig';
import {
  doc, setDoc, getDoc, updateDoc, collection, addDoc, getDocs
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Main user profile CRUD at /users/{uid}

export const createUserProfile = async (uid: string, profile: any) => {
  await setDoc(doc(db, 'users', uid), profile, { merge: true });
};

export const updateUserProfile = async (uid: string, updates: any) => {
  await updateDoc(doc(db, 'users', uid), updates);
};

export const getUserProfile = async (uid: string) => {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? snap.data() : null;
};

// Scan Results CRUD
export const saveScanResult = async (uid: string, scan: any) => {
  await addDoc(collection(db, 'users', uid, 'scans'), scan);
};

// Yield Results CRUD
export const saveYieldResult = async (uid: string, result: any) => {
  await addDoc(collection(db, 'users', uid, 'yield'), result);
};

// Fertilizer Results CRUD
export const saveFertilizerResult = async (uid: string, result: any) => {
  await addDoc(collection(db, 'users', uid, 'fertilizer'), result);
};

// Leaf image uploads (to Firebase Storage)
export const uploadImage = async (uid: string, scanId: string, file: File) => {
  const imageRef = ref(storage, `leafUploads/${uid}/${scanId}.jpg`);
  await uploadBytes(imageRef, file);
  return await getDownloadURL(imageRef);
};

// User stats aggregation
export const fetchUserStats = async (uid: string) => {
  const scansSnap = await getDocs(collection(db, 'users', uid, 'scans'));
  const yieldSnap = await getDocs(collection(db, 'users', uid, 'yield'));
  let healthy = 0, diseased = 0;

  scansSnap.forEach(docSnap => {
    const d = docSnap.data();
    if (d.disease === 'Healthy') healthy++;
    else diseased++;
  });

  let totalYield = 0;
  yieldSnap.forEach(docSnap => {
    totalYield += Number(docSnap.data().predictedYield) || 0;
  });

  return {
    totalScans: scansSnap.size,
    healthy,
    diseased,
    avgYield: yieldSnap.size ? (totalYield / yieldSnap.size) : 0
  };
};
