import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useChatStore } from '../chat.store';

export function ChatHeader() {
  const unreadTotal = useChatStore((state) =>
    state.conversations.reduce((sum, conversation) => sum + conversation.unread, 0)
  );

  return (
    <View className="mb-4 flex-row items-start justify-between gap-4">
      <View className="min-w-0 flex-1">
        <Text className="text-2xl font-bold text-typography-950 dark:text-typography-0">
          Messages
        </Text>
        <Text className="mt-1 text-sm text-typography-500 dark:text-typography-400">
          {unreadTotal ? `${unreadTotal} unread messages` : 'All caught up'}
        </Text>
      </View>
      <Pressable
        accessibilityLabel="Start new message"
        className="h-10 w-10 items-center justify-center rounded-md border border-outline-200 bg-background-0 dark:border-outline-800 dark:bg-background-900">
        <Ionicons name="create-outline" size={18} color="#6B7280" />
      </Pressable>
    </View>
  );
}
