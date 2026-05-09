import type { Post } from '@/src/lib/api';

export type FeedCategory = 'all' | 'newspaper' | 'tech' | 'career';

export type FeedCategoryItem = {
  key: FeedCategory;
  label: string;
};

export type FeedPost = Post;
