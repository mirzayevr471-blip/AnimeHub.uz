import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, Send, User, ShieldCheck } from 'lucide-react';
import { useSupport } from '../context/SupportContext';

export default function SupportWidget() {
  const { userChat, sendMessage, isWidgetOpen, setIsWidgetOpen } = useSupport();
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [userChat, isWidgetOpen]);

  const handleSend = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    sendMessage(inputText);
    setInputText('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      <AnimatePresence>
        {isWidgetOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="mb-4 w-80 md:w-96 bg-[#0a0a0c] border border-white/10 rounded-[32px] shadow-2xl overflow-hidden flex flex-col"
            style={{ height: '500px' }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center">
                  <ShieldCheck className="text-white w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">Yordam Markazi</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span className="text-[10px] text-purple-100 font-bold uppercase tracking-tighter">Online</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsWidgetOpen(false)}
                className="text-white/60 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages Area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar"
            >
              {userChat.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
                  <MessageCircle className="w-12 h-12 mb-4 text-purple-500" />
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-500">Savolingizni yozing. Biz yordam berishga tayyormiz!</p>
                </div>
              ) : (
                userChat.map((msg) => (
                  <div 
                    key={msg.id} 
                    className={`flex ${msg.isAdmin ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${
                      msg.isAdmin 
                        ? 'bg-white/5 border border-white/5 text-gray-300' 
                        : 'bg-purple-600 text-white shadow-lg shadow-purple-900/20'
                    }`}>
                      <p>{msg.text}</p>
                      <span className={`text-[8px] font-black uppercase mt-1 block tracking-widest ${
                        msg.isAdmin ? 'text-gray-600' : 'text-purple-300'
                      }`}>
                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input Area */}
            <form 
              onSubmit={handleSend}
              className="p-4 bg-white/[0.02] border-t border-white/5"
            >
              <div className="relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Xabaringizni yozing..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-purple-500 transition-all pr-14"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-2 bottom-2 w-10 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center transition-all active:scale-90"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsWidgetOpen(!isWidgetOpen)}
        className={`w-14 h-14 md:w-16 md:h-16 rounded-[24px] flex items-center justify-center shadow-2xl transition-all ${
          isWidgetOpen ? 'bg-white text-black rotate-90' : 'bg-purple-600 text-white hover:bg-purple-700'
        }`}
      >
        {isWidgetOpen ? <X className="w-8 h-8" /> : <MessageCircle className="w-8 h-8" />}
      </motion.button>
    </div>
  );
}
