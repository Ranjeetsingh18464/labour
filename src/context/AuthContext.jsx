import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { signIn, signUp, signOutUser as authSignOut, signInWithGoogle, sendOTP, verifyOTP, resetPassword } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    try {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (cancelled) return;
        setUser(firebaseUser);
        if (firebaseUser) {
          try {
            const docSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
            if (!cancelled) {
              if (docSnap.exists()) {
                setUserData({ id: firebaseUser.uid, ...docSnap.data() });
              }
            }
          } catch (err) {
            console.error('Error fetching user data:', err);
          }
        } else {
          setUserData(null);
        }
        if (!cancelled) setLoading(false);
      });
      return () => { cancelled = true; unsubscribe(); };
    } catch (err) {
      console.error('Auth initialization error:', err);
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const result = await signIn(email, password);
    return result;
  };

  const register = async (email, password, role = 'customer') => {
    const result = await signUp(email, password, role);
    return result;
  };

  const loginWithGoogle = async () => {
    return await signInWithGoogle();
  };

  const logout = async () => {
    await authSignOut();
    setUserData(null);
  };

  const value = {
    user,
    userData,
    loading,
    login,
    register,
    loginWithGoogle,
    logout,
    sendOTP,
    verifyOTP,
    resetPassword,
    isAdmin: userData?.role === 'admin' || userData?.role === 'super-admin',
    isLabour: userData?.role === 'labour',
    isCustomer: userData?.role === 'customer' || !userData?.role,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
