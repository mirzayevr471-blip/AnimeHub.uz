import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, User, ChevronDown } from 'lucide-react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';
import { format } from 'date-fns';

interface ChatMessage {
  id: string;
  userId: string;
  name: string;
  avatar: string;
  text: string;
  timestamp: string;
  role: string;
  isSuperAdmin?: boolean;
}

export default function GlobalChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    // Listen for custom event from header or anywhere else to open the chat
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    
    window.addEventListener('open-global-chat', handleOpenChat);

    // Initialize socket connection
    socketRef.current = io(window.location.origin, { 
      path: '/socket.io',
      transports: ['polling', 'websocket'], // Polling first for better compatibility in restricted environments
      secure: true,
      rejectUnauthorized: false,
      reconnectionAttempts: 5,
      timeout: 10000
    });

    socketRef.current.on('connect', () => {
      setIsConnected(true);
      console.log('Chat connected');
    });

    socketRef.current.on('connect_error', (error) => {
      console.warn('Chat connection error (expected in some dev environments):', error.message);
      setIsConnected(false);
    });

    socketRef.current.on('disconnect', (reason) => {
      setIsConnected(false);
      console.log('Chat disconnected:', reason);
    });

    socketRef.current.on('chat:history', (history: ChatMessage[]) => {
      setMessages(history);
      scrollToBottom();
    });

    socketRef.current.on('chat:message', (msg: ChatMessage) => {
      setMessages((prev) => [...prev, msg]);
      if (!isOpen) {
        setHasUnread(true);
      }
      setTimeout(scrollToBottom, 100);
    });

    return () => {
      window.removeEventListener('open-global-chat', handleOpenChat);
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      scrollToBottom();
    }
  }, [isOpen]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newMessage.trim() || !user || !socketRef.current) return;

    socketRef.current.emit('chat:message', {
      userId: user.id,
      name: user.name,
      avatar: user.avatar,
      text: newMessage.trim(),
      role: user.role,
      isSuperAdmin: user.isSuperAdmin,
    });

    setNewMessage('');
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start shadow-2xl">
        {!isOpen && (
          <motion.button
            onClick={() => setIsOpen(true)}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-14 h-14 bg-blue-600 hover:bg-blue-700 rounded-full flex items-center justify-center text-white shadow-2xl shadow-blue-600/30 transition-colors relative group"
          >
            <MessageSquare className="w-6 h-6 z-10" />
            <div className="absolute inset-0 bg-blue-500 rounded-full blur-[2px] opacity-0 group-hover:opacity-40 transition-opacity" />
            {hasUnread && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-rose-500 rounded-full border-2 border-[#0a0a0c] shadow-lg animate-pulse" />
            )}
          </motion.button>
        )}

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="absolute bottom-0 left-0 w-[350px] sm:w-[400px] bg-[#0a0a0c] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] h-[600px] shadow-blue-900/20"
            >
              {/* Header */}
              <div className="p-4 bg-gradient-to-r from-blue-900/40 to-blue-800/40 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center border-2 border-[#0a0a0c] z-10">
                      <MessageSquare className="w-4 h-4 text-white" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm leading-tight text-white">Global Chat</h3>
                    <div className="flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500 animate-pulse'}`} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isConnected ? 'text-gray-400' : 'text-rose-400'}`}>
                        {isConnected ? 'Onlayn' : 'Ulanmoqda...'}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 bg-white/5 hover:bg-white/10 rounded-xl transition-colors text-gray-400 hover:text-white"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div 
                ref={scrollContainerRef}
                className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4"
              >
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                    <MessageSquare className="w-12 h-12 mb-3" />
                    <p className="text-xs font-black uppercase tracking-widest">Hali hech qanday xabar yo'q</p>
                    <p className="text-[10px] mt-1 font-medium">Birinchi bo'lib xabar yuboring!</p>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const isMe = user?.id === msg.userId;
                    const isSystemAdmin = msg.isSuperAdmin;
                    const showHeader = i === 0 || messages[i - 1].userId !== msg.userId;

                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        {showHeader && !isMe && (
                          <div className="flex items-center gap-2 mb-1.5 ml-1">
                            <span className="text-[10px] font-bold text-gray-400">{msg.name}</span>
                            {isSystemAdmin ? (
                              <span className="text-[8px] font-black tracking-widest uppercase bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/20">
                                Super Admin
                              </span>
                            ) : msg.role === 'admin' ? (
                              <span className="text-[8px] font-black tracking-widest uppercase bg-sky-500/20 text-sky-400 px-1.5 py-0.5 rounded border border-sky-500/20">
                                Admin
                              </span>
                            ) : null}
                          </div>
                        )}
                        
                        <div className={`flex gap-2 max-w-[85%] ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                          {showHeader && !isMe && (
                            <img src={msg.avatar} alt={msg.name} className="w-8 h-8 rounded-full mt-auto mb-1 border border-white/5 flex-shrink-0" referrerPolicy="no-referrer" />
                          )}
                          {!showHeader && !isMe && <div className="w-8 ml-2" />}
                          
                          <div className={`group relative flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                            <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                              isMe 
                                ? 'bg-blue-600 text-white rounded-br-sm' 
                                : isSystemAdmin
                                  ? 'bg-gradient-to-r from-blue-900/60 to-blue-800/60 border border-blue-500/20 text-white rounded-bl-sm'
                                  : 'bg-white/10 text-gray-200 rounded-bl-sm border border-white/5'
                            }`}>
                              {msg.text}
                            </div>
                            <span className={`text-[8px] font-medium text-gray-500 mt-1 opacity-0 group-hover:opacity-100 transition-opacity ${
                               isMe ? 'mr-1' : 'ml-1'
                            }`}>
                              {format(new Date(msg.timestamp), 'HH:mm')}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 bg-white/5 border-t border-white/10">
                {user ? (
                  <form onSubmit={handleSendMessage} className="relative flex items-center">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Xabar yozing..."
                      className="w-full bg-[#0a0a0c] border border-white/10 rounded-2xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                      maxLength={500}
                    />
                    <button
                      type="submit"
                      disabled={!newMessage.trim()}
                      className="absolute right-2 p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-white/5 disabled:text-gray-500 text-white rounded-xl transition-colors"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <div className="bg-[#0a0a0c] border border-dashed border-white/10 rounded-xl p-4 text-center">
                    <p className="text-xs text-gray-400 font-medium font-bold mb-2">Chatda qatnashish uchun tizimga kiring</p>
                    <a href="/login" className="text-[10px] font-black uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
                      Kirish
                    </a>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
