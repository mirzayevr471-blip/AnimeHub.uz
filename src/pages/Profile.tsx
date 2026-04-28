import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useAnime } from '../context/AnimeContext';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimeCard from '../components/AnimeCard';
import { 
  User as UserIcon, 
  Settings, 
  Bookmark, 
  History, 
  Zap, 
  Award, 
  Calendar, 
  Edit3, 
  Shield, 
  ShieldCheck,
  Heart,
  ChevronRight,
  LogOut,
  Bell,
  Play,
  CheckCircle2,
  X,
  Star,
  Medal,
  Flame
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, UserStats, Achievement } from '../types';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { animes } = useAnime();
  const { user, updateUser } = useUser();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'favorites' | 'history' | 'settings'>('favorites');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAchievementsModal, setShowAchievementsModal] = useState(false);

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'lightning': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'star': return <Star className="w-5 h-5 text-yellow-500" />;
      case 'heart': return <Heart className="w-5 h-5 text-rose-500" />;
      case 'medal': return <Medal className="w-5 h-5 text-blue-500" />;
      case 'fire': return <Flame className="w-5 h-5 text-orange-500" />;
      default: return <Award className="w-5 h-5 text-purple-500" />;
    }
  };

  // Local form state for settings
  const [formName, setFormName] = useState(user.name);
  const [formEmail, setFormEmail] = useState(user.email);

  useEffect(() => {
    setFormName(user.name);
    setFormEmail(user.email);
  }, [user.name, user.email]);

  const stats: UserStats = useMemo(() => ({
    animeWatched: new Set(user.history.map(h => h.animeId)).size,
    episodesWatched: user.history.length,
    totalTime: `${Math.floor(user.history.length * 24 / 60)} soat`
  }), [user.history]);

  const favoriteAnimes = useMemo(() => 
    animes.filter(a => user.favorites.includes(a.id)),
  [animes, user.favorites]);

  const historyAnimes = useMemo(() => {
    const uniqueIds = Array.from(new Set(user.history.map(h => h.animeId)));
    return animes.filter(a => uniqueIds.includes(a.id));
  }, [animes, user.history]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateUser({ avatar: reader.result as string });
        // Provide immediate feedback
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveSettings = () => {
    updateUser({ name: formName, email: formEmail });
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#070708] text-white selection:bg-purple-600/30">
      <Header />

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50, x: '-50%' }}
            animate={{ opacity: 1, y: 20, x: '-50%' }}
            exit={{ opacity: 0, y: -50, x: '-50%' }}
            className="fixed top-20 left-1/2 z-[100] bg-emerald-500 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold border border-emerald-400/30 backdrop-blur-md"
          >
            <CheckCircle2 className="w-5 h-5" />
            Muvaffaqiyatli saqlandi!
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Profile Header Pattern */}
      <div className="h-64 md:h-80 w-full relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 via-blue-900/20 to-emerald-900/10" />
        <div className="absolute inset-0 bg-[#070708]/60 backdrop-blur-[2px]" />
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#070708] to-transparent" />
        
        <div className="absolute top-10 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute top-20 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <main className="max-w-screen-2xl mx-auto px-4 sm:px-8 -mt-32 relative z-10 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: User Card */}
          <div className="lg:col-span-4 xl:col-span-3 space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#0a0a0c] border border-white/5 rounded-[40px] p-8 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6">
                <div className="bg-purple-600/10 text-purple-400 p-2 rounded-xl border border-purple-500/10">
                  <Shield className="w-5 h-5" />
                </div>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[40px] p-1 bg-gradient-to-tr from-purple-600 via-blue-500 to-emerald-500 shadow-2xl shadow-purple-900/30">
                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-[36px] bg-[#0a0a0c]" referrerPolicy="no-referrer" />
                  </div>
                  
                  {/* Hidden Input for File Upload */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                  />

                  <button 
                    onClick={handleAvatarClick}
                    className="absolute -bottom-2 -right-2 bg-white text-black p-2.5 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all z-20 group-hover:bg-purple-500 group-hover:text-white"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </div>

                <div className="mt-8 space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    {user.role === 'admin' && <ShieldCheck className="w-5 h-5 text-purple-500" />}
                    <h2 className="text-2xl font-black">{user.name}</h2>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                    <Zap className="w-3.5 h-3.5 text-purple-500" />
                    {user.role === 'admin' ? 'Master Admin' : `Level ${user.level} Collector`}
                  </div>
                </div>

                {/* Level Progress */}
                <div className="w-full mt-8 space-y-2">
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-gray-500">Tajriba</span>
                    <span className="text-purple-400">{user.points} / 1000 XP</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(user.points / 1000) * 100}%` }}
                      transition={{ duration: 1, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-purple-600 to-blue-500 rounded-full" 
                    />
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 w-full gap-4 mt-8">
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('history')}
                    className="bg-white/5 p-6 rounded-[32px] border border-white/10 text-center transition-all group shadow-xl hover:shadow-purple-500/10 backdrop-blur-sm"
                  >
                    <div className="text-4xl font-black text-white group-hover:text-purple-400 transition-colors tracking-tighter">{stats.animeWatched}</div>
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-3 group-hover:text-gray-400 transition-colors">Ko'rilgan</div>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setActiveTab('history')}
                    className="bg-white/5 p-6 rounded-[32px] border border-white/10 text-center transition-all group shadow-xl hover:shadow-blue-500/10 backdrop-blur-sm"
                  >
                    <div className="text-4xl font-black text-white group-hover:text-blue-400 transition-colors tracking-tighter">{stats.episodesWatched}</div>
                    <div className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] mt-3 group-hover:text-gray-400 transition-colors">Qismlar</div>
                  </motion.button>
                </div>

                <div className="w-full pt-8 space-y-3">
                  <button 
                    onClick={() => setActiveTab('settings')}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all border ${activeTab === 'settings' ? 'bg-purple-600 text-white border-purple-500' : 'bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white'}`}
                  >
                    <span className="text-sm font-bold flex items-center gap-3">
                      <Settings className="w-4 h-4" /> Sozlamalar
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-6 py-5 bg-[#1a0a0c] text-rose-500 hover:bg-rose-500 hover:text-white rounded-[32px] transition-all border border-rose-500/20 font-black uppercase tracking-widest text-[11px] group shadow-2xl shadow-rose-950/20"
                  >
                    <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> 
                    <span>Chiqish</span>
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Achievements Snippet */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowAchievementsModal(true)}
              className="bg-gradient-to-tr from-indigo-900/20 to-purple-900/20 border border-purple-500/10 rounded-[32px] p-6 space-y-4 cursor-pointer group"
            >
              <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 flex items-center gap-2 group-hover:text-purple-300 transition-colors">
                <Award className="w-4 h-4" /> Yutuqlar
              </h3>
              <div className="flex flex-wrap gap-2">
                {user.achievements.slice(0, 3).map(ach => (
                  <div key={ach.id} className="w-10 h-10 bg-black/40 rounded-xl flex items-center justify-center border border-white/10" title={ach.title}>
                    {getAchievementIcon(ach.iconType)}
                  </div>
                ))}
                {user.achievements.length > 3 && (
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center border border-dashed border-white/10 text-gray-500 font-bold">
                    +{user.achievements.length - 3}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Achievements Modal */}
            <AnimatePresence>
              {showAchievementsModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={() => setShowAchievementsModal(false)}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                  />
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className="relative bg-[#0a0a0c] border border-white/10 p-8 rounded-[40px] max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                  >
                    <div className="flex items-center justify-between mb-8">
                      <div className="space-y-1">
                        <h3 className="text-2xl font-black uppercase tracking-tight">Barcha Yutuqlar</h3>
                        <p className="text-gray-500 text-sm font-bold uppercase tracking-widest">Jami: {user.achievements.length} ta yutuqlar ochildi</p>
                      </div>
                      <button 
                        onClick={() => setShowAchievementsModal(false)}
                        className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all border border-white/5"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="flex-1 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {user.achievements.map((ach) => (
                          <div 
                            key={ach.id}
                            className="bg-white/5 border border-white/5 p-4 rounded-3xl flex items-center gap-4 group hover:bg-white/10 transition-all"
                          >
                            <div className="w-14 h-14 bg-black/40 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                              {getAchievementIcon(ach.iconType)}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-black text-sm text-gray-100 group-hover:text-purple-400 transition-colors uppercase tracking-tight">{ach.title}</h4>
                              <p className="text-[10px] text-gray-500 font-bold mt-1 leading-tight">{ach.description}</p>
                              <div className="text-[8px] text-gray-600 mt-2 uppercase tracking-[0.2em] font-black">{ach.unlockedAt} DA OCHILGAN</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Column: Content */}
          <div className="lg:col-span-8 xl:col-span-9 space-y-8">
            
            {/* Tabs */}
            <div className="flex items-center gap-2 bg-[#0a0a0c] p-2 rounded-3xl border border-white/5 w-fit">
              <button 
                onClick={() => setActiveTab('favorites')}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'favorites' ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/30' : 'text-gray-500 hover:text-white'}`}
              >
                <span className="flex items-center gap-2"><Bookmark className="w-4 h-4" /> Sevimlilar</span>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'history' ? 'bg-purple-600 text-white shadow-xl shadow-purple-900/30' : 'text-gray-500 hover:text-white'}`}
              >
                <span className="flex items-center gap-2"><History className="w-4 h-4" /> Tarix</span>
              </button>
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
              {activeTab === 'favorites' && (
                <motion.div 
                  key="favs"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <div className="flex items-center justify-between">
                     <h3 className="text-xl font-black flex items-center gap-3">
                        <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                        Sevimli Animelar
                     </h3>
                     <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{favoriteAnimes.length} ta saqlangan</span>
                   </div>
                   
                   {favoriteAnimes.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                       {favoriteAnimes.map(anime => (
                         <AnimeCard key={anime.id} anime={anime} />
                       ))}
                     </div>
                   ) : (
                     <div className="py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center transition-all hover:bg-white/[0.07]">
                        <Bookmark className="w-16 h-16 text-gray-700 mb-4" />
                        <h4 className="text-lg font-bold text-gray-400">Hech nima topilmadi</h4>
                        <p className="text-sm text-gray-600 mt-1">Siz hali hech qanday animeni sevimlilarga qo'shmadingiz.</p>
                     </div>
                   )}
                </motion.div>
              )}

              {activeTab === 'history' && (
                <motion.div 
                  key="history"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                   <div className="flex items-center justify-between">
                     <h3 className="text-xl font-black flex items-center gap-3">
                        <History className="w-6 h-6 text-blue-500" />
                        Ko'rilganlar Tarixi
                     </h3>
                     <button className="text-[10px] font-black uppercase tracking-widest text-rose-500 px-4 py-2 bg-rose-500/10 rounded-xl hover:bg-rose-500 hover:text-white transition-all">Tozalash</button>
                   </div>
                   
                   {historyAnimes.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                       {historyAnimes.map(anime => (
                         <AnimeCard key={anime.id} anime={anime} />
                       ))}
                     </div>
                   ) : (
                     <div className="py-20 bg-white/5 rounded-[40px] border border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <Play className="w-16 h-16 text-gray-700 mb-4" />
                        <h4 className="text-lg font-bold text-gray-400">Tarix bo'sh</h4>
                        <p className="text-sm text-gray-600 mt-1">Siz hali birorta ham epizodni tomosha qilmadingiz.</p>
                     </div>
                   )}
                </motion.div>
              )}

              {activeTab === 'settings' && (
                <motion.div 
                  key="settings"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  <div className="bg-[#0a0a0c] border border-white/5 rounded-[32px] p-8 space-y-6">
                    <h4 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                      <UserIcon className="w-5 h-5 text-purple-500" /> Ma'lumotlar
                    </h4>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">To'liq ism</label>
                        <input 
                          type="text" 
                          value={formName} 
                          onChange={(e) => setFormName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Email manzil</label>
                        <input 
                          type="email" 
                          value={formEmail} 
                          onChange={(e) => setFormEmail(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all" 
                        />
                      </div>
                    </div>
                    <button 
                      onClick={handleSaveSettings}
                      className="bg-purple-600 hover:bg-purple-700 text-white w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-purple-900/30 active:scale-95"
                    >
                      Saqlash
                    </button>
                  </div>

                  <div className="bg-[#0a0a0c] border border-white/5 rounded-[32px] p-8 space-y-6">
                    <h4 className="text-lg font-black uppercase tracking-tight flex items-center gap-3">
                      <Bell className="w-5 h-5 text-blue-500" /> Bildirishnomalar
                    </h4>
                    <div className="space-y-4">
                      {[
                        { title: "Yangi epizodlar", desc: "Sevimli animelaringiz uchun" },
                        { title: "Tizim yangiliklari", desc: "Platformadagi o'zgarishlar" },
                        { title: "Chat xabarlari", desc: "Boshqa foydalanuvchilardan" }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                           <div>
                             <div className="text-sm font-bold">{item.title}</div>
                             <div className="text-[10px] text-gray-500 uppercase tracking-tighter mt-0.5">{item.desc}</div>
                           </div>
                           <div className="w-12 h-6 bg-purple-600 rounded-full relative p-1 cursor-pointer">
                              <div className="absolute right-1 top-1 bottom-1 w-4 bg-white rounded-full" />
                           </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
