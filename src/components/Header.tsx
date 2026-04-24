import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Menu, X, Bell, ChevronLeft, User, LogIn, UserPlus, ShieldCheck, Shield, MessageSquare, Megaphone, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAnnouncements } from '../context/AnnouncementContext';
import { motion, AnimatePresence } from 'motion/react';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [lang, setLang] = useState('UZ');
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { announcements, updateAnnouncement, deleteAnnouncement } = useAnnouncements();

  useEffect(() => {
    setSearchValue(searchParams.get('q') || '');
  }, [searchParams]);

  useEffect(() => {
    // Close notifications when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate('/');
    }
  };

  const toggleLang = () => {
    setLang(prev => prev === 'UZ' ? 'EN' : 'UZ');
  };

  // Use announcements as notifications
  const activeNotifications = announcements.slice(0, 5); // Limit to top 5
  // Red dot indicator based on having active announcements
  const hasUnread = activeNotifications.some(a => a.isActive);

  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'warning': return 'text-yellow-500 bg-yellow-500/10';
      case 'danger': return 'text-blue-500 bg-blue-500/10';
      case 'success': return 'text-emerald-500 bg-emerald-500/10';
      case 'info':
      default: return 'text-blue-400 bg-blue-500/10';
    }
  };

  const getIcon = (type: string, className = "w-4 h-4") => {
    switch(type) {
      case 'warning': return <AlertTriangle className={className} />;
      case 'danger': return <AlertTriangle className={className} />;
      case 'success': return <CheckCircle2 className={className} />;
      case 'info':
      default: return <Info className={className} />;
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black/60 border-b border-blue-900/30 backdrop-blur-md transition-all duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 group outline-none">
            <div className="relative flex items-center justify-center">
              {/* Pulsing Background */}
              <div className="absolute inset-0 bg-blue-600/20 blur-xl rounded-full group-hover:bg-blue-600/40 transition-all duration-500"></div>
              
              {/* Modern "A" Badge */}
              <div className="relative w-12 h-12 bg-gradient-to-tr from-blue-700 to-blue-500 rounded-[18px] flex items-center justify-center shadow-[0_10px_25px_-5px_rgba(37,99,235,0.4)] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 border border-white/20">
                <span className="text-2xl font-black text-white italic tracking-tighter drop-shadow-md">A</span>
                
                {/* Gloss Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-[18px]"></div>
              </div>

              {/* Decorative Dot */}
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-[#070708] rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
              </div>
            </div>

            <div className="flex flex-col -space-y-1">
              <span className="text-2xl font-black italic tracking-tighter text-white">
                <span className="text-blue-500">Anime</span>Hub
              </span>
              <span className="text-[9px] font-black uppercase tracking-[0.4em] text-gray-500 group-hover:text-blue-400 transition-colors">
                UZBEKISTAN
              </span>
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-black uppercase tracking-widest">
            <Link to="/" className="text-white hover:text-blue-500 transition-all">Bosh sahifa</Link>
            <Link to="/?genre=Katalog" className="text-gray-500 hover:text-white transition-all">Katalog</Link>
            <a href="#janrlar" className="text-gray-500 hover:text-white transition-all">Janrlar</a>
            <Link to="/?genre=Yangi" className="text-gray-500 hover:text-emerald-500 transition-all font-bold">Yangi</Link>
            <Link to="/?status=Davom etayotgan" className="text-gray-500 hover:text-white transition-all flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Davom etayotgan
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-chat'))}
              className="text-gray-500 hover:text-blue-400 transition-all flex items-center gap-1.5 focus:outline-none uppercase"
            >
              <div className="w-4 h-4 rounded bg-blue-500/20 text-blue-500 flex items-center justify-center border border-blue-500/30">
                <MessageSquare className="w-2.5 h-2.5" />
              </div>
              Chat
            </button>
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4 flex-1 justify-end lg:flex-none">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex relative group max-w-sm w-full mx-8">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Anime qidirish..."
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-blue-500 transition-all text-white placeholder-gray-500"
            />
            <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
            </button>
          </form>
          
          {/* Header Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 mr-2">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2.5 rounded-xl transition-all duration-300 focus:outline-none flex items-center justify-center bg-white/5 border border-white/10 group ${showNotifications ? 'bg-blue-600/20 border-blue-500/50 scale-95' : 'hover:bg-white/10 hover:border-white/20'}`}
              >
                <Bell className={`w-5 h-5 transition-all duration-300 ${hasUnread ? 'text-blue-400 animate-bounce' : 'text-gray-400 group-hover:text-white'}`} style={{ animationDuration: '3s' }} />
                {hasUnread && (
                  <>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full border-2 border-[#070708] flex items-center justify-center shadow-lg">
                      <span className="text-[8px] font-black text-white">{activeNotifications.filter(n => n.isActive).length}</span>
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75"></div>
                  </>
                )}
              </button>

              {/* Notifications Dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-4 w-80 sm:w-96 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-[100]"
                  >
                    <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                      <h3 className="font-bold text-white tracking-tight">Bildirishnomalar</h3>
                      <div className="flex items-center gap-3">
                        {activeNotifications.length > 0 && (
                          <button 
                            onClick={() => {
                              // Mark all as read logic (simulated by deleting or marking inactive)
                              activeNotifications.forEach(n => updateAnnouncement(n.id, { isActive: false }));
                            }}
                            className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 transition-colors"
                          >
                            O'qilgan deb belgilash
                          </button>
                        )}
                        <button 
                          onClick={() => setShowNotifications(false)}
                          className="text-gray-500 hover:text-white transition-colors p-1"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {activeNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                          <div className="relative mb-4">
                            <Bell className="w-12 h-12 text-gray-800" />
                            <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full"></div>
                          </div>
                          <p className="text-sm font-bold text-gray-400">Hozircha yangi xabarlar yo'q.</p>
                          <p className="text-[10px] text-gray-600 uppercase tracking-widest mt-1">Yangi relizlarni kuting!</p>
                        </div>
                      ) : (
                        <div className="flex flex-col divide-y divide-white/5">
                          {activeNotifications.map((notif) => (
                            <div 
                              key={notif.id} 
                              className={`p-4 hover:bg-white/5 transition-all cursor-pointer relative group/notif ${notif.isActive ? 'bg-blue-600/5' : ''}`}
                              onClick={() => updateAnnouncement(notif.id, { isActive: false })}
                            >
                              <div className="flex gap-4">
                                <div className={`mt-1 flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover/notif:scale-110 ${getTypeStyles(notif.type)}`}>
                                  {getIcon(notif.type, "w-5 h-5")}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className={`text-sm font-black tracking-tight line-clamp-1 ${notif.isActive ? 'text-white' : 'text-gray-400'}`}>
                                      {notif.title}
                                    </h4>
                                    {notif.isActive && (
                                      <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(37,99,235,0.6)]"></div>
                                    )}
                                  </div>
                                  <p className="text-xs text-gray-500 font-medium line-clamp-2 leading-relaxed group-hover/notif:text-gray-400 transition-colors">
                                    {notif.message}
                                  </p>
                                  <div className="flex items-center justify-between pt-2">
                                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-[0.2em]">
                                      {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notif.createdAt).toLocaleDateString()}
                                    </p>
                                    <button 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteAnnouncement(notif.id);
                                      }}
                                      className="opacity-0 group-hover/notif:opacity-100 text-gray-700 hover:text-rose-500 transition-all p-1"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    {activeNotifications.length > 0 && (
                      <div className="p-3 bg-black/40 border-t border-white/10 text-center">
                         <button className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-blue-500 transition-colors">
                           Barcha bildirishnomalarni ko'rish
                         </button>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {user?.role === 'admin' && (
            <Link to="/admin" className="hidden lg:flex items-center justify-center w-[38px] h-[38px] rounded-full hover:bg-white/10 transition-colors bg-transparent border border-transparent mr-2 group">
              <Shield className="w-5 h-5 text-blue-500 group-hover:text-blue-400 group-hover:drop-shadow-[0_0_8px_rgba(37,99,235,0.5)] transition-all" />
            </Link>
          )}

          {user ? (
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {user.role === 'admin' && <ShieldCheck className="w-2.5 h-2.5 text-blue-400" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-blue-400 leading-none">{user.name}</span>
                </div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">LVL {user.level || 1} • {user.points || 0} XP</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 border border-white/20 flex-shrink-0 cursor-pointer group-hover:scale-105 transition-all shadow-xl shadow-blue-900/20 overflow-hidden ring-2 ring-transparent group-hover:ring-blue-500/50">
                <img src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all px-4 py-2">
                <LogIn className="w-3.5 h-3.5" />
                Kirish
              </Link>
              <Link to="/signup" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-blue-600 text-white rounded-xl px-5 py-2.5 border border-white/10 hover:border-blue-500 transition-all shadow-lg shadow-black/20">
                <UserPlus className="w-3.5 h-3.5" />
                Ro'yxatdan o'tish
              </Link>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button 
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 w-full bg-[#070708] border-b border-white/10 shadow-xl py-4 px-4 flex flex-col gap-4">
          <nav className="flex flex-col gap-3">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-white px-4 py-3 rounded-xl bg-white/5 flex items-center justify-between">
              Bosh sahifa
              <ChevronLeft className="w-4 h-4 rotate-180 opacity-30" />
            </Link>
            <Link to="/?genre=Katalog" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-400 hover:text-white px-4 py-3">Katalog</Link>
            <a href="#janrlar" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-400 hover:text-white px-4 py-3">Janrlar</a>
            <Link to="/?genre=Yangi" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-emerald-400 px-4 py-3">Yangi</Link>
            <Link to="/?status=Davom etayotgan" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-400 px-4 py-3 flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Davom etayotgan
            </Link>
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-global-chat'));
                setIsMobileMenuOpen(false);
              }} 
              className="font-bold text-blue-400 hover:text-blue-300 px-4 py-3 flex items-center justify-start gap-2 focus:outline-none"
            >
              <MessageSquare className="w-4 h-4" /> Global Chat
            </button>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-400 hover:text-white px-4 py-3 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Profil
            </Link>
            {user?.role === 'admin' && (
              <div className="pt-4 mt-2 border-t border-white/5">
                <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 font-black text-blue-400 py-4 bg-blue-900/20 rounded-2xl border border-blue-500/20 tracking-widest uppercase text-xs">
                  <Shield className="w-4 h-4" /> Boshqaruv
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
