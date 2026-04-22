import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (userData: Partial<User> & { password?: string }) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'anihub_users_db';
const CURRENT_USER_KEY = 'anihub_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        const data = await response.json();
        if (data.user) {
          // Sync with USERS_KEY for admin panel visibility
          const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
          const existingIdx = users.findIndex((u: any) => u.email === data.user.email);
          
          let finalUser = { ...data.user };
          if (existingIdx >= 0) {
            // Preserve role and local stats from storage
            finalUser = { ...finalUser, ...users[existingIdx], role: users[existingIdx].role, isSuperAdmin: users[existingIdx].isSuperAdmin || data.user.isSuperAdmin };
            users[existingIdx] = finalUser;
          } else {
            users.push(finalUser);
          }
          localStorage.setItem(USERS_KEY, JSON.stringify(users));
          
          setUser(finalUser);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(finalUser));
        } else {
          // Fallback to local storage if server session is empty
          const savedUser = localStorage.getItem(CURRENT_USER_KEY);
          if (savedUser) setUser(JSON.parse(savedUser));
        }
      } catch (err) {
        console.error('Failed to fetch session user:', err);
        const savedUser = localStorage.getItem(CURRENT_USER_KEY);
        if (savedUser) setUser(JSON.parse(savedUser));
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Sync session changes from other tabs/popups
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) return;
      
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        // Refresh user data after successful Google Login
        fetch('/api/auth/me')
          .then(res => res.json())
          .then(data => {
            if (data.user) {
              const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
              const existingIdx = users.findIndex((u: any) => u.email === data.user.email);
              
              let finalUser = { ...data.user };
              if (existingIdx >= 0) {
                // Preserve role from storage
                finalUser = { ...finalUser, ...users[existingIdx], role: users[existingIdx].role, isSuperAdmin: users[existingIdx].isSuperAdmin || data.user.isSuperAdmin };
                users[existingIdx] = finalUser;
              } else {
                users.push(finalUser);
              }
              localStorage.setItem(USERS_KEY, JSON.stringify(users));
              
              setUser(finalUser);
              localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(finalUser));
            }
          });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const loginWithGoogle = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Autentifikatsiya xatosi yuz berdi');
      }

      const { url } = data;
      
      const width = 600;
      const height = 700;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const authWindow = window.open(
        url,
        'google_oauth',
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow) {
        throw new Error('Iltimos, popup oynalarini ochishga ruxsat bering!');
      }
    } catch (err) {
      console.error('Google Login Start Error:', err);
      throw err;
    }
  };

  const login = async (email: string, password: string) => {
    // Simulate API call
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
          resolve();
        } else {
          reject(new Error('Email yoki parol noto\'g\'ri'));
        }
      }, 1000);
    });
  };

  const signup = async (userData: any) => {
    return new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
        if (users.find((u: any) => u.email === userData.email)) {
          reject(new Error("Ushbu email bilan allaqachon ro'yxatdan o'tilgan"));
          return;
        }

        const isSuperAdmin = userData.email === 'eyfelchik@gmail.com';
        const isAdmin = isSuperAdmin || userData.email === 'mirzayevr471@gmail.com';
        const adminAvatar = "https://image.spreadshirtmedia.net/image-server/v1/compositions/T812A2PA3811PT17X46Y41D1037385934W21927H21927/views/1,width=550,height=550,appearanceId=2,backgroundColor=000000/cute-anime-boy-poster.jpg";
        
        const avatarUrl = isSuperAdmin 
          ? adminAvatar 
          : `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`;

        const newUser = {
          id: Date.now().toString(),
          name: userData.name || 'Foydalanuvchi',
          email: userData.email,
          password: userData.password,
          avatar: avatarUrl,
          role: isAdmin ? 'admin' : 'user',
          isSuperAdmin: isSuperAdmin,
          joinedAt: new Date().toISOString().split('T')[0],
          level: 1,
          points: 0,
          history: [],
          favorites: [],
          achievements: []
        };

        users.push(newUser);
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
        
        const { password, ...userWithoutPassword } = newUser;
        setUser(userWithoutPassword);
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
        resolve();
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    fetch('/api/auth/logout', { method: 'POST' }).catch(console.error);
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
