import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const FAVORITES_COLLECTION = 'favorites';

export const addFavorite = async (userId, labourId) => {
  try {
    const existing = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('labourId', '==', labourId)
    );
    const existingSnapshot = await getDocs(existing);
    if (!existingSnapshot.empty) return { id: existingSnapshot.docs[0].id, userId, labourId };
    const docRef = await addDoc(collection(db, FAVORITES_COLLECTION), {
      userId,
      labourId,
      createdAt: serverTimestamp(),
    });
    return { id: docRef.id, userId, labourId };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const removeFavorite = async (userId, labourId) => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('labourId', '==', labourId)
    );
    const snapshot = await getDocs(q);
    if (snapshot.empty) throw new Error('Favorite not found');
    await Promise.all(snapshot.docs.map((doc) => deleteDoc(doc.ref)));
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const isFavorite = async (userId, labourId) => {
  try {
    const q = query(
      collection(db, FAVORITES_COLLECTION),
      where('userId', '==', userId),
      where('labourId', '==', labourId)
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch (error) {
    throw new Error(error.message);
  }
};
