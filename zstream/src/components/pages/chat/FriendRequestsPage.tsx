import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, RefreshControl, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  acceptFriendRequest,
  getNotifications,
  type FriendNotification,
  type FriendNotificationData,
} from '@/src/lib/api';
import { useAuthStore } from '@/src/stores/auth.store';

function formatNotificationTime(dateValue?: string) {
  if (!dateValue) return '';

  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleString(undefined, {
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    month: 'short',
  });
}

function languageLine(data?: FriendNotificationData) {
  const languages = [
    data?.nativeLanguage ? `Native: ${data.nativeLanguage}` : '',
    data?.learningLanguage ? `Learning: ${data.learningLanguage}` : '',
  ].filter(Boolean);

  return languages.join('  |  ');
}

type NotificationRowProps = {
  isAccepting?: boolean;
  notification: FriendNotification;
  onAccept: () => void;
  onOpenChat: () => void;
};

function NotificationRow({ isAccepting = false, notification, onAccept, onOpenChat }: NotificationRowProps) {
  const data = notification.data;
  const isFriendRequest = notification.type === 'FRIEND_REQUEST';
  const isAccepted = notification.type === 'FRIEND_REQUEST_ACCEPTED';
  const canAccept = isFriendRequest && Boolean(data?.myId);
  const title = isFriendRequest
    ? 'New friend request'
    : isAccepted && data?.fullName
      ? `${data.fullName} accepted your request`
      : isAccepted
        ? 'Friend request accepted'
        : 'Notification';

  return (
    <View className="mb-3 rounded-md border border-outline-100 bg-background-0 p-4 dark:border-outline-800 dark:bg-background-900">
      <View className="flex-row items-start gap-3">
        {data?.profilePic ? (
          <Image contentFit="cover" source={data.profilePic} style={{ borderRadius: 999, height: 46, width: 46 }} />
        ) : (
          <View className="h-[46px] w-[46px] items-center justify-center rounded-full bg-background-100 dark:bg-background-800">
            <Ionicons name={isFriendRequest ? 'person-add-outline' : 'notifications-outline'} size={20} color="#9CA3AF" />
          </View>
        )}

        <View className="min-w-0 flex-1">
          <View className="mb-1 self-start rounded bg-success-100 px-2 py-1 dark:bg-success-900">
            <Text className="text-[10px] font-bold uppercase text-success-700 dark:text-success-200">
              {isFriendRequest ? 'Friend request' : isAccepted ? 'Accepted' : 'Notification'}
            </Text>
          </View>
          <Text className="text-sm font-bold text-typography-950 dark:text-typography-0" numberOfLines={2}>
            {title}
          </Text>
          {data?.fullName && isFriendRequest ? (
            <Text className="mt-1 text-xs text-typography-500 dark:text-typography-400" numberOfLines={1}>
              From: {data.fullName}
            </Text>
          ) : null}
          {languageLine(data) ? (
            <Text className="mt-1 text-xs text-typography-500 dark:text-typography-400" numberOfLines={1}>
              {languageLine(data)}
            </Text>
          ) : null}
          {data?.location ? (
            <View className="mt-1 flex-row items-center gap-1">
              <Ionicons name="location-outline" size={12} color="#8C8C8C" />
              <Text className="min-w-0 flex-1 text-xs text-typography-500 dark:text-typography-400" numberOfLines={1}>
                {data.location}
              </Text>
            </View>
          ) : null}
          {formatNotificationTime(notification.createdAt) ? (
            <View className="mt-2 flex-row items-center gap-1">
              <Ionicons name="time-outline" size={12} color="#8C8C8C" />
              <Text className="text-xs text-typography-400">
                {formatNotificationTime(notification.createdAt)}
              </Text>
            </View>
          ) : null}
        </View>
      </View>

      {canAccept || isAccepted ? (
        <View className="mt-4 flex-row gap-2">
          {canAccept ? (
            <Pressable
              accessibilityLabel={`Accept ${data?.fullName || 'friend request'}`}
              className="h-10 flex-1 flex-row items-center justify-center gap-2 rounded-md bg-success-600 px-3"
              disabled={isAccepting}
              onPress={onAccept}>
              {isAccepting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="checkmark" size={17} color="#FFFFFF" />
                  <Text className="text-sm font-bold text-white">Accept</Text>
                </>
              )}
            </Pressable>
          ) : null}
          {isAccepted && data?.myId ? (
            <Pressable
              accessibilityLabel={`Message ${data.fullName || 'friend'}`}
              className="h-10 flex-1 flex-row items-center justify-center gap-2 rounded-md border border-outline-200 px-3 dark:border-outline-700"
              onPress={onOpenChat}>
              <Ionicons name="chatbubble-outline" size={16} color="#14A800" />
              <Text className="text-sm font-bold text-success-700 dark:text-success-300">Message</Text>
            </Pressable>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

export function FriendRequestsPage() {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isLoaded = useAuthStore((state) => state.isLoaded);
  const isSignedIn = useAuthStore((state) => Boolean(state.accessToken));
  const [acceptingRequestId, setAcceptingRequestId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [notifications, setNotifications] = useState<FriendNotification[]>([]);

  const requestNotifications = useMemo(() => {
    return notifications.filter((notification) =>
      ['FRIEND_REQUEST', 'FRIEND_REQUEST_ACCEPTED'].includes(notification.type)
    );
  }, [notifications]);

  const loadNotifications = useCallback(
    async (isRefresh = false) => {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setNotifications([]);
        setIsLoading(false);
        setIsRefreshing(false);
        return;
      }

      try {
        if (isRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        const token = await getAccessToken();
        if (!token) throw new Error('Missing auth session');

        const response = await getNotifications(token);
        setNotifications(response.notifications || []);
      } catch (error) {
        console.log('Error loading friend requests:', error);
        Alert.alert('Requests unavailable', 'Could not load friend requests right now. Please try again.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [getAccessToken, isLoaded, isSignedIn]
  );

  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  const handleAccept = async (requestId?: string) => {
    if (!requestId || acceptingRequestId) return;

    try {
      setAcceptingRequestId(requestId);
      const token = await getAccessToken();
      if (!token) throw new Error('Missing auth session');

      await acceptFriendRequest(token, requestId);
      await loadNotifications(true);
    } catch (error) {
      console.log('Error accepting friend request:', error);
      Alert.alert('Accept failed', error instanceof Error ? error.message : 'Could not accept this request.');
    } finally {
      setAcceptingRequestId(null);
    }
  };

  const openChat = (targetId?: string) => {
    if (!targetId) return;

    router.push(`/chat/${encodeURIComponent(targetId)}` as Href);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950" edges={['top']}>
      <View className="flex-row items-center gap-3 border-b border-outline-100 bg-background-0 px-4 py-3 dark:border-outline-800 dark:bg-background-950">
        <Pressable
          accessibilityLabel="Go back"
          className="h-10 w-10 items-center justify-center rounded-full bg-background-100 dark:bg-background-900"
          onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="#14A800" />
        </Pressable>
        <View className="min-w-0 flex-1">
          <Text className="text-base font-bold text-typography-950 dark:text-typography-0">Friend Requests</Text>
          <Text className="text-xs text-typography-500 dark:text-typography-400">
            Accept requests and see recent friend updates
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-24 pt-4"
        refreshControl={<RefreshControl onRefresh={() => loadNotifications(true)} refreshing={isRefreshing} />}
        showsVerticalScrollIndicator={false}>
        {isLoading ? (
          <View className="items-center justify-center px-4 py-16">
            <ActivityIndicator color="#14A800" size="large" />
          </View>
        ) : requestNotifications.length ? (
          requestNotifications.map((notification) => (
            <NotificationRow
              isAccepting={acceptingRequestId === notification.data?.myId}
              key={notification._id}
              notification={notification}
              onAccept={() => handleAccept(notification.data?.myId)}
              onOpenChat={() => openChat(notification.data?.myId)}
            />
          ))
        ) : (
          <View className="items-center justify-center px-6 py-16">
            <View className="h-16 w-16 items-center justify-center rounded-full bg-background-100 dark:bg-background-900">
              <Ionicons name="notifications-outline" size={28} color="#9CA3AF" />
            </View>
            <Text className="mt-4 text-center text-base font-bold text-typography-950 dark:text-typography-0">
              No notifications yet
            </Text>
            <Text className="mt-2 max-w-[280px] text-center text-sm text-typography-500 dark:text-typography-400">
              When you receive friend requests or friend updates, they will appear here.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
