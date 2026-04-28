import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Achievement } from '../types';
import { useAuth } from './AuthContext';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firestoreUtils';

interface UserContextType {
  user: User;
  addToHistory: (animeId: string, episodeId: string) => void;
  toggleFavorite: (animeId: string) => void;
  addAchievement: (achievement: Achievement) => void;
  updateUser: (updates: Partial<User>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const GUEST_USER: User = {
  id: 'guest',
  name: 'Mexmon',
  email: 'mexmon@anihub.uz',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=2000&auto=format&fit=crop',
  role: 'user',
  joinedAt: new Date().toISOString().split('T')[0],
  level: 0,
  points: 0,
  favorites: [],
  history: [],
  achievements: []
};

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user: authUser } = useAuth();
  const [user, setUser] = useState<User>(authUser || GUEST_USER);
  const isInitialMount = useRef(true);

  // Listen for real-time user updates from Firestore if authenticated
  useEffect(() => {
    if (authUser && authUser.id !== 'guest') {
      const userRef = doc(db, 'users', authUser.id);
      const unsubscribe = onSnapshot(userRef, (docSnap) => {
        if (docSnap.exists()) {
          setUser(docSnap.data() as User);
        }
      }, (error) => {
        handleFirestoreError(error, 'list', `users/${authUser.id}`);
      });
      return () => unsubscribe();
    } else {
      setUser(authUser || GUEST_USER);
    }
  }, [authUser]);

  // Recalculate level and points whenever history changes
  // This logic should probably be moved to the update methods if we want to save it to Firestore
  const calculateProgress = (historyLength: number) => {
    const rawScore = historyLength * 0.1;
    const level = Math.min(100, Math.floor(rawScore));
    const points = Math.round((rawScore - level) * 1000);
    return { level, points };
  };

  const syncToFirestore = async (updates: Partial<User>) => {
    if (authUser && authUser.id !== 'guest') {
      try {
        const userRef = doc(db, 'users', authUser.id);
        await updateDoc(userRef, updates);
      } catch (error) {
        handleFirestoreError(error, 'update', `users/${authUser.id}`);
      }
    } else {
      // Local updates for guest or during auth transitions
      setUser(prev => ({ ...prev, ...updates }));
    }
  };

  const addToHistory = async (animeId: string, episodeId: string) => {
    const lastEntry = user.history[0];
    if (lastEntry?.animeId === animeId && lastEntry?.episodeId === episodeId) return;

    const newEntry = { animeId, episodeId, watchedAt: new Date().toISOString() };
    const newHistory = [newEntry, ...user.history];
    const { level, points } = calculateProgress(newHistory.length);
    
    await syncToFirestore({
      history: newHistory,
      level,
      points
    });
  };

  const toggleFavorite = async (animeId: string) => {
    const newFavorites = user.favorites.includes(animeId)
      ? user.favorites.filter(id => id !== animeId)
      : [...user.favorites, animeId];
    
    await syncToFirestore({ favorites: newFavorites });
  };

  const addAchievement = async (achievement: Achievement) => {
    if (user.achievements.find(a => a.id === achievement.id)) return;
    const newAchievements = [achievement, ...user.achievements];
    
    await syncToFirestore({ achievements: newAchievements });
  };

  const updateUser = async (updates: Partial<User>) => {
    await syncToFirestore(updates);
  };

  // Achievements check logic (kept local for immediate feedback, but saves to Firestore)
  useEffect(() => {
    if (!authUser || authUser.id === 'guest') return;

    const checkAchievements = async () => {
      const history = user.history;
      const uniqueAnimes = new Set(history.map(h => h.animeId)).size;
      const totalEpisodes = history.length;
      
      const achievementsToUnlock: Achievement[] = [];
      const currentIds = new Set(user.achievements.map(a => a.id));

      const addPlaceholder = (id: string, title: string, desc: string, icon: any) => {
        if (!currentIds.has(id)) {
          achievementsToUnlock.push({
            id, title, description: desc, iconType: icon,
            unlockedAt: new Date().toISOString().split('T')[0]
          });
        }
      };

      if (totalEpisodes >= 1) addPlaceholder('1', 'Ilk qadam', 'Birinchi animeni ko\'rdingiz', 'lightning');
      if (uniqueAnimes >= 10) addPlaceholder('2', 'Kinochi', '10 ta anime ko\'rildi', 'lightning');
      if (totalEpisodes >= 100) addPlaceholder('3', 'Hafta Qahramoni', '100 ta epizod tomosha qilindi', 'lightning');
      if (user.points >= 500) addPlaceholder('4', 'Fanda', '500 XP to\'pladingiz', 'star');
      if (uniqueAnimes >= 5) addPlaceholder('5', 'Ekspert', '5 xil animeni ko\'rdingiz', 'medal');
      if (user.level >= 5) addPlaceholder('6', 'Olovli', '5-darajaga yetdingiz', 'fire');
      if (user.favorites.length >= 5) addPlaceholder('7', 'Sodiq muxlis', '5 ta animeni sevimlilarga qo\'shdingiz', 'heart');
      
      if (achievementsToUnlock.length > 0) {
        await syncToFirestore({
          achievements: [...achievementsToUnlock, ...user.achievements]
        });
      }
    };

    checkAchievements();
  }, [user.history.length, user.favorites.length, user.points, user.level, user.name, user.avatar]);

  return (
    <UserContext.Provider value={{ user, addToHistory, toggleFavorite, addAchievement, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};
