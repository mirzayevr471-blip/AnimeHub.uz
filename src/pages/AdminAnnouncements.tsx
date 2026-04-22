import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, Plus, Trash2, Power, PowerOff, X, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useAnnouncements } from '../context/AnnouncementContext';

export default function AdminAnnouncements() {
  const { announcements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAnnouncements();
  const [isAdding, setIsAdding] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    link: '',
    type: 'info' as 'info' | 'warning' | 'success' | 'danger',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.message) return;
    
    addAnnouncement(formData);
    setIsAdding(false);
    setFormData({ title: '', message: '', link: '', type: 'info', isActive: true });
  };

  const getBadgeStyles = (type: string) => {
    switch(type) {
      case 'warning': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'danger': return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'success': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'info':
      default: return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0a0a0c] p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 blur-[100px] -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
            <Megaphone className="w-8 h-8 text-yellow-500" />
            E'lonlar Boshqaruvi
          </h1>
          <p className="text-gray-500 font-medium text-sm">Sayt foydalanuvchilariga e'lon va banner xabarlar yuborish</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="relative z-10 flex items-center justify-center gap-3 bg-yellow-500 hover:bg-yellow-600 text-black px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-yellow-900/20 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Yangi E'lon
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence>
          {announcements.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center text-gray-500 bg-[#0a0a0c] border border-white/5 rounded-[40px]"
            >
              <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-20" />
              <div className="text-[10px] font-black uppercase tracking-widest">Hech qanday e'lon yo'q</div>
            </motion.div>
          ) : (
            announcements.map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-[#0a0a0c] border p-6 rounded-3xl transition-all ${
                  item.isActive ? 'border-white/20 shadow-lg' : 'border-white/5 opacity-60'
                }`}
              >
                <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${getBadgeStyles(item.type)}`}>
                        {item.type}
                      </span>
                      <h3 className="text-lg font-bold text-white">{item.title}</h3>
                    </div>
                    <p className="text-gray-400 text-sm font-medium">{item.message}</p>
                    {item.link && (
                      <a href={item.link} target="_blank" rel="noreferrer" className="text-blue-400 text-[10px] font-black uppercase hover:underline flex items-center gap-1 mt-1 block">
                        Havolaga o'tish
                      </a>
                    )}
                    <div className="text-[10px] text-gray-600 font-bold uppercase tracking-widest pt-2">
                      Sana: {new Date(item.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button 
                      onClick={() => updateAnnouncement(item.id, { isActive: !item.isActive })}
                      className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        item.isActive 
                          ? 'bg-rose-500/10 border-rose-500/20 text-rose-500 hover:bg-rose-500 hover:text-white' 
                          : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500 hover:text-white'
                      }`}
                    >
                      {item.isActive ? 'To\'xtatish' : 'Faollashtirish'}
                    </button>
                    <button 
                      onClick={() => deleteAnnouncement(item.id)}
                      className="bg-white/5 hover:bg-rose-500 hover:text-white text-gray-400 border border-white/5 p-3 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsAdding(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="relative bg-[#0a0a0c] border border-white/10 p-10 rounded-[40px] w-full max-w-lg shadow-[0_0_100px_rgba(234,179,8,0.1)]"
             >
               <h2 className="text-2xl font-black tracking-tight mb-2">Yangi E'lon</h2>
               <p className="text-gray-500 text-sm font-medium mb-8">Saytning yuqori qismida chiqib turuvchi xabar yarating.</p>
               
               <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Title */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Sarlavha</label>
                    <input 
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="Masalan: Sayt yangilandi!"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-yellow-500 transition-all text-white font-medium"
                    />
                 </div>

                 {/* Message */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Matn</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="E'lon haqida to'liq ma'lumot..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-yellow-500 transition-all text-white font-medium resize-none"
                    />
                 </div>

                 {/* Link */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Havola (Ixtiyoriy)</label>
                    <input 
                      type="url"
                      value={formData.link}
                      onChange={(e) => setFormData({...formData, link: e.target.value})}
                      placeholder="https://t.me/..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-yellow-500 transition-all text-white font-medium"
                    />
                 </div>

                 {/* Type */}
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Xabar turi</label>
                    <select 
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as any})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:border-yellow-500 transition-all text-white font-medium appearance-none cursor-pointer"
                    >
                      <option value="info" className="bg-[#0a0a0c]">Ma'lumot (Ko'k)</option>
                      <option value="success" className="bg-[#0a0a0c]">Muvaffaqiyatli (Yashil)</option>
                      <option value="warning" className="bg-[#0a0a0c]">Ogohlantirish (Sariq)</option>
                      <option value="danger" className="bg-[#0a0a0c]">Muhim / Xavf (Qizil)</option>
                    </select>
                 </div>

                 <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button 
                      type="button"
                      onClick={() => setIsAdding(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Bekor Qilish
                    </button>
                    <button 
                      type="submit"
                      className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-yellow-900/20 active:scale-95"
                    >
                      Tarqatish
                    </button>
                 </div>
               </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
