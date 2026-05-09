import { useEffect, useMemo } from 'react';
import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getConversationPreviews } from '@/src/lib/api';
import { useAuthStore } from '@/src/stores/auth.store';

import { ChatFilterTabs } from './_components/ChatFilterTabs';
import { ChatHeader } from './_components/ChatHeader';
import { ChatSearch } from './_components/ChatSearch';
import { ConversationList } from './_components/ConversationList';
import { useChatStore } from './chat.store';
import type { Conversation } from './types';

const formatMessageTime = (dateValue?: string) => {
  if (!dateValue) return '';

  const date = new Date(dateValue);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (Number.isNaN(diffMinutes)) return '';
  if (diffMinutes < 1) return 'now';
  if (diffMinutes < 60) return `${diffMinutes}m`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d`;

  return `${Math.floor(diffDays / 7)}w`;
};

export function ConversationPage() {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isLoaded = useAuthStore((state) => state.isLoaded);
  const isSignedIn = useAuthStore((state) => Boolean(state.accessToken));
  const user = useAuthStore((state) => state.user);
  const setConversations = useChatStore((state) => state.setConversations);
  const setIsLoadingConversations = useChatStore((state) => state.setIsLoadingConversations);

  const authUserId = useMemo(() => {
    return String(user?._id || user?.id || '');
  }, [user?._id, user?.id]);

  useEffect(() => {
    let isMounted = true;

    async function loadConversationPreviews() {
      if (!isLoaded || !isSignedIn) return;

      try {
        setIsLoadingConversations(true);
        const token = await getAccessToken();

        if (!token) {
          if (isMounted) {
            setConversations([]);
            setIsLoadingConversations(false);
          }
          return;
        }

        const conversations = await getConversationPreviews(token);
        const nextConversations: Conversation[] = conversations.map((conversation) => {
          const otherUser = conversation.otherUser;
          const lastActive = conversation.lastMessageAt
            ? new Date(conversation.lastMessageAt).getTime()
            : 0;
          const unreadCount =
            typeof conversation.unreadCount === 'number'
              ? conversation.unreadCount
              : authUserId
                ? conversation.unreadCounts?.[authUserId] || 0
                : 0;

          return {
            id: conversation._id,
            targetUserId: String(otherUser?._id || otherUser?.id || ''),
            name: otherUser?.fullName || 'Unknown user',
            title: '',
            avatar: otherUser?.profilePic || '',
            lastMessage: conversation.lastMessage || 'No messages yet',
            timestamp: formatMessageTime(conversation.lastMessageAt),
            unread: conversation.isRead ? 0 : unreadCount,
            recent: Date.now() - lastActive < 24 * 60 * 60 * 1000,
            lastActive,
          };
        });

        if (isMounted) {
          setConversations(nextConversations);
        }
      } catch (error) {
        console.log('Conversation previews response error:', error);
        if (isMounted) {
          setConversations([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingConversations(false);
        }
      }
    }

    if (!isLoaded) {
      setIsLoadingConversations(true);
      return;
    }

    if (!isSignedIn) {
      setConversations([]);
      setIsLoadingConversations(false);
      return;
    }

    loadConversationPreviews();

    return () => {
      isMounted = false;
    };
  }, [authUserId, getAccessToken, isLoaded, isSignedIn, setConversations, setIsLoadingConversations]);

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
