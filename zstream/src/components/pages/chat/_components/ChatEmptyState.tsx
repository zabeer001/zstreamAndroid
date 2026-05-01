import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function ChatEmptyState() {
  return (
    <View className="items-center px-4 py-10">
      <Ionicons name="chatbox-outline" size={26} color="#9CA3AF" />
      <Text className="mt-3 text-sm font-semibold text-typography-700 dark:text-typography-300">
        No messages found
      </Text>
      <Text className="mt-1 text-center text-xs text-typography-500 dark:text-typography-400">
        Try another filter or search term.
      </Text>
    </View>
  );
}
