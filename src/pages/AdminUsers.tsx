import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UserPlus, 
  ShieldCheck, 
  Trash2, 
  Mail, 
  User as UserIcon,
  Search,
  ShieldAlert,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { User } from '../types';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const USERS_KEY = 'anihub_users_db';

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setIsLoading(true);
    try {
      const data = localStorage.getItem(USERS_KEY);
      const storedUsers = data ? JSON.parse(data) : [];
      setUsers(storedUsers);
    } catch (err) {
      console.error('Failed to load users:', err);
      // Fallback
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  const showStatus = (type: 'success' | 'error', text: string) => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 3000);
  };

  const handleAddAdmin = () => {
    if (!newAdminEmail.trim()) return;

    try {
      const data = localStorage.getItem(USERS_KEY);
      const storedUsers = data ? JSON.parse(data) : [];
      const userIndex = storedUsers.findIndex((u: any) => u.email === newAdminEmail);

      if (userIndex === -1) {
        showStatus('error', "Foydalanuvchi topilmadi. Avval u ro'yxatdan o'tishi kerak.");
        return;
      }

      if (storedUsers[userIndex].role === 'admin') {
        showStatus('error', "Ushbu foydalanuvchi allaqachon admin.");
        return;
      }

      storedUsers[userIndex].role = 'admin';
      localStorage.setItem(USERS_KEY, JSON.stringify(storedUsers));
      setUsers(storedUsers);
      setNewAdminEmail('');
      setIsAddingAdmin(false);
      showStatus('success', "Foydalanuvchi muvaffaqiyatli admin qilindi!");
    } catch (err) {
      showStatus('error', "Xatolik yuz berdi");
    }
  };

  const handleRemoveAdmin = (userId: string) => {
    try {
      const data = localStorage.getItem(USERS_KEY);
      const storedUsers = data ? JSON.parse(data) : [];
      const user = storedUsers.find((u: any) => u.id === userId);

      if (user?.isSuperAdmin) {
        showStatus('error', "Super Admin-ni chetlatib bo'lmaydi!");
        return;
      }

      const updatedUsers = storedUsers.map((u: any) => 
        u.id === userId ? { ...u, role: 'user' } : u
      );

      localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
      showStatus('success', "Admin huquqlari olib tashlandi.");
    } catch (err) {
      showStatus('error', "Xatolik yuz berdi");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminUsers = filteredUsers.filter(u => u.role === 'admin');
  const regularUsers = filteredUsers.filter(u => u.role === 'user');

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#0a0a0c] p-8 rounded-[40px] border border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 blur-[100px] -mr-32 -mt-32"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight mb-2 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-purple-500" />
            Foydalanuvchilar Boshqaruvi
          </h1>
          <p className="text-gray-500 font-medium text-sm">Sayt adminlari va foydalanuvchilarini boshqarish</p>
        </div>

        <button 
          onClick={() => setIsAddingAdmin(true)}
          className="relative z-10 flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-purple-900/20 active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          Yangi Admin Qoshish
        </button>
      </div>

      <AnimatePresence>
        {statusMessage && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`p-4 rounded-2xl border flex items-center gap-3 font-bold text-xs uppercase tracking-widest ${
              statusMessage.type === 'success' 
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' 
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}
          >
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
            {statusMessage.text}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Users List */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-[#0a0a0c] border border-white/5 rounded-[40px] p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input 
                  type="text"
                  placeholder="Ism yoki email orqali qidirish..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-6 text-sm focus:outline-none focus:border-purple-500 transition-all font-medium text-white"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] ml-4 mb-2">Barcha Foydalanuvchilar ({users.length})</h3>
              
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center opacity-30">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Yuklanmoqda...</span>
                </div>
              ) : filteredUsers.length > 0 ? (
                <div className="space-y-2">
                  {filteredUsers.map((u) => (
                    <div key={u.id} className="group flex items-center justify-between p-4 bg-white/5 hover:bg-white/[0.08] border border-white/5 rounded-3xl transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl overflow-hidden border border-white/10">
                          <img src={u.avatar} alt={u.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm">{u.name}</span>
                            {u.role === 'admin' && (
                              <span className={`text-[8px] font-black uppercase tracking-tight px-1.5 py-0.5 rounded border border-white/10 ${u.isSuperAdmin ? 'bg-purple-500 text-white' : 'bg-blue-500/20 text-blue-400'}`}>
                                {u.isSuperAdmin ? 'Super' : 'Admin'}
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-gray-500 font-medium">{u.email}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {u.role === 'user' ? (
                          <button 
                            onClick={() => {
                              setNewAdminEmail(u.email);
                              setIsAddingAdmin(true);
                            }}
                            className="bg-white/5 hover:bg-purple-600 p-2.5 rounded-xl border border-white/5 transition-all text-gray-400 hover:text-white"
                            title="Admin qilish"
                          >
                            <ShieldCheck className="w-4 h-4" />
                          </button>
                        ) : !u.isSuperAdmin && (
                          <button 
                            onClick={() => handleRemoveAdmin(u.id)}
                            className="bg-rose-500/10 hover:bg-rose-500 p-2.5 rounded-xl border border-rose-500/20 transition-all text-rose-500 hover:text-white"
                            title="Adminlikdan olish"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center opacity-20">
                   <div className="text-[10px] font-black uppercase tracking-widest">Hech kim topilmadi</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-gradient-to-tr from-purple-900/20 to-indigo-900/20 border border-purple-500/10 rounded-[40px] p-8 space-y-6 shadow-2xl">
            <h3 className="text-sm font-black uppercase tracking-widest text-purple-400 flex items-center gap-3">
              <ShieldAlert className="w-5 h-5" /> Tizim Statistikasi
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Jami Foydalanuvchilar</span>
                <span className="text-2xl font-black">{users.length}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Adminlar Soni</span>
                <span className="text-2xl font-black text-purple-400">{users.filter(u => u.role === 'admin').length}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0c] border border-white/5 rounded-[40px] p-8 space-y-4">
             <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-4">ESLATMA</h4>
             <p className="text-xs text-gray-500 leading-relaxed font-medium">
               Adminlarni tayinlashda ehtiyot bo'ling. Super Admin (eyfelchik@gmail.com) barcha huquqlarga ega va uni saytdan chetlatib bo'lmaydi.
             </p>
          </div>
        </div>
      </div>

      {/* Add Admin Modal */}
      <AnimatePresence>
        {isAddingAdmin && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
             <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsAddingAdmin(false)}
               className="absolute inset-0 bg-black/80 backdrop-blur-sm"
             />
             <motion.div 
               initial={{ scale: 0.95, opacity: 0, y: 20 }}
               animate={{ scale: 1, opacity: 1, y: 0 }}
               exit={{ scale: 0.95, opacity: 0, y: 20 }}
               className="relative bg-[#0a0a0c] border border-white/10 p-10 rounded-[40px] w-full max-w-lg shadow-[0_0_100px_rgba(168,85,247,0.1)]"
             >
               <h2 className="text-2xl font-black tracking-tight mb-2">Admin Tayinlash</h2>
               <p className="text-gray-500 text-sm font-medium mb-8">Foydalanuvchini email orqali admin qiling</p>
               
               <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Foydalanuvchi Emaili</label>
                    <div className="relative group">
                       <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
                       <input 
                         type="email"
                         value={newAdminEmail}
                         onChange={(e) => setNewAdminEmail(e.target.value)}
                         placeholder="email@example.com"
                         className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm focus:outline-none focus:border-purple-500 transition-all text-white font-medium"
                       />
                    </div>
                 </div>

                 <div className="flex gap-4">
                    <button 
                      onClick={() => setIsAddingAdmin(false)}
                      className="flex-1 bg-white/5 hover:bg-white/10 text-gray-400 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all"
                    >
                      Bekor Qilish
                    </button>
                    <button 
                      onClick={handleAddAdmin}
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl shadow-purple-900/20 active:scale-95"
                    >
                      Tasdiqlash
                    </button>
                 </div>
               </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
