import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { User, Achievement } from '../types';
import { useAuth } from './AuthContext';

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

  // Sync with AuthContext user
  useEffect(() => {
    if (authUser) {
      setUser(authUser);
    } else {
      setUser(GUEST_USER);
    }
  }, [authUser]);

  // Persistent save to the "Users DB" if authenticated
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (authUser) {
      const USERS_KEY = 'anihub_users_db';
      const CURRENT_USER_KEY = 'anihub_current_user';
      try {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const userIndex = users.findIndex((u: any) => u.id === authUser.id);
        
        if (userIndex !== -1) {
          // Keep password if it exists in the storage item
          const diskUser = users[userIndex];
          users[userIndex] = { ...diskUser, ...user };
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        }
      } catch (e) {
        console.error('Error saving user data:', e);
      }
    }
  }, [user]);

  // Recalculate level and points whenever history changes
  useEffect(() => {
    const totalEpisodes = user.history.length;
    const rawScore = totalEpisodes * 0.1;
    const level = Math.min(100, Math.floor(rawScore));
    const points = Math.round((rawScore - level) * 1000);

    if (user.level !== level || user.points !== points) {
      setUser(prev => ({ ...prev, level, points }));
    }
  }, [user.history.length]);

  const addToHistory = (animeId: string, episodeId: string) => {
    const lastEntry = user.history[0];
    if (lastEntry?.animeId === animeId && lastEntry?.episodeId === episodeId) return;

    const newEntry = { animeId, episodeId, watchedAt: new Date().toISOString() };
    setUser(prev => ({
      ...prev,
      history: [newEntry, ...prev.history]
    }));
  };

  const toggleFavorite = (animeId: string) => {
    setUser(prev => ({
      ...prev,
      favorites: prev.favorites.includes(animeId)
        ? prev.favorites.filter(id => id !== animeId)
        : [...prev.favorites, animeId]
    }));
  };

  const addAchievement = (achievement: Achievement) => {
    if (user.achievements.find(a => a.id === achievement.id)) return;
    setUser(prev => ({
      ...prev,
      achievements: [achievement, ...prev.achievements]
    }));
  };

  const updateUser = (updates: Partial<User>) => {
    setUser(prev => ({ ...prev, ...updates }));
  };

  // Achievements check logic
  useEffect(() => {
    const checkAchievements = () => {
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
      if (user.name !== 'Asadbek Developer' || user.avatar.includes('base64')) addPlaceholder('8', 'Master', 'Profilni yangiladingiz', 'lightning');

      if (achievementsToUnlock.length > 0) {
        setUser(prev => ({
          ...prev,
          achievements: [...achievementsToUnlock, ...prev.achievements]
        }));
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
