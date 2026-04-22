export interface Episode {
  id: string;
  number: number;
  title: string;
  videoUrl: string;
  thumbnail?: string;
  duration?: string;
  addedAt: string;
}

export interface Anime {
  id: string;
  title: string;
  image: string;
  rating: number;
  year: number;
  type: 'TV Serial' | 'Movie' | 'OVA' | 'ONA' | string;
  status: 'Davom etayotgan' | 'Tugallangan' | string;
  episodes?: number;
  episodesList?: Episode[];
  genres: string[];
  description?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'admin' | 'user';
  isSuperAdmin?: boolean;
  joinedAt: string;
  level: number;
  points: number;
  favorites: string[]; // anime IDs
  history: { animeId: string; episodeId: string; watchedAt: string }[];
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconType: 'lightning' | 'star' | 'heart' | 'medal' | 'fire';
  unlockedAt: string;
}

export interface UserStats {
  animeWatched: number;
  episodesWatched: number;
  totalTime: string;
}

export interface SupportMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  isAdmin: boolean;
}

export interface SupportChat {
  userId: string;
  userName: string;
  userAvatar?: string;
  messages: SupportMessage[];
  lastMessageAt: string;
  unreadCount?: number;
}

export interface SocialLinks {
  facebook: string;
  twitter: string;
  telegram: string;
  instagram: string;
  youtube: string;
}

export interface SiteSettings {
  siteName: string;
  siteDescription: string;
  socialLinks: SocialLinks;
  contactEmail: string;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  link?: string;
  type: 'info' | 'warning' | 'success' | 'danger';
  isActive: boolean;
  createdAt: string;
}
