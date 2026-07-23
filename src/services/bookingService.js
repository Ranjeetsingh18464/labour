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
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const BOOKINGS_COLLECTION = 'bookings';

export const createBooking = async (data) => {
  try {
    const bookingData = {
      ...data,
      status: 'pending',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };
    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), bookingData);
    await updateDoc(doc(db, BOOKINGS_COLLECTION, docRef.id), { id: docRef.id });
    return { id: docRef.id, ...bookingData };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getBooking = async (id) => {
  try {
    const docSnap = await getDoc(doc(db, BOOKINGS_COLLECTION, id));
    if (!docSnap.exists()) throw new Error('Booking not found');
    return { id: docSnap.id, ...docSnap.data() };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getUserBookings = async (userId) => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getLabourBookings = async (labourId) => {
  try {
    const q = query(
      collection(db, BOOKINGS_COLLECTION),
      where('labourId', '==', labourId),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    throw new Error(error.message);
  }
};

export const updateBookingStatus = async (id, status) => {
  try {
    const ref = doc(db, BOOKINGS_COLLECTION, id);
    await updateDoc(ref, { status, updatedAt: serverTimestamp() });
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const cancelBooking = async (id) => {
  try {
    const ref = doc(db, BOOKINGS_COLLECTION, id);
    await updateDoc(ref, { status: 'cancelled', updatedAt: serverTimestamp() });
    const updated = await getDoc(ref);
    return { id: updated.id, ...updated.data() };
  } catch (error) {
    throw new Error(error.message);
  }
};
