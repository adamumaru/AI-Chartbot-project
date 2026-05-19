import { useState, useEffect } from 'react';
import { Message, ChatHistory } from '../types';
import { supabase } from '../lib/supabase';

const STORAGE_KEY = 'chat_histories';

export function useChat() {
  const [histories, setHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // 1. Listen to Auth State
  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // 2. Load Chats
  useEffect(() => {
    if (user) {
      // Load from Supabase
      const loadSupabaseChats = async () => {
        setLoading(true);
        try {
          // Fetch chats
          const { data: chatsData, error: chatsError } = await supabase
            .from('chats')
            .select('*')
            .order('updated_at', { ascending: false });

          if (chatsError) throw chatsError;

          if (!chatsData || chatsData.length === 0) {
            setHistories([]);
            setCurrentChatId(null);
            return;
          }

          // Fetch all messages for these chats
          const chatIds = chatsData.map(c => c.id);
          const { data: msgsData, error: msgsError } = await supabase
            .from('messages')
            .select('*')
            .in('chat_id', chatIds)
            .order('timestamp', { ascending: true });

          if (msgsError) throw msgsError;

          const formattedHistories: ChatHistory[] = chatsData.map(chat => {
            const chatMsgs = (msgsData || [])
              .filter(m => m.chat_id === chat.id)
              .map(m => ({
                id: m.id,
                role: m.role as "user" | "assistant",
                content: m.content,
                timestamp: Number(m.timestamp)
              }));

            return {
              id: chat.id,
              title: chat.title,
              messages: chatMsgs,
              updatedAt: new Date(chat.updated_at).getTime()
            };
          });

          setHistories(formattedHistories);
          if (formattedHistories.length > 0) {
            setCurrentChatId(formattedHistories[0].id);
          }
        } catch (err) {
          console.error("Error loading chats from Supabase:", err);
        } finally {
          setLoading(false);
        }
      };

      loadSupabaseChats();
    } else {
      // Fallback: load from LocalStorage when not logged in
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setHistories(parsed);
        if (parsed.length > 0) {
          setCurrentChatId(parsed[0].id);
        }
      } else {
        setHistories([]);
        setCurrentChatId(null);
      }
    }
  }, [user]);

  const saveHistories = (newHistories: ChatHistory[]) => {
    setHistories(newHistories);
    if (!user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newHistories));
    }
  };

  const createChat = async () => {
    const newChatId = crypto.randomUUID();
    const newChat: ChatHistory = {
      id: newChatId,
      title: 'New Chat',
      messages: [],
      updatedAt: Date.now(),
    };

    if (user) {
      try {
        const { error } = await supabase
          .from('chats')
          .insert({
            id: newChatId,
            user_id: user.id,
            title: 'New Chat',
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      } catch (err) {
        console.error("Error creating chat in Supabase:", err);
      }
    }

    const updated = [newChat, ...histories];
    saveHistories(updated);
    setCurrentChatId(newChatId);
    return newChatId;
  };

  const addMessage = async (chatId: string, message: Omit<Message, 'id' | 'timestamp'>) => {
    const newMessageId = crypto.randomUUID();
    const timestamp = Date.now();
    const newMessage: Message = {
      ...message,
      id: newMessageId,
      timestamp,
    };

    const updated = histories.map(chat => {
      if (chat.id === chatId) {
        const newMessages = [...chat.messages, newMessage];
        let newTitle = chat.title;
        if (chat.messages.length === 0 && message.role === 'user') {
          newTitle = message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '');
        }

        // Save to Supabase if logged in
        if (user) {
          supabase
            .from('messages')
            .insert({
              id: newMessageId,
              chat_id: chatId,
              role: message.role,
              content: message.content,
              timestamp
            })
            .then(({ error }) => {
              if (error) console.error("Error inserting message in Supabase:", error);
            });

          supabase
            .from('chats')
            .update({
              title: newTitle,
              updated_at: new Date().toISOString()
            })
            .eq('id', chatId)
            .then(({ error }) => {
              if (error) console.error("Error updating chat title in Supabase:", error);
            });
        }

        return {
          ...chat,
          messages: newMessages,
          title: newTitle,
          updatedAt: timestamp,
        };
      }
      return chat;
    });

    saveHistories(updated);
  };

  const deleteChat = async (chatId: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('chats')
          .delete()
          .eq('id', chatId);

        if (error) throw error;
      } catch (err) {
        console.error("Error deleting chat from Supabase:", err);
      }
    }

    const filtered = histories.filter(chat => chat.id !== chatId);
    saveHistories(filtered);

    if (currentChatId === chatId) {
      setCurrentChatId(filtered.length > 0 ? filtered[0].id : null);
    }
  };

  const clearMessages = async (chatId: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('chat_id', chatId);

        if (error) throw error;
      } catch (err) {
        console.error("Error clearing messages in Supabase:", err);
      }
    }

    const updated = histories.map(chat => {
      if (chat.id === chatId) {
        return { ...chat, messages: [], updatedAt: Date.now() };
      }
      return chat;
    });

    saveHistories(updated);
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out from Supabase:", error);
    } else {
      setUser(null);
      setHistories([]);
      setCurrentChatId(null);
    }
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
    user,
    loading,
    logout
  };
}
