import { create } from 'zustand';

import { initialConversations, initialFavoriteIds } from './chat.data';
import type { ChatTab, Conversation } from './types';

type ChatState = {
  activeTab: ChatTab;
  conversations: Conversation[];
  favoriteIds: Set<string>;
  query: string;
  clearQuery: () => void;
  selectConversation: (conversationId: string) => void;
  setActiveTab: (tab: ChatTab) => void;
  setQuery: (query: string) => void;
  toggleFavorite: (conversationId: string) => void;
};

export const useChatStore = create<ChatState>((set) => ({
  activeTab: 'recent',
  conversations: initialConversations,
  favoriteIds: new Set(initialFavoriteIds),
  query: '',
  clearQuery: () => set({ query: '' }),
  selectConversation: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation
      ),
    })),
  setActiveTab: (activeTab) => set({ activeTab }),
  setQuery: (query) => set({ query }),
  toggleFavorite: (conversationId) =>
    set((state) => {
      const favoriteIds = new Set(state.favoriteIds);

      if (favoriteIds.has(conversationId)) {
        favoriteIds.delete(conversationId);
      } else {
        favoriteIds.add(conversationId);
      }

      return { favoriteIds };
    }),
}));
