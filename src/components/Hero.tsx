import React, { useState, useEffect } from 'react';
import { Play, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAnime } from '../context/AnimeContext';
import { motion, AnimatePresence } from 'motion/react';

const Hero = () => {
  const navigate = useNavigate();
  const { animes } = useAnime();
  const [currentSlide, setCurrentSlide] = useState(0);

  // We take the top 6 highest-rated animes or recent ones as hero slides.
  const heroSlides = animes
    .filter(a => a.rating >= 8.5)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  useEffect(() => {
    if (heroSlides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

  if (heroSlides.length === 0) return null;

  const currentAnime = heroSlides[currentSlide];

  const handleWatch = () => {
    navigate(`/watch/${currentAnime.id}`);
  };

  return (
    <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Main Container mimicking the rounded card from the screenshot */}
      <div className="relative bg-[#070709] rounded-[40px] overflow-hidden border border-white/5 py-12 md:py-20 px-8 md:px-16 lg:px-24">
        
        {/* Glowing floating blur dots for background details */}
        <div className="absolute top-[20%] left-[45%] w-4 h-4 bg-orange-500 rounded-full blur-[6px] opacity-40"></div>
        <div className="absolute bottom-[20%] left-[10%] w-3 h-3 bg-blue-400 rounded-full blur-[4px] opacity-30"></div>
        <div className="absolute top-[10%] right-[30%] w-2 h-2 bg-blue-500 rounded-full blur-[3px] opacity-50"></div>
        <div className="absolute bottom-[10%] left-[55%] w-3 h-3 bg-yellow-600 rounded-full blur-[5px] opacity-40"></div>
        <div className="absolute top-[60%] right-[10%] w-4 h-4 bg-sky-600 rounded-full blur-[8px] opacity-30"></div>
        <div className="absolute bottom-[30%] left-[80%] w-2 h-2 bg-blue-500 rounded-full blur-[4px] opacity-50"></div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={currentAnime.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-24"
          >
            {/* Left side: Information */}
            <div className="flex-1 max-w-2xl">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[44px] font-black mb-6 text-white leading-tight uppercase tracking-wide">
                {currentAnime.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {currentAnime.genres[0] && (
                  <span className="px-5 py-2 rounded-full border border-blue-500/20 bg-[#111] text-blue-500 text-[10px] font-black uppercase tracking-widest shadow-[0_0_15px_rgba(59,130,246,0.05)]">
                    {currentAnime.genres[0]}
                  </span>
                )}
                <span className="px-5 py-2 rounded-full border border-white/10 bg-[#111] text-gray-300 text-[10px] font-black uppercase tracking-widest">
                  {currentAnime.type}
                </span>
                <span className="px-5 py-2 rounded-full border border-white/10 bg-[#111] text-gray-300 text-[10px] font-black uppercase tracking-widest">
                  {currentAnime.year}
                </span>
              </div>
              
              <p className="text-gray-400 text-xs sm:text-sm md:text-[15px] leading-relaxed font-medium mb-10 max-w-[600px]">
                {currentAnime.description || "Ushbu anime tez orada to'liq ma'lumotlar bilan to'ldiriladi. Qo'shimcha epizodlar va voqealar rivoji uchun bizni kuzatib boring."}
              </p>

              <div className="flex items-center gap-5">
                <button 
                  onClick={handleWatch}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-widest py-3 sm:py-4 px-8 sm:px-10 rounded-full flex items-center gap-3 transition-transform hover:scale-105 active:scale-95 shadow-xl shadow-blue-600/20"
                >
                  <Play className="w-4 h-4 fill-current" />
                  MA'LUMOT
                </button>
                
                <button className="w-12 h-12 rounded-full border border-white/10 bg-transparent hover:bg-white/5 flex items-center justify-center transition-colors group">
                  <Heart className="w-4 h-4 text-gray-400 group-hover:text-red-500 transition-colors" />
                </button>
              </div>
            </div>

            {/* Right side: Poster */}
            <div className="w-full max-w-[300px] sm:max-w-[340px] lg:max-w-[380px] xl:max-w-[420px] aspect-[3/4] flex-shrink-0 relative group">
              {/* Subtle backglow for the image */}
              <div className="absolute inset-4 bg-white/20 blur-[50px] rounded-full group-hover:bg-blue-500/20 transition-colors duration-700"></div>
              
              <img 
                src={currentAnime.image} 
                alt={currentAnime.title} 
                className="relative w-full h-full object-cover rounded-[32px] shadow-2xl border border-white/5"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Custom Pagination */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide 
                  ? 'w-6 h-1.5 bg-blue-600 shadow-[0_0_10px_rgba(59,130,246,0.5)]' 
                  : 'w-1.5 h-1.5 bg-gray-600 hover:bg-gray-400'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Hero;
