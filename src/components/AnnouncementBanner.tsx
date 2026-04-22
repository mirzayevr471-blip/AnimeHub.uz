import React from 'react';
import { useAnnouncements } from '../context/AnnouncementContext';
import { motion, AnimatePresence } from 'motion/react';
import { Megaphone, X, ChevronRight, AlertTriangle, Info, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AnnouncementBanner() {
  const { announcements, updateAnnouncement } = useAnnouncements();
  
  // Show only active announcements
  const activeAnnouncements = announcements.filter(a => a.isActive);

  if (activeAnnouncements.length === 0) return null;

  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-500';
      case 'danger': return 'bg-blue-500/10 border-blue-500/20 text-blue-500';
      case 'success': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500';
      case 'info':
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'warning': return <AlertTriangle className="w-5 h-5" />;
      case 'danger': return <AlertTriangle className="w-5 h-5 text-blue-500" />;
      case 'success': return <CheckCircle2 className="w-5 h-5" />;
      case 'info':
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="sticky top-0 z-[100] flex flex-col w-full">
      <AnimatePresence>
        {activeAnnouncements.map((announcement) => (
          <motion.div
            key={announcement.id}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50, height: 0 }}
            className="w-full"
          >
            <div className={`border-b backdrop-blur-md px-4 py-3 flex items-center justify-between gap-4 ${getTypeStyles(announcement.type)}`}>
              <div className="flex items-center gap-3 container max-w-screen-2xl mx-auto">
                <div className="hidden sm:flex w-8 h-8 rounded-full bg-current opacity-20 items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center opacity-100 mix-blend-screen text-white">
                     {getIcon(announcement.type)}
                  </div>
                </div>
                <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                  <strong className="text-sm font-black tracking-tight">{announcement.title}</strong>
                  <span className="text-xs sm:text-sm font-medium opacity-90">{announcement.message}</span>
                  
                  {announcement.link && (
                    <a 
                      href={announcement.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-widest hover:underline mt-1 sm:mt-0"
                    >
                      Batafsil <ChevronRight className="w-3 h-3" />
                    </a>
                  )}
                </div>
                
                <button 
                  prevent-default="true"
                  onClick={() => updateAnnouncement(announcement.id, { isActive: false })}
                  className="p-1.5 hover:bg-black/10 rounded-full transition-colors flex-shrink-0"
                  aria-label="Yopish"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
