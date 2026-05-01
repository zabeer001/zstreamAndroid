import { create } from 'zustand';

import { courses, initialSavedCourseIds } from './courses.data';
import type { Course, CourseCategory } from './types';

type CoursesState = {
  activeCategory: CourseCategory;
  courses: Course[];
  query: string;
  savedCourseIds: Set<string>;
  clearQuery: () => void;
  setActiveCategory: (category: CourseCategory) => void;
  setQuery: (query: string) => void;
  toggleSavedCourse: (courseId: string) => void;
};

export const useCoursesStore = create<CoursesState>((set) => ({
  activeCategory: 'all',
  courses,
  query: '',
  savedCourseIds: new Set(initialSavedCourseIds),
  clearQuery: () => set({ query: '' }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),
  setQuery: (query) => set({ query }),
  toggleSavedCourse: (courseId) =>
    set((state) => {
      const savedCourseIds = new Set(state.savedCourseIds);

      if (savedCourseIds.has(courseId)) {
        savedCourseIds.delete(courseId);
      } else {
        savedCourseIds.add(courseId);
      }

      return { savedCourseIds };
    }),
}));
