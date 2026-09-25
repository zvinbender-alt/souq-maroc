import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User as FirebaseUser,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase/config';
import { MoroccanCity, UserProfile } from '../types';
import { handleFirestoreError, OperationType } from '../firebase/error';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  registerWithEmail: (
    email: string,
    pass: string,
    displayName: string,
    phone: string,
    city: MoroccanCity,
    neighborhood?: string
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  openAuthModal: (mode?: 'login' | 'register') => void;
  closeAuthModal: () => void;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register';
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => setIsAuthModalOpen(false);

  // Sync user profile document from Firestore
  const fetchUserProfile = async (user: FirebaseUser) => {
    const userDocRef = doc(db, 'users', user.uid);
    try {
      const snap = await getDoc(userDocRef);
      if (snap.exists()) {
        const data = snap.data();
        setUserProfile({
          name: data.displayName || user.displayName || 'مستخدم سوق المغرب',
          phone: data.phoneNumber || '0661223344',
          email: user.email || '',
          city: (data.city as MoroccanCity) || 'الدار البيضاء',
          neighborhood: data.neighborhood || 'حي المعاريف',
          bio: data.bio || '',
          avatar: data.photoURL || user.photoURL || '',
          isVerified: true,
          memberSince: data.createdAt ? new Date(data.createdAt).toLocaleDateString('ar-MA') : '2026',
        });
      } else {
        // Create initial profile in Firestore
        const newProfile: UserProfile = {
          name: user.displayName || 'مستخدم سوق المغرب',
          phone: '0661223344',
          email: user.email || '',
          city: 'الدار البيضاء',
          neighborhood: 'حي المعاريف',
          bio: 'عضو جديد في منصة سوق المغرب',
          avatar: user.photoURL || '',
          isVerified: true,
          memberSince: new Date().toLocaleDateString('ar-MA'),
        };
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          displayName: newProfile.name,
          phoneNumber: newProfile.phone,
          city: newProfile.city,
          neighborhood: newProfile.neighborhood,
          bio: newProfile.bio,
          photoURL: newProfile.avatar,
          createdAt: new Date().toISOString(),
        });
        setUserProfile(newProfile);
      }
    } catch (e) {
      handleFirestoreError(e, OperationType.GET, `users/${user.uid}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserProfile(user);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, pass: string) => {
    await signInWithEmailAndPassword(auth, email, pass);
    closeAuthModal();
  };

  const registerWithEmail = async (
    email: string,
    pass: string,
    displayName: string,
    phone: string,
    city: MoroccanCity,
    neighborhood = ''
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
    const user = userCredential.user;

    await updateProfile(user, { displayName });

    const userDocRef = doc(db, 'users', user.uid);
    try {
      await setDoc(userDocRef, {
        uid: user.uid,
        email: user.email,
        displayName,
        phoneNumber: phone,
        city,
        neighborhood,
        bio: 'عضو مسجل في منصة سوق المغرب',
        photoURL: '',
        createdAt: new Date().toISOString(),
      });
    } catch (e) {
      handleFirestoreError(e, OperationType.CREATE, `users/${user.uid}`);
    }

    setUserProfile({
      name: displayName,
      phone,
      email,
      city,
      neighborhood,
      bio: 'عضو مسجل في منصة سوق المغرب',
      avatar: '',
      isVerified: true,
      memberSince: new Date().toLocaleDateString('ar-MA'),
    });

    closeAuthModal();
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      closeAuthModal();
    } catch (error: any) {
      const code = String(error?.code || '');
      const msg = String(error?.message || '');
      if (
        code.includes('popup-closed-by-user') ||
        code.includes('cancelled-popup-request') ||
        msg.includes('popup-closed-by-user') ||
        msg.includes('cancelled-popup-request')
      ) {
        // User simply dismissed or closed the popup window, safe to ignore
        return;
      }
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      await updateDoc(userDocRef, {
        displayName: data.name ?? userProfile?.name,
        phoneNumber: data.phone ?? userProfile?.phone,
        city: data.city ?? userProfile?.city,
        neighborhood: data.neighborhood ?? userProfile?.neighborhood,
        bio: data.bio ?? userProfile?.bio,
        photoURL: data.avatar ?? userProfile?.avatar,
      });

      setUserProfile((prev) => (prev ? { ...prev, ...data } : null));
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, `users/${currentUser.uid}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        logout,
        updateUserProfile,
        openAuthModal,
        closeAuthModal,
        isAuthModalOpen,
        authModalMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
