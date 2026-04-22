import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnime } from '../context/AnimeContext';
import { Search, Video, ChevronRight, Play, Film, Star } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminEpisodesOverview() {
  const { animes } = useAnime();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAnimes = animes.filter(anime => 
    anime.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Epizodlar Boshqaruvi</h2>
          <p className="text-gray-400 text-sm mt-1">Epizodlarni boshqarish uchun kerakli animeni tanlang.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative group max-w-xl">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
        <input 
          type="text" 
          placeholder="Anime nomi bo'yicha qidirish..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0a0a0c] border border-white/5 rounded-2xl px-12 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all font-medium text-gray-200"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredAnimes.map((anime, idx) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.05 }}
            key={anime.id} 
            className="group relative bg-[#0a0a0c] rounded-[32px] border border-white/5 p-4 hover:border-purple-500/30 transition-all duration-500 cursor-pointer overflow-hidden"
            onClick={() => navigate(`/admin/animes/${anime.id}/episodes`)}
          >
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex gap-4 items-start relative z-10">
              <div className="w-20 h-28 rounded-2xl overflow-hidden flex-shrink-0 shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
                <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0 py-1">
                <h3 className="font-black text-white text-sm truncate group-hover:text-purple-400 transition-colors mb-2 uppercase tracking-tight">
                  {anime.title}
                </h3>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="bg-purple-600/10 text-purple-400 px-2.5 py-1 rounded-lg text-[10px] font-black border border-purple-500/10 uppercase tracking-widest">
                      {anime.episodesList?.length || 0} QISM
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-black">
                      <Star className="w-3 h-3 fill-yellow-500" />
                      {anime.rating}
                    </div>
                  </div>
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                    Oxirgi: {anime.episodesList && anime.episodesList.length > 0 ? `#${anime.episodesList[anime.episodesList.length-1].number}` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between pt-4 border-t border-white/5 relative z-10">
              <span className={`text-[9px] font-black uppercase tracking-widest ${anime.status === 'Tugallangan' ? 'text-blue-500' : 'text-emerald-500'}`}>
                {anime.status}
              </span>
              <div className="flex items-center gap-1 text-purple-500 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-1 transition-transform">
                Boshqarish <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredAnimes.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
          <Film className="w-16 h-16 text-gray-700 mb-4" />
          <h3 className="text-xl font-bold">Hech qanday anime topilmadi</h3>
          <p className="text-sm text-gray-500">Qidiruv so'zini tekshiring yoki yangi anime qo'shing.</p>
        </div>
      )}
    </div>
  );
}
