import { create } from 'zustand';

import { feedPosts, initialLovedPostIds } from './explore.data';
import type { FeedCategory, FeedPost } from './types';

type ExploreState = {
  activeCategory: FeedCategory;
  expandedPostIds: Set<string>;
  lovedPostIds: Set<string>;
  openCommentsId: string | null;
  posts: FeedPost[];
  query: string;
  clearQuery: () => void;
  setActiveCategory: (category: FeedCategory) => void;
  setQuery: (query: string) => void;
  toggleComments: (postId: string) => void;
  toggleLove: (postId: string) => void;
  toggleReadMore: (postId: string) => void;
};

export const useExploreStore = create<ExploreState>((set) => ({
  activeCategory: 'all',
  expandedPostIds: new Set(),
  lovedPostIds: new Set(initialLovedPostIds),
  openCommentsId: null,
  posts: feedPosts,
  query: '',
  clearQuery: () => set({ query: '' }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setQuery: (query) => set({ query }),
  toggleComments: (postId) =>
    set((state) => ({
      openCommentsId: state.openCommentsId === postId ? null : postId,
    })),
  toggleLove: (postId) =>
    set((state) => {
      const lovedPostIds = new Set(state.lovedPostIds);

      if (lovedPostIds.has(postId)) {
        lovedPostIds.delete(postId);
      } else {
        lovedPostIds.add(postId);
      }

      return { lovedPostIds };
    }),
  toggleReadMore: (postId) =>
    set((state) => {
      const expandedPostIds = new Set(state.expandedPostIds);

      if (expandedPostIds.has(postId)) {
        expandedPostIds.delete(postId);
      } else {
        expandedPostIds.add(postId);
      }

      return { expandedPostIds };
    }),
}));
