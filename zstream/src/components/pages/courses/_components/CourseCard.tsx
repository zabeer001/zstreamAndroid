import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { useCoursesStore } from '../courses.store';
import type { Course } from '../types';

type CourseCardProps = {
  course: Course;
};

export function CourseCard({ course }: CourseCardProps) {
  const isSaved = useCoursesStore((state) => state.savedCourseIds.has(course.id));
  const toggleSavedCourse = useCoursesStore((state) => state.toggleSavedCourse);

  return (
    <View className="overflow-hidden rounded-md border border-outline-200 bg-background-0 dark:border-outline-800 dark:bg-background-900">
      <Image contentFit="cover" source={course.image} style={{ height: 112, width: '100%' }} />
      <View className="p-3">
        <View className="flex-row items-start gap-3">
          <View className="min-w-0 flex-1">
            <Text
              className="text-base font-bold text-typography-950 dark:text-typography-0"
              numberOfLines={2}>
              {course.title}
            </Text>
            <Text className="mt-1 text-xs text-typography-500 dark:text-typography-400">
              {course.instructor}
            </Text>
          </View>
          <Pressable
            accessibilityLabel={isSaved ? 'Remove saved course' : 'Save course'}
            className="h-8 w-8 items-center justify-center"
            onPress={() => toggleSavedCourse(course.id)}>
            <Ionicons
              color={isSaved ? '#14A800' : '#9CA3AF'}
              name={isSaved ? 'bookmark' : 'bookmark-outline'}
              size={18}
            />
          </Pressable>
        </View>

        <Text
          className="mt-2 text-sm leading-5 text-typography-600 dark:text-typography-300"
          numberOfLines={2}>
          {course.summary}
        </Text>

        <View className="mt-3 flex-row flex-wrap gap-2">
          <View className="rounded bg-background-50 px-2 py-1 dark:bg-background-800">
            <Text className="text-xs font-semibold text-typography-500 dark:text-typography-400">
              {course.level}
            </Text>
          </View>
          <View className="rounded bg-background-50 px-2 py-1 dark:bg-background-800">
            <Text className="text-xs font-semibold text-typography-500 dark:text-typography-400">
              {course.lessons} lessons
            </Text>
          </View>
          <View className="rounded bg-background-50 px-2 py-1 dark:bg-background-800">
            <Text className="text-xs font-semibold text-typography-500 dark:text-typography-400">
              {course.duration}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row items-center justify-between border-t border-outline-100 pt-3 dark:border-outline-800">
          <View className="flex-row items-center gap-1.5">
            <Ionicons name="people-outline" size={16} color="#6B7280" />
            <Text className="text-sm font-semibold text-typography-500 dark:text-typography-400">
              {course.students} learners
            </Text>
          </View>
          <Text className="text-sm font-bold text-success-700 dark:text-success-500">
            View course
          </Text>
        </View>
      </View>
    </View>
  );
}
