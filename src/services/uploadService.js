import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './firebase';

export const uploadImage = async (file, path) => {
  try {
    const storageRef = ref(storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return { url: downloadURL, path: snapshot.ref.fullPath };
  } catch (error) {
    console.error('Upload error:', error.code, error.message, error.customData?.serverResponse);
    const msg =
      error.code === 'storage/unauthorized'
        ? 'Storage permission denied. Check Firebase Storage rules.'
        : error.code === 'storage/canceled'
        ? 'Upload was cancelled'
        : error.code === 'storage/unknown'
        ? `Storage error: ${error.customData?.serverResponse || 'Check CORS configuration on the bucket.'}`
        : error.message;
    throw new Error(msg);
  }
};

export const uploadMultipleImages = async (files, path) => {
  try {
    const uploadPromises = files.map((file, index) => {
      const filePath = `${path}/${Date.now()}_${index}_${file.name}`;
      return uploadImage(file, filePath);
    });
    return await Promise.all(uploadPromises);
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteImage = async (imageUrl) => {
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    return { success: true };
  } catch (error) {
    throw new Error(error.message);
  }
};
