import React, { createContext, useContext, useState } from 'react';
import { SiteSettings } from '../types';

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => void;
  updateSocialLinks: (newLinks: Partial<SiteSettings['socialLinks']>) => void;
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'AnimeHub.uz',
  siteDescription: "O'zbekistondagi eng yirik anime portali. Eng so'nggi va eng mashhur animelarni yuqori sifatli subtitrlar va dublyaj bilan tomosha qiling.",
  contactEmail: 'admin@animehub.uz',
  socialLinks: {
    facebook: '',
    twitter: '',
    telegram: '',
    instagram: '',
    youtube: '',
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  const updateSettings = (newSettings: Partial<SiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const updateSocialLinks = (newLinks: Partial<SiteSettings['socialLinks']>) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: { ...prev.socialLinks, ...newLinks }
    }));
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateSocialLinks }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
