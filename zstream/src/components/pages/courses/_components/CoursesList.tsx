import { useMemo } from 'react';
import { View } from 'react-native';

import { useCoursesStore } from '../courses.store';
import { CourseCard } from './CourseCard';
import { CoursesEmptyState } from './CoursesEmptyState';

export function CoursesList() {
  const activeCategory = useCoursesStore((state) => state.activeCategory);
  const courses = useCoursesStore((state) => state.courses);
  const query = useCoursesStore((state) => state.query);

  const visibleCourses = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return courses.filter((course) => {
      if (activeCategory !== 'all' && course.category !== activeCategory) return false;
      if (!normalizedQuery) return true;

      return [course.title, course.instructor, course.summary, course.category, course.level]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [activeCategory, courses, query]);

  return (
    <View className="gap-3">
      {visibleCourses.map((course) => (
        <CourseCard course={course} key={course.id} />
      ))}

      {!visibleCourses.length ? <CoursesEmptyState /> : null}
    </View>
  );
}
