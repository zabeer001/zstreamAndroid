export type CourseCategory = 'all' | 'design' | 'development' | 'growth';

export type Course = {
  id: string;
  title: string;
  instructor: string;
  category: Exclude<CourseCategory, 'all'>;
  image: string;
  duration: string;
  lessons: number;
  level: string;
  students: string;
  summary: string;
};

export type CourseCategoryItem = {
  key: CourseCategory;
  label: string;
};
