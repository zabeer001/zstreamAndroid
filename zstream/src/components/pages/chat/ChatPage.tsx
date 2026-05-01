import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatFilterTabs } from './_components/ChatFilterTabs';
import { ChatHeader } from './_components/ChatHeader';
import { ChatSearch } from './_components/ChatSearch';
import { ConversationList } from './_components/ConversationList';

export function ChatPage() {
  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-24 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ChatHeader />
        <ChatSearch />
        <ChatFilterTabs />
        <ConversationList />
      </ScrollView>
    </SafeAreaView>
  );
}
