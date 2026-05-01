import { Text, View } from 'react-native';

import { useCoursesStore } from '../courses.store';

export function CoursesHeader() {
  const courseCount = useCoursesStore((state) => state.courses.length);

  return (
    <View className="mb-4">
      <Text className="text-2xl font-bold text-typography-950 dark:text-typography-0">
        Courses
      </Text>
      <Text className="mt-1 text-sm text-typography-500 dark:text-typography-400">
        Browse {courseCount} courses selected by the app
      </Text>
    </View>
  );
}
