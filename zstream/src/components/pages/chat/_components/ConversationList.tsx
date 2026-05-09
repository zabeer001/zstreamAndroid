import { useMemo } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

import { useChatStore } from '../chat.store';
import { ChatEmptyState } from './ChatEmptyState';
import { ConversationListItem } from './ConversationListItem';

export function ConversationList() {
  const activeTab = useChatStore((state) => state.activeTab);
  const conversations = useChatStore((state) => state.conversations);
  const favoriteIds = useChatStore((state) => state.favoriteIds);
  const isLoadingConversations = useChatStore((state) => state.isLoadingConversations);
  const query = useChatStore((state) => state.query);

  const visibleConversations = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return conversations
      .filter((conversation) => {
        if (activeTab === 'recent' && !conversation.recent) return false;
        if (activeTab === 'favorites' && !favoriteIds.has(conversation.id)) return false;
        if (!normalizedQuery) return true;

        return [conversation.name, conversation.title, conversation.lastMessage]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      })
      .sort((a, b) => b.lastActive - a.lastActive);
  }, [activeTab, conversations, favoriteIds, query]);

  return (
    <View className="overflow-hidden rounded-md border border-outline-200 bg-background-0 dark:border-outline-800 dark:bg-background-900">
      {isLoadingConversations ? (
        <View className="items-center px-4 py-10">
          <ActivityIndicator color="#14A800" />
          <Text className="mt-3 text-sm font-semibold text-typography-700 dark:text-typography-300">
            Loading chats
          </Text>
        </View>
      ) : null}

      {!isLoadingConversations
        ? visibleConversations.map((conversation, index) => (
            <ConversationListItem
              conversation={conversation}
              isLast={index === visibleConversations.length - 1}
              key={conversation.id}
            />
          ))
        : null}

      {!isLoadingConversations && !visibleConversations.length ? <ChatEmptyState /> : null}
    </View>
  );
}
