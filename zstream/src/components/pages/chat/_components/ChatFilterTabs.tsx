import { useMemo } from 'react';
import { Pressable, Text, View } from 'react-native';

import { chatTabs } from '../chat.data';
import { useChatStore } from '../chat.store';

export function ChatFilterTabs() {
  const activeTab = useChatStore((state) => state.activeTab);
  const conversations = useChatStore((state) => state.conversations);
  const favoriteIds = useChatStore((state) => state.favoriteIds);
  const setActiveTab = useChatStore((state) => state.setActiveTab);

  const counts = useMemo(
    () => ({
      recent: conversations.filter((conversation) => conversation.recent).length,
      all: conversations.length,
      favorites: conversations.filter((conversation) => favoriteIds.has(conversation.id)).length,
    }),
    [conversations, favoriteIds]
  );

  return (
    <View className="mb-4 flex-row rounded-md border border-outline-200 bg-background-50 p-1 dark:border-outline-800 dark:bg-background-900">
      {chatTabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={`h-9 flex-1 flex-row items-center justify-center gap-1 rounded ${
              isActive ? 'bg-background-0 dark:bg-background-800' : ''
            }`}
            key={tab.key}
            onPress={() => setActiveTab(tab.key)}>
            <Text
              className={`text-sm font-semibold ${
                isActive
                  ? 'text-success-700 dark:text-success-500'
                  : 'text-typography-500 dark:text-typography-400'
              }`}>
              {tab.label}
            </Text>
            <Text
              className={`text-xs ${
                isActive ? 'text-success-700 dark:text-success-500' : 'text-typography-400'
              }`}>
              {counts[tab.key]}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
