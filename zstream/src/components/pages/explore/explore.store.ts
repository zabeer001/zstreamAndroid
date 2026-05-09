import { create } from 'zustand';

import type { FeedCategory, FeedPost } from './types';

type ExploreState = {
  activeCategory: FeedCategory;
  expandedPostIds: Set<string>;
  openCommentsId: string | null;
  posts: FeedPost[];
  query: string;
  clearQuery: () => void;
  setActiveCategory: (category: FeedCategory) => void;
  setPosts: (posts: FeedPost[]) => void;
  setQuery: (query: string) => void;
  toggleComments: (postId: string) => void;
  toggleReadMore: (postId: string) => void;
  updatePost: (post: FeedPost) => void;
  updatePostShareCount: (postId: string, shareCount: number) => void;
};

export const useExploreStore = create<ExploreState>((set) => ({
  activeCategory: 'all',
  expandedPostIds: new Set(),
  openCommentsId: null,
  posts: [],
  query: '',
  clearQuery: () => set({ query: '' }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setPosts: (posts) => set({ posts }),
  setQuery: (query) => set({ query }),
  toggleComments: (postId) =>
    set((state) => ({
      openCommentsId: state.openCommentsId === postId ? null : postId,
    })),
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
  updatePost: (post) =>
    set((state) => ({
      posts: state.posts.map((currentPost) => (currentPost._id === post._id ? { ...currentPost, ...post } : currentPost)),
    })),
  updatePostShareCount: (postId, shareCount) =>
    set((state) => ({
      posts: state.posts.map((post) => (post._id === postId ? { ...post, shareCount } : post)),
    })),
}));
