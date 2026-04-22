import React, { useState, useRef, useEffect } from 'react';
import { useSupport } from '../context/SupportContext';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MessageSquare, Send, User, Clock, CheckCircle2 } from 'lucide-react';

export default function AdminSupport() {
  const { chats, replyMessage } = useSupport();
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  const selectedChat = chats.find(c => c.userId === selectedUserId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [selectedChat]);

  const handleReply = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!selectedUserId || !replyText.trim()) return;
    replyMessage(selectedUserId, replyText);
    setReplyText('');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-black tracking-tight">Yordam Markazi</h1>
        <p className="text-gray-500 mt-1">Foydalanuvchilar bilan jonli muloqot va yordam ko'rsatish bo'limi.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 min-h-[600px]">
        {/* Chat List */}
        <div className="lg:col-span-4 bg-[#0a0a0c] border border-white/5 rounded-[32px] overflow-hidden flex flex-col">
          <div className="p-6 border-b border-white/5 bg-white/[0.02]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Foydalanuvchini qidirish..." 
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {chats.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-30 mt-20">
                <MessageSquare className="w-12 h-12 mb-4" />
                <p className="text-xs font-black uppercase tracking-widest">Hozircha xabarlar yo'q</p>
              </div>
            ) : (
              chats.sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()).map((chat) => (
                <button
                  key={chat.userId}
                  onClick={() => setSelectedUserId(chat.userId)}
                  className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all group border ${
                    selectedUserId === chat.userId 
                      ? 'bg-blue-600/20 border-blue-500/30' 
                      : 'bg-white/5 border-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="relative">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/20 text-blue-400 font-bold">
                      {chat.userName.charAt(0).toUpperCase()}
                    </div>
                    {chat.unreadCount ? (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white rounded-full text-[10px] flex items-center justify-center font-black animate-pulse border-2 border-[#0a0a0c]">
                        {chat.unreadCount}
                      </span>
                    ) : (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0a0a0c]"></span>
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black truncate">{chat.userName}</span>
                      <span className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">
                        {new Date(chat.lastMessageAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 truncate mt-0.5">
                      {chat.messages[chat.messages.length - 1].text}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="lg:col-span-8 bg-[#0a0a0c] border border-white/5 rounded-[32px] overflow-hidden flex flex-col shadow-2xl relative">
          <AnimatePresence mode="wait">
            {selectedChat ? (
              <motion.div 
                key={selectedChat.userId}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex-1 flex flex-col h-full"
              >
                {/* Header */}
                <div className="p-6 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-2xl flex items-center justify-center font-black text-white text-xl">
                      {selectedChat.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-black text-lg">{selectedChat.userName}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                        <User className="w-3 h-3" />
                        Mijoz • ID: {selectedChat.userId}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl border border-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all outline-none">
                      <CheckCircle2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages Area */}
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar bg-[radial-gradient(circle_at_top_right,rgba(37,99,235,0.02),transparent)]"
                >
                  {selectedChat.messages.map((msg, idx) => (
                    <div 
                      key={msg.id} 
                      className={`flex ${msg.isAdmin ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[70%] ${msg.isAdmin ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center font-bold text-[10px] ${
                          msg.isAdmin ? 'bg-blue-600 text-white' : 'bg-white/10 text-gray-400'
                        }`}>
                          {msg.isAdmin ? 'AD' : selectedChat.userName.charAt(0).toUpperCase()}
                        </div>
                        <div className={`rounded-3xl p-4 text-sm ${
                          msg.isAdmin 
                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-900/20' 
                            : 'bg-white/5 border border-white/5 text-gray-300'
                        }`}>
                          <p>{msg.text}</p>
                          <div className={`flex items-center gap-2 mt-2 text-[8px] font-black uppercase tracking-widest ${
                            msg.isAdmin ? 'text-blue-200' : 'text-gray-600'
                          }`}>
                            <Clock className="w-2.5 h-2.5" />
                            {new Date(msg.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Reply Area */}
                <form 
                  onSubmit={handleReply}
                  className="p-6 bg-white/[0.02] border-t border-white/5"
                >
                  <div className="relative">
                    <textarea 
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Javobingizni shu yerga yozing..."
                      className="w-full bg-[#070708] border border-white/10 rounded-[24px] px-6 py-5 text-sm focus:outline-none focus:border-blue-500 transition-all pr-20 min-h-[100px] resize-none placeholder:text-gray-700"
                    />
                    <button 
                      type="submit"
                      className="absolute right-4 bottom-4 w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-blue-900/40 transition-all active:scale-95"
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-600 font-bold uppercase tracking-[0.2em] px-4">
                    <span>Ctrl + Enter orqali yuboring</span>
                    <span>•</span>
                    <span className="text-emerald-500">Avto-saqlash yoqilgan</span>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-20 opacity-20">
                <div className="w-32 h-32 bg-white/5 rounded-[40px] flex items-center justify-center mb-8 border border-white/5">
                  <MessageSquare className="w-12 h-12" />
                </div>
                <h3 className="text-2xl font-black uppercase tracking-widest">Suhbatni tanlang</h3>
                <p className="text-gray-500 mt-2 max-w-sm">Muloqotni boshlash uchun chap tarafdagi ro'yxatdan foydalanuvchini tanlang.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
