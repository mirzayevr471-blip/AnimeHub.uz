import React, { createContext, useContext, useState, useEffect } from 'react';
import { Announcement } from '../types';

interface AnnouncementContextType {
  announcements: Announcement[];
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  deleteAnnouncement: (id: string) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(undefined);

const ANNOUNCEMENTS_KEY = 'anihub_announcements';

export const AnnouncementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ANNOUNCEMENTS_KEY);
      if (stored) {
        setAnnouncements(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  }, []);

  const saveAnnouncements = (newAnnouncements: Announcement[]) => {
    setAnnouncements(newAnnouncements);
    localStorage.setItem(ANNOUNCEMENTS_KEY, JSON.stringify(newAnnouncements));
  };

  const addAnnouncement = (data: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...data,
      id: Date.now().toString() + Math.random().toString(36).substring(2, 9),
      createdAt: new Date().toISOString()
    };
    saveAnnouncements([newAnnouncement, ...announcements]);
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    saveAnnouncements(
      announcements.map(a => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const deleteAnnouncement = (id: string) => {
    saveAnnouncements(announcements.filter(a => a.id !== id));
  };

  return (
    <AnnouncementContext.Provider value={{ announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement }}>
      {children}
    </AnnouncementContext.Provider>
  );
};

export const useAnnouncements = () => {
  const context = useContext(AnnouncementContext);
  if (context === undefined) {
    throw new Error('useAnnouncements must be used within an AnnouncementProvider');
  }
  return context;
};
