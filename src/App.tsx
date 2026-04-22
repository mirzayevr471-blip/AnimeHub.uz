import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimeProvider } from './context/AnimeContext';
import { SupportProvider } from './context/SupportContext';
import { UserProvider } from './context/UserContext';
import { SettingsProvider } from './context/SettingsContext';
import { AuthProvider } from './context/AuthContext';
import { AnnouncementProvider } from './context/AnnouncementContext';
import SupportWidget from './components/SupportWidget';
import AnnouncementBanner from './components/AnnouncementBanner';
import Home from './pages/Home';
import AdminLayout from './pages/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminAnimes from './pages/AdminAnimes';
import AdminAddAnime from './pages/AdminAddAnime';
import AdminSettings from './pages/AdminSettings';
import AdminEpisodes from './pages/AdminEpisodes';
import AdminEpisodesOverview from './pages/AdminEpisodesOverview';
import AdminSupport from './pages/AdminSupport';
import AdminUsers from './pages/AdminUsers';
import AdminAnnouncements from './pages/AdminAnnouncements';
import Watch from './pages/Watch';
import Profile from './pages/Profile';
import Ranking from './pages/Ranking';
import Login from './pages/Login';
import Signup from './pages/Signup';
import GlobalChat from './components/GlobalChat';

export default function App() {
  return (
    <AnimeProvider>
      <AuthProvider>
        <UserProvider>
        <SettingsProvider>
          <SupportProvider>
            <AnnouncementProvider>
            <BrowserRouter>
              <AnnouncementBanner />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/watch/:animeId" element={<Watch />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="animes" element={<AdminAnimes />} />
                  <Route path="animes/add" element={<AdminAddAnime />} />
                  <Route path="animes/:animeId/episodes" element={<AdminEpisodes />} />
                  <Route path="episodes" element={<AdminEpisodesOverview />} />
                  <Route path="support" element={<AdminSupport />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="announcements" element={<AdminAnnouncements />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>
              </Routes>
              <SupportWidget />
              <GlobalChat />
            </BrowserRouter>
            </AnnouncementProvider>
          </SupportProvider>
        </SettingsProvider>
      </UserProvider>
      </AuthProvider>
    </AnimeProvider>
  );
}
