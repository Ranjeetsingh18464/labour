import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const CATEGORIES_COLLECTION = 'categories';

export const getCategories = async () => {
  try {
    const q = query(collection(db, CATEGORIES_COLLECTION), orderBy('name', 'asc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCategory = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, CATEGORIES_COLLECTION, id));
    if (!docSnap.exists()) throw new Error('Category not found');
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const addCategory = async (data) => {
  try {
    const docRef = await addDoc(collection(db, CATEGORIES_COLLECTION), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateCategory = async (id, data) => {
  try {
    const ref = doc(db, CATEGORIES_COLLECTION, id);
    await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteCategory = async (id) => {
  try {
    await deleteDoc(doc(db, CATEGORIES_COLLECTION, id));
    return { success: true, id };
  } catch (error) {
    throw new Error(error.message);
  }
};
