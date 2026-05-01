import type { FeedCategoryItem, FeedPost } from './types';

export const initialLovedPostIds = ['brand-refresh'];

export const feedCategories: FeedCategoryItem[] = [
  { key: 'all', label: 'All' },
  { key: 'newspaper', label: 'Newspaper' },
  { key: 'tech', label: 'Tech' },
  { key: 'career', label: 'Career' },
];

export const feedPosts: FeedPost[] = [
  {
    id: 'brand-refresh',
    author: 'Maya Rahman',
    role: 'Product designer',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
    postedAt: '2m',
    category: 'newspaper',
    title: 'A compact dashboard can still feel calm.',
    body: 'Spent the morning tightening a finance dashboard for mobile. The biggest win was removing visual noise from every card and letting the transaction feed carry the rhythm.',
    tags: ['Product Design', 'Mobile UI', 'Fintech'],
    loves: 34,
    shares: 6,
    comments: ['The spacing looks like it would scan really well.', 'Would love to see the empty states too.'],
  },
  {
    id: 'qa-build',
    author: 'Arif Chowdhury',
    role: 'Frontend developer',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
    postedAt: '8m',
    category: 'tech',
    title: 'Small Expo performance pass, big difference.',
    body: 'Swapped a heavy scroll screen into a cleaner list, trimmed a few image sizes, and Android finally stopped feeling sticky during QA.',
    tags: ['Expo', 'React Native', 'Performance'],
    loves: 18,
    shares: 3,
    comments: ['FlatList tuning is always worth it.', 'Did you also lazy-load the images?'],
  },
  {
    id: 'campaign-copy',
    author: 'Nabila Karim',
    role: 'Growth strategist',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    postedAt: '24m',
    category: 'career',
    title: 'Clear copy beats clever copy on onboarding.',
    body: 'A reminder from today: users do not need poetry when they are trying to finish setup. They need confidence, direction, and one obvious next step.',
    tags: ['Growth', 'UX Writing', 'Onboarding'],
    loves: 27,
    shares: 9,
    comments: ['Is the target audience creators or agencies?'],
  },
];
