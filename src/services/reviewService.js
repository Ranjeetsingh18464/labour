import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const REVIEWS_COLLECTION = 'reviews';

export const addReview = async (data) => {
  try {
    const reviewData = {
      ...data,
      createdAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), reviewData);
    await updateDoc(doc(db, REVIEWS_COLLECTION, docRef.id), { id: docRef.id });
    return { id: docRef.id, ...reviewData };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getLabourReviews = async (labourId) => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('labourId', '==', labourId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteReview = async (id) => {
  try {
    await deleteDoc(doc(db, REVIEWS_COLLECTION, id));
    return { success: true, id };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAverageRating = async (labourId) => {
  try {
    const q = query(collection(db, REVIEWS_COLLECTION), where('labourId', '==', labourId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return { averageRating: 0, totalReviews: 0 };
    const ratings = snapshot.docs.map((doc) => doc.data().rating || 0);
    const sum = ratings.reduce((acc, r) => acc + r, 0);
    return { averageRating: sum / ratings.length, totalReviews: ratings.length };
  } catch (error) {
    throw new Error(error.message);
  }
};
