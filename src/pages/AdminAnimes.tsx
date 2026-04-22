import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAnime } from '../context/AnimeContext';
import { Edit, Trash2, Plus, X, Search, Filter, ChevronRight, MoreHorizontal, Download, LayoutGrid, List, Star, Video } from 'lucide-react';
import { Anime } from '../types';

export default function AdminAnimes() {
  const { animes, deleteAnime, addAnime, updateAnime } = useAnime();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Barchasi');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  
  // anime form state
  const [formData, setFormData] = useState({
    title: '', image: '', rating: 0, year: new Date().getFullYear(), type: 'TV Serial', status: 'Davom etayotgan', genres: 'Sarguzasht'
  });

  const filteredAnimes = animes.filter(anime => {
    const matchesSearch = anime.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'Barchasi' || anime.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleEdit = (anime: Anime) => {
    setEditingId(anime.id);
    setFormData({
      title: anime.title,
      image: anime.image,
      rating: anime.rating,
      year: anime.year,
      type: anime.type,
      status: anime.status,
      genres: anime.genres.join(', ')
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    navigate('/admin/animes/add');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const animeData = {
      title: formData.title,
      image: formData.image,
      rating: Number(formData.rating),
      year: Number(formData.year),
      type: formData.type as any,
      status: formData.status as any,
      genres: formData.genres.split(',').map(s => s.trim())
    };

    if (editingId) {
      updateAnime(editingId, animeData);
    } else {
      addAnime(animeData);
    }
    setIsModalOpen(false);
  };

  const downloadAnimes = () => {
    const data = filteredAnimes.map(a => ({
      title: a.title,
      year: a.year,
      rating: a.rating,
      type: a.type,
      status: a.status,
      genres: a.genres.join(', ')
    }));
    
    // JSON download
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `anihub-animes-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black tracking-tight">Animelar Ro'yxati</h2>
          <p className="text-gray-400 text-sm mt-1">Siz jami {animes.length} ta animeni boshqarmoqdasiz.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={downloadAnimes}
            title="Ro'yxatni yuklash"
            className="bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white p-2 rounded-xl transition-all border border-white/5 active:scale-90"
          >
            <Download className="w-5 h-5" />
          </button>
          <button 
            onClick={handleAddNew}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-purple-900/30 flex items-center gap-2 group"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Yangi Anime
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-[#0a0a0c] p-4 rounded-3xl border border-white/5">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Anime nomi bo'yicha qidirish..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all font-medium text-gray-200"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:flex-none">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full md:w-48 bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition-all text-gray-400 appearance-none font-medium"
            >
              <option value="Barchasi">Barchasi</option>
              <option value="Davom etayotgan">Ongoing</option>
              <option value="Tugallangan">Completed</option>
            </select>
          </div>
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/5">
            <button 
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'table' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <List className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20' : 'text-gray-500 hover:text-gray-300'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'table' ? (
        <div className="bg-[#0a0a0c] border border-white/5 rounded-[32px] overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-[10px] uppercase tracking-widest text-gray-500 border-b border-white/5 bg-white/[0.02]">
                <tr>
                  <th className="px-8 py-5 font-black">Anime</th>
                  <th className="px-8 py-5 font-black">Rating & Janr</th>
                  <th className="px-8 py-5 font-black">Holat</th>
                  <th className="px-8 py-5 font-black">Details</th>
                  <th className="px-8 py-5 font-black text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.02]">
                {filteredAnimes.map(anime => (
                  <tr key={anime.id} className="hover:bg-white/[0.015] transition-all group">
                    <td className="px-8 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0 group-hover:scale-105 transition-transform duration-500">
                          <img src={anime.image} alt={anime.title} className="w-12 h-16 object-cover rounded-xl shadow-2xl border border-white/10" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 rounded-xl bg-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="min-w-0">
                          <div className="font-black text-white text-base truncate max-w-[200px] mb-0.5 group-hover:text-purple-400 transition-colors">
                            {anime.title}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-tighter">
                            <span>{anime.year}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-700"></span>
                            <span className="text-purple-500/80">{anime.type}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1.5 text-yellow-500 font-black">
                          <Star className="w-4 h-4 fill-yellow-500" />
                          {anime.rating}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {anime.genres.slice(0, 2).map(g => (
                            <span key={g} className="text-[8px] bg-white/5 border border-white/5 px-1.5 py-0.5 rounded-md text-gray-400 font-bold uppercase">
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-4">
                      <span className={`status-badge ${anime.status === 'Tugallangan' ? 'completed' : 'ongoing'}`}>
                        {anime.status}
                      </span>
                    </td>
                    <td className="px-8 py-4">
                      <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-600 rounded-full" style={{ width: `${anime.rating * 10}%` }}></div>
                      </div>
                    </td>
                    <td className="px-8 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => navigate(`/admin/animes/${anime.id}/episodes`)}
                          className="p-3 text-gray-500 hover:text-purple-400 hover:bg-purple-400/5 rounded-2xl transition-all group/btn"
                        >
                          <Video className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => handleEdit(anime)}
                          className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all group/btn"
                        >
                          <Edit className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button 
                          onClick={() => deleteAnime(anime.id)}
                          className="p-3 text-gray-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all group/btn"
                        >
                          <Trash2 className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        </button>
                        <button className="p-3 text-gray-500 hover:text-white hover:bg-white/5 rounded-2xl transition-all">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {filteredAnimes.map(anime => (
            <div key={anime.id} className="bg-[#0a0a0c] rounded-3xl border border-white/5 p-4 group hover:border-purple-500/30 transition-all duration-500 relative flex flex-col">
              <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-4 relative">
                <img src={anime.image} alt={anime.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" referrerPolicy="no-referrer" />
                <div className="absolute top-2 right-2 flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-xl text-[10px] font-black text-yellow-400">
                  <Star className="w-3 h-3 fill-yellow-400" />
                  {anime.rating}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="font-bold text-sm truncate mb-1 group-hover:text-purple-400 transition-colors uppercase tracking-tight">{anime.title}</h3>
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-white/5">
                <span className="text-[10px] text-gray-500 font-bold uppercase">{anime.year}</span>
                <div className="flex gap-1">
                  <button onClick={() => navigate(`/admin/animes/${anime.id}/episodes`)} className="p-1.5 hover:text-purple-400 transition-colors"><Video className="w-3.5 h-3.5" /></button>
                  <button onClick={() => handleEdit(anime)} className="p-1.5 hover:text-white transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteAnime(anime.id)} className="p-1.5 hover:text-rose-500 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modern Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}></div>
          
          <div className="relative bg-[#0a0a0c] border border-white/10 rounded-[40px] w-full max-w-2xl overflow-hidden shadow-[0_0_100px_rgba(124,58,237,0.15)] animate-in zoom-in-95 slide-in-from-bottom-8 duration-500">
            <div className="flex items-center justify-between p-8 border-b border-white/5">
              <div>
                <h3 className="text-2xl font-black">{editingId ? 'Animeni Tahrirlash' : 'Yangi Anime Qo\'shish'}</h3>
                <p className="text-xs text-gray-500 mt-1 uppercase tracking-widest font-bold">Ma'lumotlarni to'ldiring</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="w-12 h-12 flex items-center justify-center bg-white/5 hover:bg-rose-500/10 text-gray-400 hover:text-rose-500 rounded-2xl transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Anime Sarlavhasi</label>
                    <input required type="text" value={formData.title} onChange={e=>setFormData({...formData, title: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all placeholder:text-gray-700" placeholder="Anime nomini yozing..." />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Poster URL</label>
                    <input required type="url" value={formData.image} onChange={e=>setFormData({...formData, image: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all placeholder:text-gray-700" placeholder="Poster manzilini kiriting..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Reyting</label>
                      <input required type="number" step="0.1" value={formData.rating} onChange={e=>setFormData({...formData, rating: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Chiqish Yili</label>
                      <input required type="number" value={formData.year} onChange={e=>setFormData({...formData, year: Number(e.target.value)})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all" />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Format</label>
                      <select value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all appearance-none cursor-pointer">
                        <option value="TV Serial">TV Serial</option>
                        <option value="Movie">Movie</option>
                        <option value="OVA">OVA</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Holati</label>
                      <select value={formData.status} onChange={e=>setFormData({...formData, status: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all appearance-none cursor-pointer">
                        <option value="Davom etayotgan">Ongoing</option>
                        <option value="Tugallangan">Completed</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Janrlar</label>
                    <textarea 
                      required 
                      rows={3}
                      value={formData.genres} 
                      onChange={e=>setFormData({...formData, genres: e.target.value})} 
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-purple-500 focus:outline-none transition-all placeholder:text-gray-700 resize-none" 
                      placeholder="Masalan: Sarguzasht, Jangari..." 
                    />
                    <p className="text-[9px] text-gray-600 mt-2 italic font-medium px-1">* Janrlarni vergul bilan ajratib yozing.</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 flex justify-end gap-4 mt-8 border-t border-white/5">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-8 py-4 rounded-2xl font-bold text-gray-400 hover:text-white transition-all">
                  Bekor Qilish
                </button>
                <button type="submit" className="px-10 py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-black text-sm transition-all shadow-2xl shadow-purple-900/40">
                  {editingId ? 'Saqlash' : 'Qo\'shish'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
