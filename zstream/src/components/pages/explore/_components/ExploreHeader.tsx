import { Text, View } from 'react-native';

export function ExploreHeader() {
  return (
    <View className="mb-4">
      <Text className="text-2xl font-bold text-typography-950 dark:text-typography-0">
        Explore
      </Text>
      <Text className="mt-1 text-sm text-typography-500 dark:text-typography-400">
        Posts, ideas, and conversations from the network
      </Text>
    </View>
  );
}
