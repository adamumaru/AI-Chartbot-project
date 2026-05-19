import { useState, useEffect } from 'react';
import { KnowledgeItem } from '../types';
import initialKnowledge from '../data/initialKnowledge.json';

const STORAGE_KEY = 'knowledge_base';

export function useKnowledge() {
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setKnowledge(JSON.parse(stored));
    } else {
      setKnowledge(initialKnowledge as KnowledgeItem[]);
    }
  }, []);

  const saveKnowledge = (newKnowledge: KnowledgeItem[]) => {
    setKnowledge(newKnowledge);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newKnowledge));
  };

  const addKnowledge = (item: Omit<KnowledgeItem, 'id' | 'updatedAt'>) => {
    const newItem: KnowledgeItem = {
      ...item,
      id: crypto.randomUUID(),
      updatedAt: Date.now(),
    };
    saveKnowledge([newItem, ...knowledge]);
  };

  const updateKnowledge = (id: string, updates: Partial<KnowledgeItem>) => {
    const updated = knowledge.map((item) =>
      item.id === id ? { ...item, ...updates, updatedAt: Date.now() } : item
    );
    saveKnowledge(updated);
  };

  const deleteKnowledge = (id: string) => {
    const filtered = knowledge.filter((item) => item.id !== id);
    saveKnowledge(filtered);
  };

  const findRelevantContext = (query: string) => {
    // Simple keyword matching for local context search
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 3);
    const relevantItems = knowledge.filter(item => {
      const content = (item.title + ' ' + item.content).toLowerCase();
      return keywords.some(keyword => content.includes(keyword));
    });
    
    return relevantItems.map(item => item.content).join('\n\n');
  };

  return {
    knowledge,
    addKnowledge,
    updateKnowledge,
    deleteKnowledge,
    findRelevantContext,
    saveKnowledge
  };
}
