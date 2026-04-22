import React from 'react';
import { PlayCircle } from 'lucide-react';
import { Anime } from '../types';
import { Link } from 'react-router-dom';

interface AnimeCardProps {
  anime: Anime;
  rank?: number;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ anime, rank }) => {
  return (
    <Link 
      to={`/watch/${anime.id}`}
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
        <PlayCircle className="w-14 h-14 text-white shadow-2xl drop-shadow-[0_0_10px_rgba(0,0,0,0.5)] fill-purple-600/90" />
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
    </Link>
  );
};

export default AnimeCard;
