import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';

const getCollectionSize = async (collectionName, constraints = []) => {
  const q = query(collection(db, collectionName), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.size;
};

export const getDashboardStats = async () => {
  try {
    const [totalLabours, activeLabours, pendingVerifications, totalUsers] = await Promise.all([
      getTotalLabours(),
      getActiveLabours(),
      getPendingVerifications(),
      getTotalUsers(),
    ]);
    return { totalLabours, activeLabours, pendingVerifications, totalUsers };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTotalLabours = async () => {
  try {
    return await getCollectionSize('labours');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getActiveLabours = async () => {
  try {
    return await getCollectionSize('labours', [where('status', '==', 'approved'), where('suspended', '==', false)]);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPendingVerifications = async () => {
  try {
    return await getCollectionSize('labours', [where('status', '==', 'pending')]);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTotalCategories = async () => {
  try {
    return await getCollectionSize('categories');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTotalCities = async () => {
  try {
    return await getCollectionSize('cities');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTotalUsers = async () => {
  try {
    return await getCollectionSize('users');
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getTodaysRegistrations = async () => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const q = query(
      collection(db, 'users'),
      where('createdAt', '>=', Timestamp.fromDate(startOfDay)),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.size;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const manageCategory = async (data) => {
  try {
    if (data.id) {
      const ref = doc(db, 'categories', data.id);
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
      return { id: data.id, ...data };
    }
    const docRef = await addDoc(collection(db, 'categories'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const manageCity = async (data) => {
  try {
    if (data.id) {
      const ref = doc(db, 'cities', data.id);
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
      return { id: data.id, ...data };
    }
    const docRef = await addDoc(collection(db, 'cities'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const manageArea = async (data) => {
  try {
    if (data.id) {
      const ref = doc(db, 'areas', data.id);
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
      return { id: data.id, ...data };
    }
    const docRef = await addDoc(collection(db, 'areas'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const manageBanner = async (data) => {
  try {
    if (data.id) {
      const ref = doc(db, 'banners', data.id);
      await updateDoc(ref, { ...data, updatedAt: serverTimestamp() });
      return { id: data.id, ...data };
    }
    const docRef = await addDoc(collection(db, 'banners'), { ...data, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
    return { id: docRef.id, ...data };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getReports = async (range = 'weekly') => {
  try {
    const now = new Date();
    let startDate;
    switch (range) {
      case 'daily':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'weekly':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case 'monthly':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'yearly':
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    }
    const q = query(
      collection(db, 'labours'),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    const labours = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const bookingsQ = query(
      collection(db, 'bookings'),
      where('createdAt', '>=', Timestamp.fromDate(startDate)),
      orderBy('createdAt', 'desc')
    );
    const bookingsSnapshot = await getDocs(bookingsQ);
    const bookings = bookingsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return { labours, bookings, range, totalLabours: labours.length, totalBookings: bookings.length };
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getAnalytics = async () => {
  try {
    const [totalLabours, activeLabours, pendingVerifications, totalCategories, totalCities, totalUsers, todaysRegistrations] =
      await Promise.all([
        getTotalLabours(),
        getActiveLabours(),
        getPendingVerifications(),
        getTotalCategories(),
        getTotalCities(),
        getTotalUsers(),
        getTodaysRegistrations(),
      ]);
    return {
      totalLabours,
      activeLabours,
      pendingVerifications,
      totalCategories,
      totalCities,
      totalUsers,
      todaysRegistrations,
    };
  } catch (error) {
    throw new Error(error.message);
  }
};
