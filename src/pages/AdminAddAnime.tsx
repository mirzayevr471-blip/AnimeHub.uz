import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnime } from '../context/AnimeContext';
import { ChevronLeft, Plus, X, Upload, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminAddAnime() {
  const navigate = useNavigate();
  const { addAnime } = useAnime();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [sendToTelegram, setSendToTelegram] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    image: '',
    rating: '8.0',
    year: new Date().getFullYear().toString(),
    type: 'TV Serial',
    status: 'Davom etayotgan',
    genres: [] as string[]
  });

  const [genreInput, setGenreInput] = useState('');

  const types = ['TV Serial', 'Movie', 'OVA', 'ONA'];
  const statuses = [
    { label: 'Ongoing', value: 'Davom etayotgan' },
    { label: 'Completed', value: 'Tugallangan' }
  ];

  const handleAddGenre = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && genreInput.trim()) {
      e.preventDefault();
      if (!formData.genres.includes(genreInput.trim())) {
        setFormData({ ...formData, genres: [...formData.genres, genreInput.trim()] });
      }
      setGenreInput('');
    }
  };

  const removeGenre = (genre: string) => {
    setFormData({ ...formData, genres: formData.genres.filter(g => g !== genre) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newId = addAnime({
        title: formData.title,
        image: formData.image,
        rating: parseFloat(formData.rating),
        year: parseInt(formData.year),
        type: formData.type,
        status: formData.status,
        genres: formData.genres
      });

      if (sendToTelegram) {
        await fetch('/api/admin/telegram/notify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            animeId: newId,
            title: formData.title,
            imageUrl: formData.image,
            genres: formData.genres,
            type: formData.type,
            status: formData.status
          })
        }).catch(err => console.error("Telegram error:", err)); // Error silent to not block local success
      }

      setSuccess(true);
      setTimeout(() => {
        navigate('/admin/animes');
      }, 1500);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/admin/animes')}
            className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/5"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-3xl font-black tracking-tight flex items-center gap-3">
              Yangi Anime <span className="text-blue-500">Qo'shish</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1">Platformaga yangi kontent qo'shish jarayoni.</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Image Preview */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-[#0a0a0c] p-6 rounded-[32px] border border-white/5 space-y-4">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-2">Poster Preview</h3>
            <div className="aspect-[3/4] rounded-2xl bg-white/5 border border-dashed border-white/10 overflow-hidden flex items-center justify-center relative group">
              {formData.image ? (
                <img 
                  src={formData.image} 
                  alt="Preview" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541562232579-512a21360020?q=80&w=2670&auto=format&fit=crop';
                  }}
                />
              ) : (
                <div className="text-center p-6">
                  <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <Upload className="w-6 h-6 text-gray-500" />
                  </div>
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Rasm URL manzilini kiriting</p>
                </div>
              )}
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl flex gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-[10px] text-blue-300 font-medium leading-relaxed">
                Optimal poster o'lchami: 600x800px. URL manzili rasm formatida (.jpg, .png) bo'lishi kerak.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Form Fields */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-[#0a0a0c] p-8 rounded-[32px] border border-white/5 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Sarlavha</label>
                <input 
                  required
                  type="text" 
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Anime nomini kiriting..." 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all font-medium text-white placeholder:text-gray-600"
                />
              </div>

              {/* Image URL */}
              <div className="md:col-span-2 space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Poster URL</label>
                <input 
                  required
                  type="url" 
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://example.com/poster.jpg" 
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all font-medium text-white placeholder:text-gray-600"
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Reyting</label>
                <input 
                  required
                  type="number" 
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all font-medium text-white"
                />
              </div>

              {/* Year */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Yil</label>
                <input 
                  required
                  type="number" 
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all font-medium text-white"
                />
              </div>

              {/* Type */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Turi</label>
                <select 
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium text-white appearance-none cursor-pointer"
                >
                  {types.map(t => <option key={t} value={t} className="bg-[#0a0a0c]">{t}</option>)}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Status</label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-blue-500 transition-all font-medium text-white appearance-none cursor-pointer"
                >
                  {statuses.map(s => <option key={s.value} value={s.value} className="bg-[#0a0a0c]">{s.label}</option>)}
                </select>
              </div>

              {/* Genres Tag Input */}
              <div className="md:col-span-2 space-y-4">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-1">Janrlar</label>
                <div className="space-y-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      value={genreInput}
                      onChange={(e) => setGenreInput(e.target.value)}
                      onKeyDown={handleAddGenre}
                      placeholder="Janr qo'shing va Enter tugmasini bosing..." 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all font-medium text-white placeholder:text-gray-600"
                    />
                    <Plus className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                  
                  <div className="flex flex-wrap gap-2 min-h-12 p-1">
                    <AnimatePresence>
                      {formData.genres.map((genre) => (
                        <motion.span 
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          key={genre}
                          className="bg-blue-600/20 text-blue-400 border border-blue-500/30 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 group"
                        >
                          {genre}
                          <button 
                            type="button"
                            onClick={() => removeGenre(genre)}
                            className="hover:text-rose-500 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </motion.span>
                      ))}
                    </AnimatePresence>
                    {formData.genres.length === 0 && (
                      <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest mt-3 ml-2">Hali hech qanday janr qo'shilmagan</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-end gap-4 items-center">
              <label className="flex items-center gap-2 text-sm text-gray-400 font-bold cursor-pointer group mr-auto">
                  <input 
                    type="checkbox"
                    checked={sendToTelegram}
                    onChange={(e) => setSendToTelegram(e.target.checked)}
                    className="rounded bg-[#0a0a0c] border-white/20 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 focus:ring-offset-[#070708]"
                  />
                <span className="group-hover:text-white transition-colors">Telegram kanalga yuborish</span>
              </label>

              <button 
                type="button"
                onClick={() => navigate('/admin/animes')}
                className="px-8 py-4 rounded-2xl font-bold text-sm text-gray-400 hover:text-white transition-all"
              >
                Bekor qilish
              </button>
              <button 
                type="submit"
                disabled={loading || success}
                className={`px-10 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl flex items-center gap-3 active:scale-95 ${
                  success 
                    ? 'bg-emerald-600 text-white shadow-emerald-900/20' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-900/30'
                }`}
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : success ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>Qo'shildi!</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    <span>Animeni Saqlash</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
