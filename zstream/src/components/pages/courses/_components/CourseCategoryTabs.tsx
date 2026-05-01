import { Pressable, Text, View } from 'react-native';

import { courseCategories } from '../courses.data';
import { useCoursesStore } from '../courses.store';

export function CourseCategoryTabs() {
  const activeCategory = useCoursesStore((state) => state.activeCategory);
  const setActiveCategory = useCoursesStore((state) => state.setActiveCategory);

  return (
    <View className="mb-4 flex-row rounded-md border border-outline-200 bg-background-50 p-1 dark:border-outline-800 dark:bg-background-900">
      {courseCategories.map((category) => {
        const isActive = activeCategory === category.key;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={`h-9 flex-1 items-center justify-center rounded ${
              isActive ? 'bg-background-0 dark:bg-background-800' : ''
            }`}
            key={category.key}
            onPress={() => setActiveCategory(category.key)}>
            <Text
              className={`text-sm font-semibold ${
                isActive
                  ? 'text-success-700 dark:text-success-500'
                  : 'text-typography-500 dark:text-typography-400'
              }`}>
              {category.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
