import { Ionicons } from '@expo/vector-icons';
import { Pressable, TextInput, View } from 'react-native';

import { useChatStore } from '../chat.store';

export function ChatSearch() {
  const query = useChatStore((state) => state.query);
  const setQuery = useChatStore((state) => state.setQuery);
  const clearQuery = useChatStore((state) => state.clearQuery);

  return (
    <View className="mb-3 flex-row items-center rounded-md border border-outline-200 bg-background-0 px-3 dark:border-outline-800 dark:bg-background-900">
      <Ionicons name="search-outline" size={17} color="#6B7280" />
      <TextInput
        className="ml-2 min-h-11 flex-1 text-sm text-typography-950 outline-none dark:text-typography-0"
        onChangeText={setQuery}
        placeholder="Search messages"
        placeholderTextColor="#8C8C8C"
        value={query}
      />
      {query ? (
        <Pressable
          accessibilityLabel="Clear search"
          className="h-8 w-8 items-center justify-center"
          onPress={clearQuery}>
          <Ionicons name="close" size={18} color="#6B7280" />
        </Pressable>
      ) : null}
    </View>
  );
}
