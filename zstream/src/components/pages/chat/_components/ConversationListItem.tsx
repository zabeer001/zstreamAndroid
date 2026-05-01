import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { useChatStore } from '../chat.store';
import type { Conversation } from '../types';

type ConversationListItemProps = {
  conversation: Conversation;
  isLast: boolean;
};

export function ConversationListItem({ conversation, isLast }: ConversationListItemProps) {
  const isFavorite = useChatStore((state) => state.favoriteIds.has(conversation.id));
  const selectConversation = useChatStore((state) => state.selectConversation);
  const toggleFavorite = useChatStore((state) => state.toggleFavorite);

  return (
    <Pressable
      className={`border-outline-100 px-3 py-3 dark:border-outline-800 ${isLast ? '' : 'border-b'}`}
      onPress={() => selectConversation(conversation.id)}>
      <View className="flex-row items-center gap-3">
        <Image
          contentFit="cover"
          source={conversation.avatar}
          style={{ borderRadius: 999, height: 42, width: 42 }}
        />

        <View className="min-w-0 flex-1">
          <View className="flex-row items-center gap-2">
            <Text
              className="min-w-0 flex-1 text-sm font-bold text-typography-950 dark:text-typography-0"
              numberOfLines={1}>
              {conversation.name}
            </Text>
            <Text className="text-xs text-typography-400">{conversation.timestamp}</Text>
          </View>
          <Text
            className="mt-0.5 text-xs text-typography-500 dark:text-typography-400"
            numberOfLines={1}>
            {conversation.title}
          </Text>
          <Text
            className={`mt-1 text-sm ${
              conversation.unread
                ? 'font-semibold text-typography-900 dark:text-typography-100'
                : 'text-typography-500 dark:text-typography-400'
            }`}
            numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
        </View>

        <View className="items-center gap-2">
          <Pressable
            accessibilityLabel={
              isFavorite
                ? `Remove ${conversation.name} from favorites`
                : `Add ${conversation.name} to favorites`
            }
            className="h-8 w-8 items-center justify-center"
            onPress={() => toggleFavorite(conversation.id)}>
            <Ionicons
              color={isFavorite ? '#14A800' : '#9CA3AF'}
              name={isFavorite ? 'star' : 'star-outline'}
              size={16}
            />
          </Pressable>
          {conversation.unread ? (
            <View className="h-5 min-w-5 items-center justify-center rounded-full bg-success-600 px-1.5">
              <Text className="text-xs font-bold text-white">{conversation.unread}</Text>
            </View>
          ) : (
            <View className="h-5" />
          )}
        </View>
      </View>
    </Pressable>
  );
}
