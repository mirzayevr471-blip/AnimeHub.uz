import React from 'react';
import { PlayCircle } from 'lucide-react';
import { heroAnime } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative h-[320px] md:h-[400px] lg:h-[500px] w-full flex items-center overflow-hidden">
      {/* Background Image with Overlays */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={heroAnime.image} 
          alt={heroAnime.title} 
          className="w-full h-full object-cover object-center scale-105 filter brightness-75 transition-transform duration-1000"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 anime-gradient"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-4 sm:px-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-red-600 text-[10px] font-bold px-2 py-0.5 rounded text-white shadow-lg">
              TRENDING
            </span>
            <span className="text-gray-300 text-xs font-semibold tracking-wide">
              #1 O'zbekistonda
            </span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-black mb-4 leading-none text-white tracking-tight">
            {heroAnime.title.split(' ')[0]} <br className="hidden sm:block" />
            <span className="text-purple-500">{heroAnime.title.split(' ').slice(1).join(' ')}</span>
          </h1>
          
          <p className="text-gray-300 text-sm sm:text-base max-w-xl line-clamp-2 md:line-clamp-3 mb-6 leading-relaxed font-medium">
            Qudratli maxluqlar va sirli portal dunyosida omon qolish uchun kurash. Eng zaif hunterdan eng kuchliga aylanish yo'lida misli ko'rilmagan sarguzashtlarga guvoh bo'ling.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => navigate(`/watch/${heroAnime.id}`)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition-all shadow-lg shadow-purple-900/40 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlayCircle className="w-5 h-5 fill-current" />
              <span>Hozir ko‘rish</span>
            </button>
            <button 
              onClick={() => navigate(`/watch/${heroAnime.id}`)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-8 rounded-lg transition-all backdrop-blur-sm border border-white/10 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Tafsilotlar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
