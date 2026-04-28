import React, { createContext, useContext, useState, useEffect } from 'react';
import { Anime, Episode } from '../types';
import { collection, onSnapshot, addDoc, deleteDoc, doc, updateDoc, query, orderBy, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { handleFirestoreError } from '../lib/firestoreUtils';

interface AnimeContextType {
  animes: Anime[];
  addAnime: (anime: Omit<Anime, 'id'>) => Promise<string>;
  deleteAnime: (id: string) => Promise<void>;
  clearAllAnimes: () => Promise<void>;
  incrementViews: (id: string) => Promise<void>;
  updateAnime: (id: string, data: Partial<Anime>) => Promise<void>;
  addEpisode: (animeId: string, episode: Omit<Episode, 'id' | 'addedAt'>) => Promise<void>;
  deleteEpisode: (animeId: string, episodeId: string) => Promise<void>;
}

const AnimeContext = createContext<AnimeContextType | undefined>(undefined);

export const AnimeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [animes, setAnimes] = useState<Anime[]>([]);

  useEffect(() => {
    const q = query(collection(db, 'animes'), orderBy('title'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const animeData: Anime[] = [];
      snapshot.forEach((doc) => {
        animeData.push({ id: doc.id, ...doc.data() } as Anime);
      });
      setAnimes(animeData);
    }, (error) => {
      handleFirestoreError(error, 'list', 'animes');
    });

    return () => unsubscribe();
  }, []);

  const addAnime = async (animeData: Omit<Anime, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, 'animes'), {
        ...animeData,
        views: animeData.views || 0,
      });
      return docRef.id;
    } catch (error) {
      handleFirestoreError(error, 'create', 'animes');
    }
  };

  const deleteAnime = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'animes', id));
    } catch (error) {
      handleFirestoreError(error, 'delete', `animes/${id}`);
    }
  };

  const clearAllAnimes = async () => {
    try {
      // Note: deleting all items in a collection should be done with care/batches
      // For this app, we'll just loop and delete for simplicity
      const deletePromises = animes.map(anime => deleteDoc(doc(db, 'animes', anime.id)));
      await Promise.all(deletePromises);
    } catch (error) {
      handleFirestoreError(error, 'delete', 'animes');
    }
  };

  const incrementViews = async (id: string) => {
    try {
      const animeRef = doc(db, 'animes', id);
      const anime = animes.find(a => a.id === id);
      if (anime) {
        await updateDoc(animeRef, { views: (anime.views || 0) + 1 });
      }
    } catch (error) {
      handleFirestoreError(error, 'update', `animes/${id}`);
    }
  };

  const updateAnime = async (id: string, data: Partial<Anime>) => {
    try {
      const animeRef = doc(db, 'animes', id);
      await updateDoc(animeRef, data);
    } catch (error) {
      handleFirestoreError(error, 'update', `animes/${id}`);
    }
  };

  const addEpisode = async (animeId: string, episodeData: Omit<Episode, 'id' | 'addedAt'>) => {
    try {
      const episodeId = Date.now().toString();
      const episodeRef = doc(db, 'animes', animeId, 'episodes', episodeId);
      const newEpisode: Episode = {
        ...episodeData,
        id: episodeId,
        addedAt: new Date().toISOString()
      };
      await setDoc(episodeRef, newEpisode);
      
      // Update episode count on anime document
      const anime = animes.find(a => a.id === animeId);
      if (anime) {
        await updateDoc(doc(db, 'animes', animeId), {
          episodes: (anime.episodes || 0) + 1
        });
      }
    } catch (error) {
      handleFirestoreError(error, 'create', `animes/${animeId}/episodes`);
    }
  };

  const deleteEpisode = async (animeId: string, episodeId: string) => {
    try {
      await deleteDoc(doc(db, 'animes', animeId, 'episodes', episodeId));
      
      const anime = animes.find(a => a.id === animeId);
      if (anime) {
        await updateDoc(doc(db, 'animes', animeId), {
          episodes: Math.max(0, (anime.episodes || 0) - 1)
        });
      }
    } catch (error) {
      handleFirestoreError(error, 'delete', `animes/${animeId}/episodes/${episodeId}`);
    }
  };

  return (
    <AnimeContext.Provider value={{ animes, addAnime, deleteAnime, clearAllAnimes, incrementViews, updateAnime, addEpisode, deleteEpisode }}>
      {children}
    </AnimeContext.Provider>
  );
};

export const useEpisodes = (animeId: string | undefined) => {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!animeId) {
      setEpisodes([]);
      setLoading(false);
      return;
    }

    const q = query(collection(db, 'animes', animeId, 'episodes'), orderBy('number'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const epData: Episode[] = [];
      snapshot.forEach((doc) => {
        epData.push({ ...doc.data() } as Episode);
      });
      setEpisodes(epData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching episodes:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [animeId]);

  return { episodes, loading };
};

export const useAnime = () => {
  const context = useContext(AnimeContext);
  if (!context) throw new Error("useAnime must be used within AnimeProvider");
  return context;
};
