import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const LABOURS_COLLECTION = 'labours';

export const createLabour = async (data) => {
  try {
    const labourData = {
      ...data,
      status: 'pending',
      verified: false,
      suspended: false,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, LABOURS_COLLECTION), labourData);
    await updateDoc(doc(db, LABOURS_COLLECTION, docRef.id), { id: docRef.id });
    return { id: docRef.id, ...labourData };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getLabour = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, LABOURS_COLLECTION, id));
    if (!docSnap.exists()) throw new Error('Labour not found');
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAllLabours = async (filters = {}) => {
  try {
    let constraints = [];
    if (filters.status) constraints.push(where('status', '==', filters.status));
    if (filters.city) constraints.push(where('city', '==', filters.city));
    if (filters.category) constraints.push(where('category', '==', filters.category));
    if (filters.verified !== undefined) constraints.push(where('verified', '==', filters.verified));
    constraints.push(orderBy('createdAt', 'desc'));
    if (filters.limit) constraints.push(limit(filters.limit));

    const q = query(collection(db, LABOURS_COLLECTION), ...constraints);
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateLabour = async (id, data) => {
  try {
    const labourRef = doc(db, LABOURS_COLLECTION, id);
    await updateDoc(labourRef, { ...data, updatedAt: serverTimestamp() });
    const updated = await getDoc(labourRef);
    return { id: updated.id, ...updated.data() };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteLabour = async (id) => {
  try {
    await deleteDoc(doc(db, LABOURS_COLLECTION, id));
    return { success: true, id };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const approveLabour = async (id) => {
  return updateLabour(id, { status: 'approved', verified: true });
};

export const rejectLabour = async (id) => {
  return updateLabour(id, { status: 'rejected', verified: false });
};

export const suspendLabour = async (id) => {
  return updateLabour(id, { suspended: true, status: 'suspended' });
};

export const verifyLabour = async (id) => {
  return updateLabour(id, { verified: true });
};

export const getLaboursByCity = async (city) => {
  try {
    const q = query(collection(db, LABOURS_COLLECTION), where('city', '==', city), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getLaboursByCategory = async (category) => {
  try {
    const q = query(collection(db, LABOURS_COLLECTION), where('category', '==', category), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const searchLabours = async (queryText) => {
  try {
    const q = query(
      collection(db, LABOURS_COLLECTION),
      orderBy('name'),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const lower = queryText.toLowerCase();
    return results.filter(
      (labour) =>
        (labour.name && labour.name.toLowerCase().includes(lower)) ||
        (labour.skills && labour.skills.some((s) => s.toLowerCase().includes(lower))) ||
        (labour.description && labour.description.toLowerCase().includes(lower)) ||
        (labour.city && labour.city.toLowerCase().includes(lower))
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const generateLabourId = async (city, area) => {
  try {
    const prefix = (city?.substring(0, 3).toUpperCase() || 'XXX') + (area?.substring(0, 3).toUpperCase() || 'XXX');
    const q = query(collection(db, LABOURS_COLLECTION), where('__name__', '>=', `${prefix}_`), where('__name__', '<=', `${prefix}_\uf8ff`), limit(1));
    const snapshot = await getDocs(q);
    const count = snapshot.size + 1;
    return `${prefix}_${String(count).padStart(5, '0')}`;
  } catch (error) {
    throw new Error(error.message);
  }
};
