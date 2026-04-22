import React, { useState, useEffect, useRef } from 'react';
import { Search, Globe, Menu, X, Bell, ChevronLeft, User, LogIn, UserPlus, ShieldCheck, MessageSquare, Megaphone, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
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
  const { announcements } = useAnnouncements();

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
      case 'danger': return 'text-rose-500 bg-rose-500/10';
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
    <header className="sticky top-0 z-50 w-full bg-black/60 border-b border-purple-900/30 backdrop-blur-md transition-all duration-300">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center gap-8">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="text-2xl font-black italic tracking-tighter">
              <span className="text-purple-500">Ani</span>Hub
            </div>
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] font-black uppercase tracking-widest">
            <Link to="/" className="text-white hover:text-purple-500 transition-all">Bosh sahifa</Link>
            <Link to="/?genre=Katalog" className="text-gray-500 hover:text-white transition-all">Katalog</Link>
            <a href="#janrlar" className="text-gray-500 hover:text-white transition-all">Janrlar</a>
            <Link to="/?genre=Yangi" className="text-gray-500 hover:text-emerald-500 transition-all font-bold">Yangi</Link>
            <Link to="/?status=Davom etayotgan" className="text-gray-500 hover:text-white transition-all flex items-center gap-2">
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Davom etayotgan
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-global-chat'))}
              className="text-gray-500 hover:text-indigo-400 transition-all flex items-center gap-1.5 focus:outline-none uppercase"
            >
              <div className="w-4 h-4 rounded bg-indigo-500/20 text-indigo-500 flex items-center justify-center border border-indigo-500/30">
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
              className="w-full bg-white/5 border border-white/10 rounded-full py-2 px-10 text-sm focus:outline-none focus:border-purple-500 transition-all text-white placeholder-gray-500"
            />
            <button type="submit" className="absolute inset-y-0 left-0 pl-4 flex items-center">
              <Search className="h-4 w-4 text-gray-500 group-focus-within:text-purple-500 transition-colors" />
            </button>
          </form>
          
          {/* Header Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 mr-2">
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative p-2 rounded-full transition-colors focus:outline-none flex items-center justify-center bg-[#111] sm:bg-transparent ${showNotifications ? 'bg-white/10' : 'hover:bg-white/10'}`}
              >
                <Bell className="w-5 h-5 text-gray-400" />
                {hasUnread && (
                  <div className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#111] animate-pulse"></div>
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
                      <button 
                        onClick={() => setShowNotifications(false)}
                        className="text-gray-500 hover:text-white transition-colors p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto">
                      {activeNotifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                          <Bell className="w-10 h-10 text-gray-700 mb-3" />
                          <p className="text-sm font-medium text-gray-500">Hozircha yangi xabarlar yo'q.</p>
                        </div>
                      ) : (
                        <div className="flex flex-col divide-y divide-white/5">
                          {activeNotifications.map((notif) => (
                            <div key={notif.id} className="p-4 hover:bg-white/5 transition-colors cursor-default relative">
                              {!notif.isActive && (
                                <div className="absolute top-4 right-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest border border-gray-700 px-2 py-0.5 rounded">Eski</div>
                              )}
                              <div className="flex gap-4">
                                <div className={`mt-1 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getTypeStyles(notif.type)}`}>
                                  {getIcon(notif.type)}
                                </div>
                                <div className="flex-1 space-y-1">
                                  <h4 className="text-sm font-bold text-gray-200 line-clamp-1">{notif.title}</h4>
                                  <p className="text-xs text-gray-400 font-medium line-clamp-2 leading-relaxed">{notif.message}</p>
                                  <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest pt-1">
                                    {new Date(notif.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Lang */}
            <div 
              onClick={toggleLang}
              className="hidden sm:flex items-center gap-2 text-sm bg-white/5 px-3 py-1.5 rounded-md cursor-pointer hover:bg-white/10 transition-colors border border-transparent hover:border-white/10"
            >
              <span className="text-xs opacity-60 text-white">{lang}</span>
              <span className="text-white">{lang === 'UZ' ? 'O‘zbekcha' : 'English'}</span>
            </div>
          </div>

          {user?.role === 'admin' && (
            <Link to="/admin" className="hidden lg:flex items-center gap-2 text-xs bg-purple-600/20 text-purple-400 hover:text-white hover:bg-purple-600 px-3 py-1.5 rounded-md font-bold transition-all border border-purple-500/30 tracking-widest uppercase">
              <ShieldCheck className="w-3.5 h-3.5" />
              Admin Panel
            </Link>
          )}

          {user ? (
            <Link to="/profile" className="flex items-center gap-3 group">
              <div className="hidden sm:flex flex-col items-end">
                <div className="flex items-center gap-1.5 mb-0.5">
                  {user.role === 'admin' && <ShieldCheck className="w-2.5 h-2.5 text-purple-400" />}
                  <span className="text-[10px] font-black uppercase tracking-widest text-purple-400 leading-none">{user.name}</span>
                </div>
                <span className="text-[8px] font-bold text-gray-500 uppercase tracking-tighter">LVL {user.level || 1} • {user.points || 0} XP</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-blue-500 border border-white/20 flex-shrink-0 cursor-pointer group-hover:scale-105 transition-all shadow-xl shadow-purple-900/20 overflow-hidden ring-2 ring-transparent group-hover:ring-purple-500/50">
                <img src={user.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop"} alt="Profile" className="w-full h-full object-cover" />
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="hidden sm:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-white transition-all px-4 py-2">
                <LogIn className="w-3.5 h-3.5" />
                Kirish
              </Link>
              <Link to="/signup" className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest bg-white/5 hover:bg-purple-600 text-white rounded-xl px-5 py-2.5 border border-white/10 hover:border-purple-500 transition-all shadow-lg shadow-black/20">
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
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
              </span>
              Davom etayotgan
            </Link>
            <button 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('open-global-chat'));
                setIsMobileMenuOpen(false);
              }} 
              className="font-bold text-indigo-400 hover:text-indigo-300 px-4 py-3 flex items-center justify-start gap-2 focus:outline-none"
            >
              <MessageSquare className="w-4 h-4" /> Global Chat
            </button>
            <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="font-bold text-gray-400 hover:text-white px-4 py-3 flex items-center gap-2">
              <User className="w-4 h-4 text-purple-500" /> Profil
            </Link>
            <div className="pt-4 mt-2 border-t border-white/5">
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="w-full flex items-center justify-center gap-2 font-black text-purple-400 py-4 bg-purple-900/20 rounded-2xl border border-purple-500/20 tracking-widest uppercase text-xs">
                Admin Panel
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
