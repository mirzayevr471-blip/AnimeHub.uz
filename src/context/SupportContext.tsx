import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportChat, SupportMessage } from '../types';

interface SupportContextType {
  chats: SupportChat[];
  userChat: SupportMessage[];
  sendMessage: (text: string, isAdmin?: boolean, userId?: string) => void;
  replyMessage: (userId: string, text: string) => void;
  isWidgetOpen: boolean;
  setIsWidgetOpen: (open: boolean) => void;
}

const SupportContext = createContext<SupportContextType | undefined>(undefined);

// Mock initial data if needed
const INITIAL_CHATS: SupportChat[] = [];

export const SupportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<SupportChat[]>(INITIAL_CHATS);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  
  // Current user's chat (from their perspective)
  const [userChat, setUserChat] = useState<SupportMessage[]>([]);

  // Current user's ID (hardcoded for demo)
  const currentUserId = 'user-1';
  const currentUserName = 'Asadbek Developer';

  const sendMessage = (text: string, isAdmin = false, userId = currentUserId) => {
    const newMessage: SupportMessage = {
      id: Date.now().toString(),
      senderId: isAdmin ? 'admin' : userId,
      senderName: isAdmin ? 'Admin' : currentUserName,
      text,
      timestamp: new Date().toISOString(),
      isAdmin,
    };

    if (!isAdmin) {
      // User sending a message
      setUserChat(prev => [...prev, newMessage]);
      
      // Update global chats for admin view
      setChats(prev => {
        const existingChatIdx = prev.findIndex(c => c.userId === userId);
        if (existingChatIdx > -1) {
          const updatedChats = [...prev];
          updatedChats[existingChatIdx] = {
            ...updatedChats[existingChatIdx],
            messages: [...updatedChats[existingChatIdx].messages, newMessage],
            lastMessageAt: newMessage.timestamp,
            unreadCount: (updatedChats[existingChatIdx].unreadCount || 0) + 1
          };
          return updatedChats;
        } else {
          return [...prev, {
            userId,
            userName: currentUserName,
            messages: [newMessage],
            lastMessageAt: newMessage.timestamp,
            unreadCount: 1
          }];
        }
      });

      // Auto-reply simulation after 2 seconds for first message
      if (userChat.length === 0) {
        setTimeout(() => {
          const autoReply: SupportMessage = {
            id: (Date.now() + 1).toString(),
            senderId: 'admin',
            senderName: 'Admin Support',
            text: "Assalomu alaykum! Yordam kerakmi? Hozir administratorlarimiz sizga javob berishadi.",
            timestamp: new Date().toISOString(),
            isAdmin: true,
          };
          setUserChat(prev => [...prev, autoReply]);
        }, 1500);
      }
    }
  };

  const replyMessage = (userId: string, text: string) => {
    const newMessage: SupportMessage = {
      id: Date.now().toString(),
      senderId: 'admin',
      senderName: 'Admin',
      text,
      timestamp: new Date().toISOString(),
      isAdmin: true,
    };

    setChats(prev => prev.map(chat => {
      if (chat.userId === userId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage],
          lastMessageAt: newMessage.timestamp,
          unreadCount: 0
        };
      }
      return chat;
    }));

    // In a real app, this would sync to the user's view via websockets
    // For demo, we update userChat if the userId matches our demo user
    if (userId === currentUserId) {
      setUserChat(prev => [...prev, newMessage]);
    }
  };

  return (
    <SupportContext.Provider value={{ chats, userChat, sendMessage, replyMessage, isWidgetOpen, setIsWidgetOpen }}>
      {children}
    </SupportContext.Provider>
  );
};

export const useSupport = () => {
  const context = useContext(SupportContext);
  if (!context) throw new Error("useSupport must be used within SupportProvider");
  return context;
};
