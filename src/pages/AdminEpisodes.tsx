import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAnime } from '../context/AnimeContext';
import { ChevronLeft, Plus, Trash2, Video, List, Calendar, Hash, Type, Loader2, Check, Play, Image as ImageIcon, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Episode } from '../types';

export default function AdminEpisodes() {
  const { animeId } = useParams();
  const navigate = useNavigate();
  const { animes, addEpisode, deleteEpisode } = useAnime();
  
  const anime = animes.find(a => a.id === animeId);
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [playingEpisode, setPlayingEpisode] = useState<Episode | null>(null);

  const [formData, setFormData] = useState({
    number: (anime?.episodesList?.length || 0) + 1,
    title: '',
    videoUrl: '',
    thumbnail: '',
    duration: '24:00'
  });

  if (!anime) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mb-6 text-rose-500">
          <Trash2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl font-black mb-2">Anime topilmadi</h2>
        <p className="text-gray-500 text-sm mb-8">Siz qidirayotgan anime o'chirilgan yoki ID ramzi noto'g'ri.</p>
        <button onClick={() => navigate('/admin/animes')} className="bg-white/5 hover:bg-white/10 px-8 py-3 rounded-2xl font-bold transition-all">Orqaga qaytish</button>
      </div>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    setTimeout(() => {
      addEpisode(anime.id, {
        number: Number(formData.number),
        title: formData.title || `${formData.number}-qism`,
        videoUrl: formData.videoUrl,
        thumbnail: formData.thumbnail || anime.image,
        duration: formData.duration
      });
      
      setIsLoading(false);
      setShowSuccess(true);
      setFormData({
        number: (anime.episodesList?.length || 0) + 2,
        title: '',
        videoUrl: '',
        thumbnail: '',
        duration: '24:00'
      });
      setIsAdding(false);
      
      setTimeout(() => setShowSuccess(false), 3000);
    }, 800);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 right-8 z-[100] bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 font-bold text-sm"
          >
            <Check className="w-5 h-5" />
            Epizod muvaffaqiyatli qo'shildi!
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/animes')}
            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-2xl font-black truncate max-w-[300px]">{anime.title}</h2>
            <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Epizodlar Boshqaruvi</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-purple-900/30 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Yangi Epizod
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Column */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0a0a0c] rounded-[32px] border border-white/5 p-6 overflow-hidden relative">
            <div className="absolute -right-4 -top-4 w-32 h-32 bg-purple-600/10 blur-3xl rounded-full"></div>
            <img src={anime.image} alt={anime.title} className="w-full aspect-[3/4] object-cover rounded-2xl mb-6 shadow-2xl" referrerPolicy="no-referrer" />
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 text-gray-400">
                  <List className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tighter">Jami qismlar</span>
                </div>
                <span className="text-lg font-black text-white">{anime.episodesList?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-tighter">Oxirgi yangilanish</span>
                </div>
                <span className="text-xs font-black text-white">Shu bugun</span>
              </div>
            </div>
          </div>
        </div>

        {/* List Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#0a0a0c] rounded-[32px] border border-white/5 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <h3 className="text-lg font-black">Epizodlar Ro'yxati</h3>
              <div className="text-[10px] font-black bg-purple-600/10 text-purple-400 px-3 py-1 rounded-full border border-purple-500/10 uppercase tracking-widest">
                {anime.episodesList?.length || 0} TA QISM
              </div>
            </div>
            
            <div className="p-6">
              {!anime.episodesList || anime.episodesList.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-600">
                    <Video className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-gray-400">Hech qanday epizod yo'q</h4>
                    <p className="text-xs text-gray-600 mt-1 uppercase tracking-widest">Yangi epizod qo'shish tugmasini bosing</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {anime.episodesList.map((ep, idx) => (
                    <motion.div 
                      key={ep.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 group hover:bg-white/10 transition-all"
                    >
                      <div className="relative group/thumb w-24 h-16 rounded-xl overflow-hidden bg-purple-600/10 border border-purple-500/10 group-hover:border-purple-500/30 transition-all flex-shrink-0">
                        <img 
                          src={ep.thumbnail || anime.image} 
                          alt={ep.title} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 transition-opacity flex items-center justify-center">
                          <button 
                            onClick={() => setPlayingEpisode(ep)}
                            className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white shadow-lg"
                          >
                            <Play className="w-4 h-4 fill-white" />
                          </button>
                        </div>
                        <div className="absolute bottom-1 right-1 bg-black/60 px-1.5 py-0.5 rounded text-[8px] font-black text-white backdrop-blur-md">
                          {ep.number}-QISM
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate group-hover:text-purple-400 transition-colors flex items-center gap-2">
                          {ep.title}
                          <span className="text-[10px] text-gray-500 font-normal">#{ep.number}</span>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-gray-500 font-bold uppercase tracking-tighter mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(ep.addedAt).toLocaleDateString()}</span>
                          <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                          <span className="flex items-center gap-1"><Video className="w-3 h-3" /> {ep.duration || '24:00'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => setPlayingEpisode(ep)}
                          className="p-3 text-gray-500 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-xl transition-all"
                          title="Tomosha qilish"
                        >
                          <Play className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => deleteEpisode(anime.id, ep.id)}
                          className="p-3 text-gray-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                          title="O'chirish"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl" 
              onClick={() => setIsAdding(false)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#0a0a0c] border border-white/10 rounded-[40px] w-full max-w-xl overflow-hidden shadow-[0_0_100px_rgba(124,58,237,0.15)]"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black">Yangi Epizod</h3>
                  <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Har bir maydonni to'ldiring</p>
                </div>
                <div className="w-12 h-12 bg-purple-600/10 rounded-2xl flex items-center justify-center text-purple-500">
                  <Video className="w-6 h-6" />
                </div>
              </div>

              <form onSubmit={handleAdd} className="p-8 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Hash className="w-3 h-3 text-purple-400" />
                       Qism raqami
                    </label>
                    <input 
                      required 
                      type="number" 
                      value={formData.number}
                      onChange={e => setFormData({...formData, number: Number(e.target.value)})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Type className="w-3 h-3 text-purple-400" />
                       Sarlavha
                    </label>
                    <input 
                      type="text" 
                      value={formData.title}
                      placeholder={`${formData.number}-qism`}
                      onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all placeholder:text-gray-700" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <Video className="w-3 h-3 text-purple-400" />
                       Video Havolasi (URL)
                    </label>
                    <input 
                      required 
                      type="url" 
                      value={formData.videoUrl}
                      onChange={e => setFormData({...formData, videoUrl: e.target.value})}
                      placeholder="https://myvideo.com/embed/..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all placeholder:text-gray-700" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                       <ImageIcon className="w-3 h-3 text-purple-400" />
                       Thumbnail (Poster) URL
                    </label>
                    <input 
                      type="url" 
                      value={formData.thumbnail}
                      onChange={e => setFormData({...formData, thumbnail: e.target.value})}
                      placeholder="Ushbu qism uchun muqova..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all placeholder:text-gray-700" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Davomiyligi (min:sec)</label>
                  <input 
                    type="text" 
                    value={formData.duration}
                    onChange={e => setFormData({...formData, duration: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all" 
                  />
                </div>

                <div className="pt-4 flex gap-4">
                  <button 
                    type="button" 
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold transition-all"
                  >
                    Bekor Qilish
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="flex-2 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm transition-all shadow-2xl shadow-purple-900/40 flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "EPIZODNI QO'SHISH"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Playback Modal */}
      <AnimatePresence>
        {playingEpisode && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-3xl" 
              onClick={() => setPlayingEpisode(null)}
            ></motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 40 }}
              className="relative w-full max-w-5xl aspect-video bg-black rounded-[40px] overflow-hidden border border-white/10 shadow-[0_0_100px_rgba(124,58,237,0.3)]"
            >
              <div className="absolute top-0 left-0 right-0 p-6 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between pointer-events-none">
                <div>
                  <h3 className="text-xl font-black text-white">{playingEpisode.title}</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{anime.title} • {playingEpisode.number}-qism</p>
                </div>
                <button 
                  onClick={() => setPlayingEpisode(null)}
                  className="w-12 h-12 flex items-center justify-center bg-black/40 hover:bg-rose-500 text-white rounded-2xl transition-all pointer-events-auto backdrop-blur-md"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              <iframe 
                src={playingEpisode.videoUrl}
                className="w-full h-full"
                allowFullScreen
                title={playingEpisode.title}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
