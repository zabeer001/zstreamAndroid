export type FeedCategory = 'all' | 'newspaper' | 'tech' | 'career';

export type FeedPost = {
  id: string;
  author: string;
  role: string;
  avatar: string;
  postedAt: string;
  category: Exclude<FeedCategory, 'all'>;
  title: string;
  body: string;
  tags: string[];
  loves: number;
  shares: number;
  comments: string[];
};

export type FeedCategoryItem = {
  key: FeedCategory;
  label: string;
};
