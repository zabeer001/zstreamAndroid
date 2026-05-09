import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, type Href } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  getOutgoingFriendReqs,
  getRecommendedUsers,
  getUserFriends,
  sendFriendRequest,
  type FriendUser,
} from '@/src/lib/api';
import { useAuthStore } from '@/src/stores/auth.store';

type FriendsTab = 'find' | 'friends';

const userKeys = (user?: FriendUser) =>
  [user?._id, user?.id, user?.clerkId].filter((value): value is string => Boolean(value));

const primaryUserId = (user: FriendUser) => user._id || user.id || user.clerkId || '';

const requestUserId = (user: FriendUser) => user.clerkId || user.id || user._id || '';

const matchesQuery = (user: FriendUser, normalizedQuery: string) => {
  if (!normalizedQuery) return true;

  const searchableText = [
    user.fullName,
    user.location,
    user.nativeLanguage,
    user.learningLanguage,
    user.bio,
  ]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  return searchableText.includes(normalizedQuery);
};

function languageLine(user: FriendUser) {
  const languages = [
    user.nativeLanguage ? `Native: ${user.nativeLanguage}` : '',
    user.learningLanguage ? `Learning: ${user.learningLanguage}` : '',
  ].filter(Boolean);

  return languages.join('  |  ');
}

type UserRowProps = {
  action: 'message' | 'request';
  isRequestSent?: boolean;
  isSending?: boolean;
  onPress: () => void;
  user: FriendUser;
};

