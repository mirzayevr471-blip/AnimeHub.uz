import React, { useState, useEffect } from 'react';
import { useAnime } from '../context/AnimeContext';
import { Trophy, Flame, Timer, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

export default function TopTenRanking() {
  const { animes } = useAnime();
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState('4d 12h 30m');

  // Sort animes by rating as a mock for "popularity"
  const topAnimes = [...animes]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 10);

  // Mock countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      // In a real app, this would calculate actual time until next Sunday midnight
      // For now we just show it's "Weekly"
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="mt-12 group">
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-500" />
            Haftalik Top 10
          </h2>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
            <Timer className="w-3 h-3 text-purple-500" />
            Yangilanishga: <span className="text-purple-400">{timeLeft}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-black text-rose-500 bg-rose-500/10 px-2 py-1 rounded-full animate-pulse">
           <Flame className="w-3 h-3" /> HOT
        </div>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {topAnimes.map((anime, idx) => (
            <motion.div
              key={anime.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => navigate(`/watch/${anime.id}`)}
              className="relative flex items-center gap-4 group/item cursor-pointer p-3 rounded-[20px] bg-white/[0.02] border border-white/[0.03] hover:bg-white/[0.08] hover:border-purple-500/30 transition-all duration-300"
            >
              {/* Rank Badge */}
              <div className={`w-10 h-10 flex-shrink-0 flex items-center justify-center font-black text-xl rounded-2xl ${
                idx === 0 ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.4)]' :
                idx === 1 ? 'bg-slate-300 text-black shadow-[0_0_15px_rgba(203,213,225,0.4)]' :
                idx === 2 ? 'bg-amber-700 text-white shadow-[0_0_15px_rgba(180,83,9,0.4)]' :
                'bg-white/5 text-gray-500 group-hover/item:text-white transition-colors'
              }`}>
                {idx + 1}
              </div>

              {/* Thumbnail */}
              <div className="relative w-12 h-16 bg-white/5 rounded-xl overflow-hidden border border-white/5 flex-shrink-0">
                <img 
                  src={anime.image} 
                  alt={anime.title} 
                  className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" 
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>

              {/* Info */}
              <div className="min-w-0 flex-1">
                <div className="text-sm font-black text-gray-200 truncate group-hover/item:text-purple-400 transition-colors">
                  {anime.title}
                </div>
                <div className="flex items-center gap-3 mt-1">
                  <div className="text-[10px] font-bold text-yellow-500 flex items-center gap-1 bg-yellow-500/10 px-1.5 py-0.5 rounded-lg border border-yellow-500/10">
                    ★ {anime.rating.toFixed(1)}
                  </div>
                  <div className="text-[9px] font-bold text-gray-500 uppercase tracking-tighter">
                    {anime.type}
                  </div>
                </div>
              </div>

              <div className="opacity-0 group-hover/item:opacity-100 transition-all -translate-x-2 group-hover/item:translate-x-0 pr-1">
                <ChevronRight className="w-4 h-4 text-purple-500" />
              </div>
              
              {/* Highlight Background on Top 3 */}
              {idx < 3 && (
                <div className={`absolute inset-0 rounded-[20px] opacity-0 group-hover/item:opacity-5 transition-opacity blur-sm ${
                  idx === 0 ? 'bg-yellow-500' :
                  idx === 1 ? 'bg-slate-300' :
                  'bg-amber-700'
                }`} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button 
        onClick={() => navigate('/ranking')}
        className="w-full mt-6 py-4 rounded-2xl bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white hover:bg-purple-600/20 hover:border-purple-500/20 transition-all duration-300 shadow-xl shadow-black/20"
      >
        To'liq Reytingni Ko'rish
      </button>
    </section>
  );
}
