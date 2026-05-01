import type { Course, CourseCategoryItem } from './types';

export const courseCategories: CourseCategoryItem[] = [
  { key: 'all', label: 'All' },
  { key: 'design', label: 'Design' },
  { key: 'development', label: 'Dev' },
  { key: 'growth', label: 'Growth' },
];

export const initialSavedCourseIds = ['rn-systems'];

export const courses: Course[] = [
  {
    id: 'rn-systems',
    title: 'React Native Design Systems',
    instructor: 'Maya Rahman',
    category: 'design',
    image: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?auto=format&fit=crop&w=900&q=80',
    duration: '4h 20m',
    lessons: 18,
    level: 'Intermediate',
    students: '8.4k',
    summary: 'Build reusable mobile UI foundations with tokens, states, and practical component patterns.',
  },
  {
    id: 'expo-performance',
    title: 'Expo Performance Essentials',
    instructor: 'Arif Chowdhury',
    category: 'development',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80',
    duration: '3h 10m',
    lessons: 14,
    level: 'Advanced',
    students: '5.1k',
    summary: 'Profile slow screens, tune images and lists, and ship smoother Android experiences.',
  },
  {
    id: 'onboarding-growth',
    title: 'Onboarding That Converts',
    instructor: 'Nabila Karim',
    category: 'growth',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=900&q=80',
    duration: '2h 45m',
    lessons: 11,
    level: 'Beginner',
    students: '12k',
    summary: 'Design onboarding flows that explain value quickly and guide users to the next useful action.',
  },
];
