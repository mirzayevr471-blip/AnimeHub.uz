import React, { useState } from 'react';
import { PlayCircle, X, Calendar, ListVideo, Clapperboard } from 'lucide-react';
import { Anime } from '../types';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

interface AnimeCardProps {
  anime: Anime;
  rank?: number;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, rank }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/watch/${anime.id}`);
  };

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  return (
    <>
      <div 
        onClick={handleCardClick}
        className="relative group cursor-pointer aspect-[3/4] rounded-lg overflow-hidden border border-white/5 bg-transparent block" 
        title={anime.title}
      >
        {/* Poster */}
        <img 
          src={anime.image} 
          alt={anime.title} 
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
        
        {/* Overlay Gradients */}
        <div className="absolute inset-0 card-overlay"></div>
        <div className="absolute inset-0 bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Hover Action */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 scale-90 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100 z-20">
          <button 
            type="button" 
            onClick={handlePlayClick} 
            className="focus:outline-none"
            aria-label="Qismlarni ko'rish"
          >
            <PlayCircle className="w-14 h-14 text-white shadow-2xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] fill-purple-600/90 hover:scale-110 transition-transform" />
          </button>
        </div>

        {/* Badges top left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
          {rank && (
            <div className="status-badge bg-red-600 border border-red-500/30">
              #{rank}
            </div>
          )}
          {anime.status === 'Tugallangan' ? (
            <div className="status-badge completed">
              Tugallangan
            </div>
          ) : (
            <div className="status-badge ongoing">
              Davom etayotgan
            </div>
          )}
        </div>

        {/* Bottom Text in overlay */}
        <div className="absolute bottom-3 left-3 right-3 text-sm z-10 flex flex-col">
          <div className="flex items-center gap-2 mb-1 text-[10px]">
            <span className="text-yellow-400 font-bold">★ {anime.rating.toFixed(1)}</span>
            <span className="text-gray-400 font-medium">{anime.year}</span>
          </div>
          <h3 className="text-white font-bold truncate transition-colors group-hover:text-purple-400">
            {anime.title}
          </h3>
          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-0.5 font-medium">
            {anime.type}
          </p>
        </div>
      </div>

      {/* Episodes List Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={closeModal}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
             />
             <motion.div
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="relative bg-[#0a0a0c] border border-white/10 rounded-[32px] w-full max-w-lg shadow-[0_0_100px_rgba(168,85,247,0.15)] flex flex-col max-h-[85vh] overflow-hidden"
             >
               {/* Modal Header */}
               <div className="p-6 border-b border-white/10 flex items-start justify-between bg-white/5 relative overflow-hidden">
                 <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-transparent opacity-50"></div>
                 <div className="flex gap-4 items-center relative z-10">
                   <div className="w-16 h-20 rounded-xl overflow-hidden shadow-lg border border-white/10 flex-shrink-0">
                     <img src={anime.image} alt={anime.title} className="w-full h-full object-cover" />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-white">{anime.title}</h3>
                     <p className="text-[10px] text-purple-400 font-black uppercase tracking-widest mt-1 mb-2">{anime.type} • {anime.status}</p>
                     <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
                       <span className="flex items-center gap-1.5"><ListVideo className="w-3.5 h-3.5 text-gray-500" /> {anime.episodesList?.length || 0} qism</span>
                       <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-gray-500" /> {anime.year}</span>
                     </div>
                   </div>
                 </div>
                 <button onClick={closeModal} className="text-gray-500 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10 relative z-10">
                   <X className="w-5 h-5" />
                 </button>
               </div>

               {/* Episodes List */}
               <div className="p-6 overflow-y-auto space-y-3 flex-1 custom-scrollbar">
                 <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] pl-2 mb-4">Epizodlar ro'yxati</h4>
                 {anime.episodesList && anime.episodesList.length > 0 ? (
                   anime.episodesList.map((ep) => (
                     <Link
                       key={ep.id}
                       to={`/watch/${anime.id}`}
                       onClick={(e) => e.stopPropagation()} 
                       className="group flex items-center justify-between p-4 bg-white/5 hover:bg-purple-600/20 border border-white/5 hover:border-purple-500/30 rounded-2xl transition-all"
                     >
                       <div className="flex items-center gap-4">
                         <div className="w-10 h-10 rounded-xl bg-[#0a0a0c] border border-white/5 flex items-center justify-center font-black text-gray-500 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-colors">
                           {ep.number}
                         </div>
                         <div>
                           <div className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-1">{ep.title || `${ep.number}-qism`}</div>
                           <div className="text-[10px] font-medium text-gray-500">{new Date(ep.addedAt).toLocaleDateString()}</div>
                         </div>
                       </div>
                       <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:bg-purple-500 group-hover:text-white transition-all transform opacity-0 group-hover:opacity-100 group-hover:scale-110">
                         <PlayCircle className="w-4 h-4" />
                       </div>
                     </Link>
                   ))
                 ) : (
                   <div className="py-12 flex flex-col items-center justify-center opacity-50 text-center">
                     <Clapperboard className="w-12 h-12 mb-4 text-gray-500" />
                     <h4 className="text-sm font-black uppercase tracking-widest text-gray-300 mb-1">Qismlar topilmadi</h4>
                     <p className="text-xs text-gray-500">Hozircha ushbu anime uchun qismlar qo'shilmagan.</p>
                   </div>
                 )}
               </div>
               
               {/* Modal Footer */}
               <div className="p-4 border-t border-white/10 bg-[#0a0a0c] flex justify-end">
                 <Link 
                   to={`/watch/${anime.id}`}
                   className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 group"
                 >
                   <PlayCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                   {anime.episodesList && anime.episodesList.length > 0 ? 'Boshidan Tomosha Qilish' : 'Sahifaga O\'tish'}
                 </Link>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AnimeCard;