function UserRow({ action, isRequestSent = false, isSending = false, onPress, user }: UserRowProps) {
  const disabled = action === 'request' && (isRequestSent || isSending);
  const label = action === 'message' ? 'Message' : isRequestSent ? 'Sent' : 'Add';
  const icon =
    action === 'message' ? 'chatbubble-outline' : isRequestSent ? 'checkmark-circle' : 'person-add-outline';

  return (
    <View className="flex-row items-center gap-3 border-b border-outline-100 px-3 py-3 dark:border-outline-800">
      {user.profilePic ? (
        <Image contentFit="cover" source={user.profilePic} style={{ borderRadius: 999, height: 46, width: 46 }} />
      ) : (
        <View className="h-[46px] w-[46px] items-center justify-center rounded-full bg-background-100 dark:bg-background-800">
          <Ionicons name="person-outline" size={20} color="#9CA3AF" />
        </View>
      )}

      <View className="min-w-0 flex-1">
        <Text className="text-sm font-bold text-typography-950 dark:text-typography-0" numberOfLines={1}>
          {user.fullName || 'Unknown user'}
        </Text>
        {languageLine(user) ? (
          <Text className="mt-0.5 text-xs text-typography-500 dark:text-typography-400" numberOfLines={1}>
            {languageLine(user)}
          </Text>
        ) : null}
        {user.location ? (
          <Text className="mt-0.5 text-xs text-typography-400" numberOfLines={1}>
            {user.location}
          </Text>
        ) : null}
      </View>

      <Pressable
        accessibilityLabel={`${label} ${user.fullName || 'user'}`}
        className={`h-10 min-w-[86px] flex-row items-center justify-center gap-1.5 rounded-md px-3 ${
          action === 'message'
            ? 'bg-success-600'
            : disabled
              ? 'bg-background-100 dark:bg-background-800'
              : 'bg-success-600'
        }`}
        disabled={disabled}
        onPress={onPress}>
        {isSending ? (
          <ActivityIndicator color="#6B7280" size="small" />
        ) : (
          <>
            <Ionicons name={icon} size={16} color={disabled ? '#6B7280' : '#FFFFFF'} />
            <Text className={`text-xs font-bold ${disabled ? 'text-typography-500' : 'text-white'}`}>
              {label}
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}

export function FriendsPage() {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isLoaded = useAuthStore((state) => state.isLoaded);
  const isSignedIn = useAuthStore((state) => Boolean(state.accessToken));
  const [activeTab, setActiveTab] = useState<FriendsTab>('find');
  const [friends, setFriends] = useState<FriendUser[]>([]);
  const [recommendedUsers, setRecommendedUsers] = useState<FriendUser[]>([]);
  const [outgoingRequestIds, setOutgoingRequestIds] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [sendingUserId, setSendingUserId] = useState<string | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleRecommendedUsers = useMemo(
    () => recommendedUsers.filter((user) => matchesQuery(user, normalizedQuery)),
    [normalizedQuery, recommendedUsers]
  );
  const visibleFriends = useMemo(
    () => friends.filter((user) => matchesQuery(user, normalizedQuery)),
    [friends, normalizedQuery]
  );

  useEffect(() => {
    let isMounted = true;

    async function loadFriendsData() {
      if (!isLoaded) return;

      if (!isSignedIn) {
        setFriends([]);
        setRecommendedUsers([]);
        setOutgoingRequestIds(new Set());
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const token = await getAccessToken();
        if (!token) throw new Error('Missing auth session');

        const [nextFriends, nextRecommendedUsers, outgoingRequests] = await Promise.all([
          getUserFriends(token),
          getRecommendedUsers(token),
          getOutgoingFriendReqs(token),
        ]);

        if (!isMounted) return;

        const nextOutgoingIds = new Set<string>();
        outgoingRequests.forEach((request) => {
          userKeys(request.recipient).forEach((id) => nextOutgoingIds.add(id));
        });

        setFriends(nextFriends);
        setRecommendedUsers(nextRecommendedUsers);
        setOutgoingRequestIds(nextOutgoingIds);
      } catch (error) {
        console.log('Error loading friends page:', error);
        if (isMounted) {
          Alert.alert('Friends unavailable', 'Could not load friends right now. Please try again.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadFriendsData();

    return () => {
      isMounted = false;
    };
  }, [getAccessToken, isLoaded, isSignedIn]);

  const handleSendRequest = async (user: FriendUser) => {
    const targetId = requestUserId(user);
    if (!targetId || sendingUserId) return;

    try {
      setSendingUserId(targetId);
      const token = await getAccessToken();
      if (!token) throw new Error('Missing auth session');

      await sendFriendRequest(token, targetId);
      setOutgoingRequestIds((currentIds) => {
        const nextIds = new Set(currentIds);
        userKeys(user).forEach((id) => nextIds.add(id));
        return nextIds;
      });
    } catch (error) {
      console.log('Error sending friend request:', error);
      Alert.alert('Request failed', error instanceof Error ? error.message : 'Could not send the request.');
    } finally {
      setSendingUserId(null);
    }
  };

  const openChat = (user: FriendUser) => {
    const targetId = primaryUserId(user);
    if (!targetId) return;

    router.push(`/chat/${encodeURIComponent(targetId)}` as Href);
  };

  const displayedUsers = activeTab === 'find' ? visibleRecommendedUsers : visibleFriends;

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
          <Text className="text-base font-bold text-typography-950 dark:text-typography-0">Friends</Text>
          <Text className="text-xs text-typography-500 dark:text-typography-400">
            Find people or message your friends
          </Text>
        </View>
        <Pressable
          accessibilityLabel="Open friend requests"
          className="h-10 w-10 items-center justify-center rounded-md border border-outline-200 bg-background-0 dark:border-outline-800 dark:bg-background-900"
          onPress={() => router.push('/chat/requests' as Href)}>
          <Ionicons name="notifications-outline" size={18} color="#6B7280" />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-24 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="mb-3 flex-row rounded-md border border-outline-200 bg-background-0 p-1 dark:border-outline-800 dark:bg-background-900">
          {(['find', 'friends'] as FriendsTab[]).map((tab) => {
            const isActive = activeTab === tab;

            return (
              <Pressable
                className={`h-10 flex-1 items-center justify-center rounded ${
                  isActive ? 'bg-success-600' : 'bg-transparent'
                }`}
                key={tab}
                onPress={() => setActiveTab(tab)}>
                <Text className={`text-sm font-bold ${isActive ? 'text-white' : 'text-typography-500'}`}>
                  {tab === 'find' ? 'Find Friends' : 'All Friends'}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <View className="mb-4 flex-row items-center rounded-md border border-outline-200 bg-background-0 px-3 dark:border-outline-800 dark:bg-background-900">
          <Ionicons name="search-outline" size={17} color="#6B7280" />
          <TextInput
            className="ml-2 min-h-11 flex-1 text-sm text-typography-950 outline-none dark:text-typography-0"
            onChangeText={setQuery}
            placeholder={activeTab === 'find' ? 'Search people' : 'Search friends'}
            placeholderTextColor="#8C8C8C"
            value={query}
          />
          {query ? (
            <Pressable
              accessibilityLabel="Clear search"
              className="h-8 w-8 items-center justify-center"
              onPress={() => setQuery('')}>
              <Ionicons name="close" size={18} color="#6B7280" />
            </Pressable>
          ) : null}
        </View>

        <View className="overflow-hidden rounded-md border border-outline-100 bg-background-0 dark:border-outline-800 dark:bg-background-900">
          {isLoading ? (
            <View className="items-center justify-center px-4 py-12">
              <ActivityIndicator color="#14A800" size="large" />
            </View>
          ) : displayedUsers.length ? (
            displayedUsers.map((user, index) => {
              const hasRequestBeenSent = userKeys(user).some((id) => outgoingRequestIds.has(id));
              const targetRequestId = requestUserId(user);

              return (
                <UserRow
                  action={activeTab === 'find' ? 'request' : 'message'}
                  isRequestSent={hasRequestBeenSent}
                  isSending={sendingUserId === targetRequestId}
                  key={primaryUserId(user) || `${activeTab}-${index}`}
                  onPress={() => (activeTab === 'find' ? handleSendRequest(user) : openChat(user))}
                  user={user}
                />
              );
            })
          ) : (
            <View className="items-center justify-center px-6 py-12">
              <Ionicons
                name={activeTab === 'find' ? 'person-add-outline' : 'people-outline'}
                size={26}
                color="#9CA3AF"
              />
              <Text className="mt-3 text-center text-sm font-bold text-typography-950 dark:text-typography-0">
                {activeTab === 'find' ? 'No people found' : 'No friends found'}
              </Text>
              <Text className="mt-1 text-center text-xs text-typography-500 dark:text-typography-400">
                {query ? 'Try another search.' : 'Check back again later.'}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
