import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  signOut, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firestoreUtils';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User> & { password?: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUserProfile = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        setUser(userSnap.data() as User);
      } else {
        // Create new user profile in Firestore
        const isSuperAdmin = firebaseUser.email === 'eyfelchik@gmail.com';
        const isAdmin = isSuperAdmin || firebaseUser.email === 'mirzayevr471@gmail.com';
        
        const newUser: User = {
          id: firebaseUser.uid,
          name: firebaseUser.displayName || 'Foydalanuvchi',
          email: firebaseUser.email || '',
          avatar: firebaseUser.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firebaseUser.uid}`,
          role: isAdmin ? 'admin' : 'user',
          isSuperAdmin,
          joinedAt: new Date().toISOString(),
          level: 1,
          points: 0,
          favorites: [],
          history: [],
          achievements: []
        };

        await setDoc(userRef, newUser);
        setUser(newUser);
      }
    } catch (error) {
      handleFirestoreError(error, 'get', `users/${firebaseUser.uid}`);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        await syncUserProfile(firebaseUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error('Google Login Error:', err);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err: any) {
      throw new Error(err.message || 'Email yoki parol noto\'g\'ri');
    }
  };

  const signup = async (userData: any) => {
    try {
      const { user: firebaseUser } = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      
      // The profile will be created in the onAuthStateChanged effect
    } catch (err: any) {
      throw new Error(err.message || "Ro'yxatdan o'tishda xatolik yuz berdi");
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
