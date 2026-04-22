import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { useAnime } from '../context/AnimeContext';
import { Star, TrendingUp, Trophy, Flame, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';

const RankingPage = () => {
  const { animes } = useAnime();
  
  // Sort all animes by rating for the full leaderboard
  const topAnimes = [...animes].sort((a, b) => b.rating - a.rating);

  const getRankColor = (index: number) => {
    if (index === 0) return 'from-yellow-400 to-amber-600';
    if (index === 1) return 'from-slate-300 to-slate-500';
    if (index === 2) return 'from-orange-400 to-orange-700';
    return 'from-purple-500/20 to-purple-900/20';
  };

  const getRankShadow = (index: number) => {
    if (index === 0) return 'shadow-yellow-500/20';
    if (index === 1) return 'shadow-slate-400/20';
    if (index === 2) return 'shadow-orange-500/20';
    return 'shadow-transparent';
  };

  return (
    <div className="min-h-screen bg-brand-bg text-white selection:bg-purple-600/30">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-8 pt-24 pb-20">
        {/* Hero Header */}
        <section className="relative rounded-[40px] overflow-hidden mb-12 p-8 md:p-16 border border-white/5 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-transparent to-transparent z-0" />
          <div className="absolute -right-20 -top-20 w-96 h-96 bg-purple-600/20 blur-[120px] rounded-full animate-pulse" />
          
          <div className="relative z-10 flex flex-col items-center text-center space-y-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-xl shadow-purple-900/40"
            >
              <Trophy className="w-10 h-10 text-white" />
            </motion.div>
            
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black tracking-tight uppercase">To'liq Reyting</h1>
              <p className="text-gray-400 font-medium max-w-xl mx-auto text-sm md:text-base">
                AniHub Uz platformasidagi eng yuqori baholangan va ommabop animelar ro'yxati. Reyting har hafta yangilanadi.
              </p>
            </div>

            <div className="flex items-center gap-6 pt-4">
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-white">{animes.length}</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Animelar</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-purple-400">#1</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Trend</span>
              </div>
              <div className="w-px h-8 bg-white/10" />
              <div className="flex flex-col items-center">
                <span className="text-2xl font-black text-emerald-400">Top 100</span>
                <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">Sifat</span>
              </div>
            </div>
          </div>
        </section>

        {/* Leaderboard Table */}
        <div className="space-y-4">
          <div className="grid grid-cols-12 px-6 pb-2 text-[10px] font-black uppercase tracking-widest text-gray-500">
            <div className="col-span-1 hidden md:block">#</div>
            <div className="col-span-6 md:col-span-8">Anime</div>
            <div className="col-span-3 md:col-span-2 text-center">Baho</div>
            <div className="col-span-3 md:col-span-1 text-right">Status</div>
          </div>

          <div className="space-y-3">
            {topAnimes.map((anime, index) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link 
                  to={`/watch/${anime.id}`}
                  className={`group relative grid grid-cols-12 items-center bg-[#0a0a0c] hover:bg-white/[0.03] border border-white/5 p-4 rounded-3xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-xl ${getRankShadow(index)}`}
                >
                  {/* Rank Badge */}
                  <div className="col-span-1 hidden md:flex items-center justify-center">
                    <span className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-lg bg-gradient-to-br ${getRankColor(index)}`}>
                      {index + 1}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="col-span-6 md:col-span-8 flex items-center gap-4">
                    <div className="w-14 h-20 md:w-16 md:h-24 rounded-2xl overflow-hidden shadow-2xl border border-white/10 flex-shrink-0 relative group-hover:border-purple-500/30 transition-colors">
                      <img 
                        src={anime.image} 
                        alt={anime.title} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        referrerPolicy="no-referrer"
                      />
                      {index < 3 && (
                        <div className="absolute top-1 left-1">
                          <Flame className="w-4 h-4 text-orange-500 fill-orange-500 drop-shadow-lg" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm md:text-lg font-black tracking-tight truncate group-hover:text-purple-400 transition-colors">
                          {anime.title}
                        </h3>
                        {index === 0 && <span className="bg-yellow-500/10 text-yellow-500 text-[8px] font-black px-2 py-0.5 rounded-full border border-yellow-500/20 uppercase tracking-widest hidden sm:block">Legend</span>}
                      </div>
                      <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                        <span>{anime.year}</span>
                        <span>•</span>
                        <span>{anime.type}</span>
                        <span className="hidden sm:inline">•</span>
                        <div className="hidden sm:flex flex-wrap gap-1">
                          {anime.genres.slice(0, 2).map(g => (
                            <span key={g} className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">{g}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="col-span-3 md:col-span-2 flex flex-col items-center justify-center">
                    <div className="flex items-center gap-1.5 text-yellow-400 mb-1">
                      <Star className="w-4 h-4 fill-yellow-400" />
                      <span className="text-lg md:text-xl font-black">{anime.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[8px] font-black uppercase tracking-widest text-gray-600">O'rtacha baho</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-3 md:col-span-1 flex flex-col items-end justify-center pr-4">
                    <ChevronRight className="w-5 h-5 text-gray-700 group-hover:text-purple-500 group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RankingPage;
