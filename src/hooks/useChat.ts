import { useState, useEffect } from 'react';
import { Message, ChatHistory } from '../types';

const STORAGE_KEY = 'chat_histories';

export function useChat() {
  const [histories, setHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      setHistories(parsed);
      if (parsed.length > 0) {
        setCurrentChatId(parsed[0].id);
      }
    }
  }, []);

  const saveHistories = (newHistories: ChatHistory[]) => {
    setHistories(newHistories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistories));
  };

  const createChat = () => {
    const newChat: ChatHistory = {
      id: crypto.randomUUID(),
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
    };
    const updated = [newChat, ...histories];
    saveHistories(updated);
    setCurrentChatId(newChat.id);
    return newChat.id;
  };

  const addMessage = (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessage: Message = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    const updated = histories.map(chat => {
      if (chat.id === chatId) {
        const newMessages = [...chat.messages, newMessage];
        let newTitle = chat.title;
        if (chat.messages.length === 0 && message.role === 'user') {
          newTitle = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
        }
        return {
          ...chat,
          messages: newMessages,
          title: newTitle,
          updatedAt: Date.now(),
        };
      }
      return chat;
    });

    saveHistories(updated);
  };

  const deleteChat = (chatId: string) => {
    const filtered = histories.filter(chat => chat.id !== chatId);
    saveHistories(filtered);
    if (currentChatId === chatId) {
      setCurrentChatId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const clearMessages = (chatId: string) => {
    const updated = histories.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, messages: [], updatedAt: Date.now() };
      }
      return chat;
    });
    saveHistories(updated);
  };

  const currentChat = histories.find(chat => chat.id === currentChatId);

  return {
    histories,
    currentChat,
    currentChatId,
    setCurrentChatId,
    createChat,
    addMessage,
    deleteChat,
    clearMessages,
  };
}
