import React, { createContext, useContext, useState } from 'react';
import { Anime, Episode } from '../types';
import { recentlyAdded } from '../data/mockData';

interface AnimeContextType {
  animes: Anime[];
  addAnime: (anime: Omit<Anime, 'id'>) => void;
  deleteAnime: (id: string) => void;
  updateAnime: (id: string, data: Partial<Anime>) => void;
  addEpisode: (animeId: string, episode: Omit<Episode, 'id' | 'addedAt'>) => void;
  deleteEpisode: (animeId: string, episodeId: string) => void;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const AnimeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [animes, setAnimes] = useState<Anime[]>(recentlyAdded);

  const addAnime = (anime: Omit<Anime, 'id'>) => {
    const newAnime = { ...anime, id: Date.now().toString(), episodesList: [] };
    setAnimes([newAnime, ...animes]);
  };

  const deleteAnime = (id: string) => {
    setAnimes(animes.filter(a => a.id !== id));
  };

  const updateAnime = (id: string, data: Partial<Anime>) => {
    setAnimes(animes.map(a => a.id === id ? { ...a, ...data } : a));
  };

  const addEpisode = (animeId: string, episodeData: Omit<Episode, 'id' | 'addedAt'>) => {
    setAnimes(prev => prev.map(anime => {
      if (anime.id === animeId) {
        const episodes = anime.episodesList || [];
        const newEpisode: Episode = {
          ...episodeData,
          id: Date.now().toString(),
          addedAt: new Date().toISOString()
        };
        return {
          ...anime,
          episodesList: [...episodes, newEpisode],
          episodes: (anime.episodes || 0) + 1
        };
      }
      return anime;
    }));
  };

  const deleteEpisode = (animeId: string, episodeId: string) => {
    setAnimes(prev => prev.map(anime => {
      if (anime.id === animeId) {
        const episodes = anime.episodesList || [];
        return {
          ...anime,
          episodesList: episodes.filter(e => e.id !== episodeId),
          episodes: Math.max(0, (anime.episodes || 0) - 1)
        };
      }
      return anime;
    }));
  };

  return (
    <AnimeContext.Provider value={{ animes, addAnime, deleteAnime, updateAnime, addEpisode, deleteEpisode }}>
      {children}
    </AnimeContext.Provider>
  );
};

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) throw new Error("useAnime must be used within AnimeProvider");
  return context;
};
