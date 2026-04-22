import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAnime } from '../context/AnimeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { 
  Play, 
  Star, 
  Calendar, 
  Clock, 
  Share2, 
  AlertCircle, 
  ChevronRight, 
  ThumbsUp, 
  MessageSquare,
  Bookmark,
  Download,
  Eye,
  Info,
  CheckCircle2,
  Copy
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Episode } from '../types';
import { useUser } from '../context/UserContext';

export default function Watch() {
  const { animeId } = useParams();
  const { animes, updateAnime } = useAnime();
  const { addToHistory } = useUser();
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [isCinemaMode, setIsCinemaMode] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0); // Set initial likes to 0
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(0); // Initial user rating set to 0
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const anime = useMemo(() => animes.find(a => a.id === animeId), [animes, animeId]);

  const showToast = (message: string, type: 'success' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLike = () => {
    if (isLiked) {
      setLikesCount(prev => prev - 1);
      showToast("Yoqdi bekor qilindi", 'info');
    } else {
      setLikesCount(prev => prev + 1);
      showToast("Sizga yoqdi!");
    }
    setIsLiked(!isLiked);
  };

  const handleRatingSubmit = (rating: number) => {
    setUserRating(rating);
    setShowRatingModal(false);
    showToast(`Siz ${rating} ball berdingiz!`);
    
    // In a real app, you'd calculate new average rating
    if (anime) {
      const newRating = (anime.rating + rating) / 2;
      updateAnime(anime.id, { rating: Number(newRating.toFixed(1)) });
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: anime?.title,
          text: `${anime?.title} - AniHub Uz orqali tomosha qiling!`,
          url: window.location.href,
        });
      } catch (err) {
        // Fallback to copy if user cancels or error
        navigator.clipboard.writeText(window.location.href);
        showToast("Havola nusxalandi!", 'info');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast("Havola nusxalandi!", 'info');
    }
  };

  const handleWatchLater = () => {
    setIsSaved(!isSaved);
    showToast(isSaved ? "Ro'yxatdan olib tashlandi" : "Keyinroq ko'rishga qo'shildi");
  };

  const handleDownload = () => {
    showToast("Yuklab olish tayyorlanmoqda...", 'info');
    setTimeout(() => {
      showToast("Sifat: 1080p. Yuklab olish boshlandi!");
    }, 1500);
  };

  useEffect(() => {
    if (anime && anime.episodesList && anime.episodesList.length > 0 && !activeEpisode) {
      setActiveEpisode(anime.episodesList[0]);
    }
  }, [anime, activeEpisode]);

  useEffect(() => {
    if (anime && activeEpisode) {
      addToHistory(anime.id, activeEpisode.id);
    }
  }, [anime?.id, activeEpisode?.id]);

  if (!anime) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col pt-20">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-gray-600">
            <AlertCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-black mb-2">Anime topilmadi</h2>
          <p className="text-gray-500 mb-8 max-w-md">Siz so'rayotgan anime o'chirilgan yoki manzilda xatolik bor.</p>
          <Link to="/" className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-2xl font-bold transition-all shadow-xl shadow-purple-900/20">Bosh sahifaga qaytish</Link>
        </div>
        <Footer />
      </div>
    );
  }

  const relatedAnimes = animes
    .filter(a => a.id !== anime.id && (a.genres.some(g => anime.genres.includes(g)) || a.type === anime.type))
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-[#070708] text-white selection:bg-purple-600/30">
      <Header />
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className={`fixed top-20 left-1/2 z-[100] px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border backdrop-blur-md transition-colors ${
              toast.type === 'success' ? 'bg-emerald-500 text-white border-emerald-400/30' : 'bg-blue-500 text-white border-blue-400/30'
            }`}
          >
            {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background Blur */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute inset-0 scale-150 blur-[120px] opacity-20 transition-all duration-1000"
          style={{ 
            backgroundImage: `url(${anime.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#070708]/40 via-[#070708]/80 to-[#070708]" />
      </div>

      {/* Rating Modal */}
      <AnimatePresence>
        {showRatingModal && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRatingModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-[#0a0a0c] border border-white/10 p-8 rounded-[32px] max-w-sm w-full shadow-2xl space-y-6"
            >
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black uppercase tracking-tight">Animega baho bering</h3>
                <p className="text-gray-500 text-sm">O'z fikringizni bildirish uchun 1 dan 10 gacha ball tanlang</p>
              </div>
              
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <button
                    key={num}
                    onClick={() => handleRatingSubmit(num)}
                    className="aspect-square rounded-xl bg-white/5 border border-white/5 hover:bg-purple-600 hover:border-purple-500 transition-all font-black text-sm flex items-center justify-center active:scale-90"
                  >
                    {num}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => setShowRatingModal(false)}
                className="w-full py-4 text-xs font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors"
              >
                Bekor qilish
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <main className="relative z-10 pt-4 pb-20">
        <div className={`max-w-screen-2xl mx-auto px-4 sm:px-8 ${isCinemaMode ? 'max-w-none px-0 transition-all' : ''}`}>
          
          {/* Breadcrumbs */}
          {!isCinemaMode && (
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-500 mb-6 py-2">
              <Link to="/" className="hover:text-purple-400 transition-colors">Bosh sahifa</Link>
              <ChevronRight className="w-3 h-3" />
              <Link to="/?genre=Katalog" className="hover:text-purple-400 transition-colors">Katalog</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-gray-300 truncate">{anime.title}</span>
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Player Section */}
            <div className={`lg:col-span-8 xl:col-span-9 space-y-6 ${isCinemaMode ? 'lg:col-span-12 xl:col-span-12' : ''}`}>
              
              {/* Video Player Area */}
              <div className="relative group">
                <div className={`aspect-video bg-black rounded-[24px] overflow-hidden border border-white/5 shadow-2xl relative ${isCinemaMode ? 'rounded-none border-none' : ''}`}>
                  {activeEpisode ? (
                    <iframe 
                      src={activeEpisode.videoUrl}
                      className="w-full h-full border-none"
                      allowFullScreen
                      title={`${anime.title} - ${activeEpisode.number}-qism`}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
                      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center animate-pulse">
                        <Play className="w-8 h-8 text-gray-600" />
                      </div>
                      <p className="text-xs text-gray-500 uppercase tracking-widest font-black">Tez orada yuklanadi...</p>
                    </div>
                  )}
                  
                  {/* Player Controls Overlay (Fake) */}
                  <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      1080P PRO
                    </div>
                  </div>
                </div>
                
                {/* Cinema Mode Toggle */}
                <button 
                  onClick={() => setIsCinemaMode(!isCinemaMode)}
                  className="absolute bottom-6 right-6 z-20 bg-black/40 hover:bg-purple-600 backdrop-blur-md text-white p-3 rounded-2xl transition-all shadow-xl border border-white/10 hidden lg:block"
                  title="Cinema Mode"
                >
                   <Eye className={`w-5 h-5 ${isCinemaMode ? 'text-purple-400' : ''}`} />
                </button>
              </div>

              {/* Large Interactive Stats Block */}
              <div className={`flex items-center gap-4 ${isCinemaMode ? 'max-w-screen-2xl mx-auto px-8' : ''}`}>
                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowRatingModal(true)}
                  className="flex-1 bg-white/5 hover:bg-yellow-500/10 border border-white/5 hover:border-yellow-500/30 p-6 rounded-[32px] flex flex-col items-center justify-center gap-2 transition-all transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <Star className={`w-8 h-8 ${userRating !== null && userRating > 0 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-500 group-hover:text-yellow-400'}`} />
                    <span className={`text-4xl font-black ${userRating !== null && userRating > 0 ? 'text-yellow-400' : 'text-white'}`}>
                      {userRating !== null ? userRating.toFixed(1) : anime?.rating?.toFixed(1) || '0.0'}
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Anime Reytingi</span>
                </motion.button>

                <motion.button 
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`flex-1 group border p-6 rounded-[32px] flex flex-col items-center justify-center gap-2 transition-all transition-colors ${
                    isLiked 
                    ? 'bg-rose-500/10 border-rose-500/30' 
                    : 'bg-white/5 border-white/5 hover:bg-rose-500/5 hover:border-rose-500/20'
                  }`}
                >
                  <div className="flex items-center gap-2 text-white">
                    <ThumbsUp className={`w-8 h-8 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-500 group-hover:text-rose-500'}`} />
                    <span className={`text-4xl font-black ${isLiked ? 'text-rose-500' : 'text-white'}`}>
                      {likesCount >= 1000 ? (likesCount / 1000).toFixed(1) + 'k' : likesCount}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isLiked ? 'text-rose-500' : 'text-gray-500'}`}>
                    {isLiked ? 'Sizga yoqdi' : 'Yoqdi degunlar'}
                  </span>
                </motion.button>
              </div>

              {/* Anime & Episode Info */}
              <div className={`space-y-6 ${isCinemaMode ? 'max-w-screen-2xl mx-auto px-8' : ''}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-2xl md:text-3xl font-black tracking-tight">{anime.title}</h1>
                      <div className="flex items-center gap-2">
                         <div className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-xl text-xs font-black border border-purple-500/10">
                           {activeEpisode ? `${activeEpisode.number}-qism` : 'Tanlanmagan'}
                         </div>
                         <div className="bg-white/5 text-gray-400 px-3 py-1 rounded-xl text-xs font-black border border-white/5 uppercase tracking-widest">
                           {anime.type}
                         </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {anime.year}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {activeEpisode?.duration || '24:00'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleShare}
                      className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 px-6 py-3.5 rounded-2xl transition-all border border-white/5 font-bold text-sm active:scale-95"
                    >
                      <Share2 className="w-4 h-4" />
                      Ulashish
                    </button>
                    <button 
                      onClick={handleWatchLater}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl transition-all border font-bold text-sm active:scale-95 ${
                        isSaved ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/20' : 'bg-white/5 hover:bg-white/10 border-white/5 text-white'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
                      {isSaved ? 'Saqlandi' : 'Keyinroq'}
                    </button>
                    <button 
                      onClick={handleDownload}
                      className="p-3.5 bg-white/5 hover:bg-white/10 rounded-2xl transition-all border border-white/5 active:scale-95 group"
                      title="Yuklab olish"
                    >
                      <Download className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />
                    </button>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map(genre => (
                    <Link 
                      key={genre}
                      to={`/?genre=${genre}`}
                      className="text-[10px] uppercase font-black tracking-widest bg-white/5 hover:bg-purple-600/20 hover:text-purple-400 border border-white/5 rounded-full px-4 py-1.5 transition-all"
                    >
                      {genre}
                    </Link>
                  ))}
                </div>

                {/* Description Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-8 border-y border-white/5 items-start">
                  <div className="md:col-span-3 space-y-4">
                    <h3 className="text-lg font-black flex items-center gap-2 uppercase tracking-tight">
                      <Info className="w-5 h-5 text-purple-500" />
                      Anime haqida
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-sm">
                      {anime.description || "Ushbu anime haqida ma'lumot tez orada joylanadi. Sifatli tomosha va qiziqarli lahzalar sizni kutmoqda!"}
                    </p>
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-500">Holat</h3>
                     <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-bold uppercase tracking-tighter">Status</span>
                          <span className={`font-black ${anime.status === 'Tugallangan' ? 'text-blue-500' : 'text-emerald-500'}`}>{anime.status}</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-bold uppercase tracking-tighter">Studio</span>
                          <span className="font-black">AniHub Uz</span>
                        </div>
                        <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-500 font-bold uppercase tracking-tighter">Tarjima</span>
                          <span className="font-black">O'zbek Tilida</span>
                        </div>
                     </div>
                  </div>
                </div>

                {/* Comments Mockup */}
                <div className="space-y-8 pt-8">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black flex items-center gap-2">
                       <MessageSquare className="w-6 h-6 text-purple-500" />
                       Fikrlar 
                       <span className="text-sm font-bold text-gray-500 ml-2">(42)</span>
                    </h3>
                    <select className="bg-white/5 border border-white/5 text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl outline-none">
                      <option>Eng so'nggi</option>
                      <option>Eng ommabop</option>
                    </select>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center font-black flex-shrink-0">
                      MK
                    </div>
                    <div className="flex-1 space-y-3">
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-purple-500 transition-all min-h-[100px] placeholder:text-gray-700" 
                        placeholder="Ushbu anime haqidagi fikringizni qoldiring..."
                      />
                      <div className="flex justify-end">
                        <button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-900/20">
                          Yuborish
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Section */}
            {!isCinemaMode && (
              <div className="lg:col-span-4 xl:col-span-3 space-y-8">
                
                {/* Episodes Selector */}
                <div className="bg-[#0a0a0c] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl flex flex-col h-[600px]">
                  <div className="p-6 border-b border-white/5 bg-white/[0.02]">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black flex items-center gap-2 uppercase tracking-wide">
                        <Play className="w-4 h-4 text-purple-500 fill-purple-500" />
                        Epizodlar
                      </h3>
                      <span className="text-[10px] font-black bg-purple-600/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/10 tracking-widest">
                        {anime.episodesList?.length || 0} QISM
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
                    {anime.episodesList && anime.episodesList.length > 0 ? (
                      anime.episodesList.map((ep) => (
                        <button
                          key={ep.id}
                          onClick={() => setActiveEpisode(ep)}
                          className={`w-full flex items-center gap-4 p-3 rounded-2xl border transition-all group overflow-hidden relative ${
                             activeEpisode?.id === ep.id 
                               ? 'bg-purple-600/20 border-purple-500/30 text-white' 
                               : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:text-gray-300'
                          }`}
                        >
                          <div className="w-20 h-14 rounded-xl overflow-hidden bg-black/40 flex-shrink-0 relative border border-white/5">
                            <img src={ep.thumbnail || anime.image} alt={ep.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                            {activeEpisode?.id === ep.id && (
                              <div className="absolute inset-0 bg-purple-600/60 flex items-center justify-center">
                                <Play className="w-5 h-5 fill-white text-white animate-pulse" />
                              </div>
                            )}
                            <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-black text-white">
                              {ep.duration || '24:00'}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0 text-left">
                            <div className="text-xs font-black truncate">{ep.title}</div>
                            <div className="text-[9px] font-bold uppercase tracking-widest mt-1 opacity-60">#{ep.number}-qism</div>
                          </div>
                        </button>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30">
                        <AlertCircle className="w-12 h-12 mb-4" />
                        <p className="text-[10px] font-black uppercase tracking-widest">Hozircha qismlar yo'q</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Related Sidebar */}
                <div className="space-y-6 pt-4">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gray-500 border-b border-white/5 pb-4">O'xshash animelar</h3>
                  <div className="space-y-4">
                    {relatedAnimes.map((item) => (
                      <Link 
                        key={item.id} 
                        to={`/watch/${item.id}`}
                        className="flex gap-4 group p-2 -mx-2 rounded-2xl hover:bg-white/5 transition-all"
                      >
                        <div className="w-16 h-24 rounded-xl overflow-hidden shadow-xl border border-white/5 flex-shrink-0">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h4 className="text-[13px] font-black transition-colors group-hover:text-purple-400 truncate mb-1">{item.title}</h4>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <span className="text-yellow-400">★ {item.rating.toFixed(1)}</span>
                            <span>{item.year}</span>
                            <span>{item.type}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                             {item.genres.slice(0, 2).map(g => (
                               <span key={g} className="text-[8px] bg-white/5 px-2 py-0.5 rounded-md border border-white/5">{g}</span>
                             ))}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
