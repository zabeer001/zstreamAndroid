import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function ExploreEmptyState() {
  return (
    <View className="items-center rounded-md border border-outline-200 bg-background-0 px-4 py-10 dark:border-outline-800 dark:bg-background-900">
      <Ionicons name="newspaper-outline" size={26} color="#9CA3AF" />
      <Text className="mt-3 text-sm font-semibold text-typography-700 dark:text-typography-300">
        No posts found
      </Text>
      <Text className="mt-1 text-center text-xs text-typography-500 dark:text-typography-400">
        Try another search term.
      </Text>
    </View>
  );
}
