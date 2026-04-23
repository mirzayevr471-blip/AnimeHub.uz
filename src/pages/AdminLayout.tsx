import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, Film, Settings, LogOut, Bell, Search, Menu, X, User, ChevronRight, Zap, Video, MessageSquare, Users, Megaphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminLayout() {
  const { user: authUser, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Protect Admin Panel
  React.useEffect(() => {
    if (!isLoading && (!authUser || authUser.role !== 'admin')) {
      navigate('/');
    }
  }, [authUser, isLoading, navigate]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Yangi anime qo'shildi", desc: "Siz tarafingizdan 'Solo Leveling' qo'shildi.", time: "Hozir" },
    { id: 2, title: "Server yangilanishi", desc: "Platforma barqarorligi yaxshilandi.", time: "2 soat oldin" },
  ]);

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  const menuItems = [
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { name: "Animelar Ro'yxati", path: "/admin/animes", icon: Film },
    { name: "Qismlar", path: "/admin/episodes", icon: Video },
    { name: "Yordam", path: "/admin/support", icon: MessageSquare },
    { name: "E'lonlar", path: "/admin/announcements", icon: Megaphone },
    { name: "Adminlar & Userlar", path: "/admin/users", icon: Users },
    { name: "Sozlamalar", path: "/admin/settings", icon: Settings },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname === path + '/';

  return (
    <div className="min-h-screen bg-[#070708] text-white font-sans selection:bg-blue-500/30">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 bg-[#0a0a0c] border-r border-white/5 transition-all duration-500 ease-in-out ${isSidebarOpen ? 'w-72' : 'w-20'}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo Area */}
          <div className="h-20 flex items-center px-6 border-b border-white/5 overflow-hidden">
            <Link to="/" className="flex items-center gap-3 group">
              <img 
                src="input_file_0.png" 
                alt="AnimeHub.uz" 
                className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-blue-500/40 group-hover:rotate-6 transition-transform duration-500 border border-blue-500/30"
                referrerPolicy="no-referrer"
              />
              <span className={`text-xl font-black tracking-tighter transition-all duration-500 ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                ANIME<span className="text-blue-500">HUB</span>
                <span className="text-[10px] ml-1 text-gray-500 font-bold border border-white/10 px-1 rounded uppercase">Pro</span>
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-8 px-4 space-y-2 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all relative group h-14 ${
                    active 
                      ? 'bg-blue-600/10 text-white shadow-[0_0_20px_rgba(37,99,235,0.1)]' 
                      : 'text-gray-500 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className={`w-5 h-5 transition-colors duration-300 ${active ? 'text-blue-500' : 'group-hover:text-white'}`} />
                  <span className={`font-bold text-sm transition-all duration-500 whitespace-nowrap ${isSidebarOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
                    {item.name}
                  </span>
                  
                  {active && (
                    <motion.div 
                      layoutId="activeNav"
                      className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                    />
                  )}
                  
                  {!isSidebarOpen && (
                    <div className="absolute left-full ml-4 px-3 py-2 bg-[#0a0a0c] border border-white/10 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-2xl z-[60]">
                      {item.name}
                    </div>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-white/5">
            <div className={`flex items-center gap-4 bg-white/5 p-3 rounded-2xl border border-white/5 transition-all ${isSidebarOpen ? 'w-full' : 'w-12 px-2 overflow-hidden'}`}>
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 flex items-center justify-center font-black text-xs shadow-lg flex-shrink-0">
                {authUser?.avatar ? (
                   <img src={authUser.avatar} alt="Admin" className="w-full h-full object-cover rounded-xl" referrerPolicy="no-referrer" />
                ) : (
                   'AD'
                )}
              </div>
              <div className={`flex-1 min-w-0 transition-opacity duration-500 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-sm font-bold truncate">{authUser?.name || 'Admin Hub'}</div>
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{authUser?.isSuperAdmin ? 'Super Admin' : 'Admin'}</div>
              </div>
              <Link
                to="/"
                className={`p-1 text-gray-500 hover:text-rose-500 transition-colors ${isSidebarOpen ? 'block' : 'hidden'}`}
                title="Chiqish"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`transition-all duration-500 ease-in-out ${isSidebarOpen ? 'pl-72' : 'pl-20'}`}>
        {/* Top Header */}
        <header className="h-20 bg-[#070708]/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-40 px-8 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/10"
            >
              {isSidebarOpen ? <Menu className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>
            
            <div className="relative hidden lg:block w-96 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Buyruqlar bo'yicha qidirish..." 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-12 py-2.5 text-sm outline-none focus:border-blue-500 transition-all font-medium text-gray-300"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/5 text-gray-500">⌘</kbd>
                <kbd className="text-[10px] bg-white/10 px-1.5 py-0.5 rounded border border-white/5 text-gray-500">K</kbd>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="w-10 h-10 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-xl text-gray-400 hover:text-white transition-all border border-white/10 relative"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full border-2 border-[#070708] shadow-[0_0_10px_rgba(37,99,235,0.5)]"></span>
                )}
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-[-1]" onClick={() => setIsNotificationsOpen(false)}></div>
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-4 w-80 bg-[#0a0a0c] border border-white/10 rounded-3xl shadow-2xl p-4 overflow-hidden z-50"
                    >
                      <div className="flex items-center justify-between mb-4 px-2">
                        <span className="text-sm font-black">Xabarlar</span>
                        <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold">{notifications.length} ta</span>
                      </div>
                      <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                        {notifications.length > 0 ? (
                          notifications.map((n) => (
                            <div key={n.id} className="p-3 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors relative group/item">
                              <div className="text-xs font-bold">{n.title}</div>
                              <div className="text-[10px] text-gray-500 mt-1">{n.desc}</div>
                              <div className="text-[8px] text-gray-600 mt-2 uppercase font-bold tracking-widest">{n.time}</div>
                              <button 
                                onClick={() => removeNotification(n.id)}
                                className="absolute top-2 right-2 p-1 bg-white/5 rounded-md opacity-0 group-hover/item:opacity-100 hover:bg-rose-500/10 hover:text-rose-500 transition-all"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="py-8 text-center bg-white/5 rounded-2xl border border-dashed border-white/10">
                             <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Yangi xabarlar yo'q</div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <button className="flex items-center gap-3 bg-white/5 pr-4 pl-1.5 py-1.5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
              <div className="w-7 h-7 bg-blue-600 rounded-xl flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold whitespace-nowrap">Super Admin</span>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

