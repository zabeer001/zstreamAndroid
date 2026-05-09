import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, router } from 'expo-router';
import * as Linking from 'expo-linking';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StreamChat, type Channel as StreamChannel } from 'stream-chat';
import {
  Channel,
  Chat,
  MessageComposer,
  MessageList,
  OverlayProvider,
  Thread,
} from 'stream-chat-expo';
import {
  CallContent,
  StreamCall,
  StreamVideo,
  StreamVideoClient,
  type Call,
  type User as StreamVideoUser,
} from '@stream-io/video-react-native-sdk';

import { getStreamToken, markConversationRead, saveLastMessage } from '@/src/lib/api';
import { useAuthStore } from '@/src/stores/auth.store';

const STREAM_API_KEY = process.env.EXPO_PUBLIC_STREAM_API_KEY;

type ChatSession = {
  channel: StreamChannel;
  client: StreamChat;
};

function disconnectChatClient(client: StreamChat | null) {
  client?.disconnectUser().catch(() => undefined);
}

export default function ChatPage() {
  const params = useLocalSearchParams<{ id?: string }>();
  const targetUserId = Array.isArray(params.id) ? params.id[0] : params.id;

  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isLoaded = useAuthStore((state) => state.isLoaded);
  const isSignedIn = useAuthStore((state) => Boolean(state.accessToken));
  const user = useAuthStore((state) => state.user);

  const [chatSession, setChatSession] = useState<ChatSession | null>(null);
  const [videoClient, setVideoClient] = useState<StreamVideoClient | null>(null);
  const [activeCall, setActiveCall] = useState<Call | null>(null);
  const [loading, setLoading] = useState(true);
  const [startingVideoCall, setStartingVideoCall] = useState(false);
  const initRequestRef = useRef(0);
  const getAccessTokenRef = useRef(getAccessToken);

  getAccessTokenRef.current = getAccessToken;

  const streamUserId = useMemo(() => {
    return String(user?._id || user?.id || '');
  }, [user?._id, user?.id]);

  const streamUserName = user?.fullName || user?.email || 'Zstream user';
  const streamUserImage = user?.profilePic;
  const streamUserProfileRef = useRef({ image: streamUserImage, name: streamUserName });

  streamUserProfileRef.current = { image: streamUserImage, name: streamUserName };

  const saveMessagePreview = useCallback(
    async (text?: string) => {
      if (!targetUserId) return;

      const accessToken = await getAccessTokenRef.current();
      if (!accessToken) return;

      await saveLastMessage(accessToken, {
        receiverId: targetUserId,
        text,
      });
    },
    [targetUserId]
  );

  useEffect(() => {
    const requestId = initRequestRef.current + 1;
    initRequestRef.current = requestId;
    let isMounted = true;
    let client: StreamChat | null = null;

    async function initChat() {
      if (!isLoaded) return;

      setChatSession(null);

      if (!STREAM_API_KEY || !isSignedIn || !streamUserId || !targetUserId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const accessToken = await getAccessTokenRef.current();
        if (!accessToken) throw new Error('Missing auth session');

        await markConversationRead(accessToken, targetUserId);

        const tokenData = await getStreamToken(accessToken);
        client = new StreamChat(STREAM_API_KEY);
        const streamUserProfile = streamUserProfileRef.current;

        await client.connectUser(
          {
            id: streamUserId,
            image: streamUserProfile.image,
            name: streamUserProfile.name,
          },
          tokenData.token
        );

        const channelId = [streamUserId, targetUserId].sort().join('-');
        const nextChannel = client.channel('messaging', channelId, {
          members: [streamUserId, targetUserId],
        });

        await nextChannel.watch();

        if (isMounted && initRequestRef.current === requestId) {
          setChatSession({ channel: nextChannel, client });
        } else {
          disconnectChatClient(client);
        }
      } catch (error) {
        if (isMounted && initRequestRef.current === requestId) {
          console.log('Error initializing chat:', error);
          Alert.alert('Chat unavailable', 'Could not connect to chat. Please try again.');
        }
      } finally {
        if (isMounted && initRequestRef.current === requestId) {
          setLoading(false);
        }
      }
    }

    initChat();

    return () => {
      isMounted = false;
      if (initRequestRef.current === requestId) {
        setChatSession(null);
      }
      setTimeout(() => {
        disconnectChatClient(client);
      }, 0);
    };
  }, [isLoaded, isSignedIn, streamUserId, targetUserId]);

  const chatClient = chatSession?.client ?? null;
  const channel = chatSession?.channel ?? null;

  const sendMessageWithPreview = useCallback(
    async (
      _channelId: string,
      message: Parameters<StreamChannel['sendMessage']>[0],
      options?: Parameters<StreamChannel['sendMessage']>[1]
    ) => {
      if (!channel) {
        throw new Error('Channel is not ready');
      }

      const response = await channel.sendMessage(message, options);
      await saveMessagePreview(message.text);

      return response;
    },
    [channel, saveMessagePreview]
  );

  const handleVideoCall = useCallback(async () => {
    if (!channel) return;

    try {
      setStartingVideoCall(true);

      if (!STREAM_API_KEY || !streamUserId) {
        throw new Error('Missing Stream video configuration');
      }

      const accessToken = await getAccessTokenRef.current();
      if (!accessToken) throw new Error('Missing auth session');

      const tokenData = await getStreamToken(accessToken);
      const videoUser: StreamVideoUser = {
        id: streamUserId,
        image: streamUserImage,
        name: streamUserName,
      };
      const nextVideoClient = StreamVideoClient.getOrCreateInstance({
        apiKey: STREAM_API_KEY,
        user: videoUser,
        token: tokenData.token,
      });
      const nextCall = nextVideoClient.call('default', `chat-${channel.id}`);

      await nextCall.join({ create: true });

      setVideoClient(nextVideoClient);
      setActiveCall(nextCall);

      const callUrl = Linking.createURL(`/chat/${targetUserId}`);
      const text = `I've started a video call. Join me from this chat: ${callUrl}`;
      await channel.sendMessage({ text });
      await saveMessagePreview(text);
    } catch (error) {
      console.log('Error sending video call link:', error);
      Alert.alert('Video call unavailable', 'Could not start the video call. Please try again.');
    } finally {
      setStartingVideoCall(false);
    }
  }, [channel, saveMessagePreview, streamUserId, streamUserImage, streamUserName, targetUserId]);

  const endVideoCall = useCallback(() => {
    const callToLeave = activeCall;

    setActiveCall(null);

    callToLeave?.leave().catch((error) => {
      console.log('Error leaving video call:', error);
    });
  }, [activeCall]);

  useEffect(() => {
    return () => {
      activeCall?.leave().catch(() => undefined);
      videoClient?.disconnectUser().catch(() => undefined);
    };
  }, [activeCall, videoClient]);

  if (loading || !chatClient || !channel) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-background-0 dark:bg-background-950">
        <ActivityIndicator color="#14A800" size="large" />
      </SafeAreaView>
    );
  }

  if (videoClient && activeCall) {
    return (
      <StreamVideo client={videoClient}>
        <StreamCall call={activeCall}>
          <SafeAreaView className="flex-1 bg-background-950" edges={['top']}>
            <View className="flex-row items-center gap-3 border-b border-outline-800 bg-background-950 px-4 py-3">
              <Pressable
                accessibilityLabel="Return to chat"
                className="h-10 w-10 items-center justify-center rounded-full bg-background-900"
                onPress={endVideoCall}>
                <Ionicons name="chevron-back" size={22} color="#FFFFFF" />
              </Pressable>
              <View className="min-w-0 flex-1">
                <Text className="text-base font-bold text-typography-0">Video call</Text>
                <Text className="text-xs text-typography-400" numberOfLines={1}>
                  {channel.id}
                </Text>
              </View>
            </View>
            <CallContent onHangupCallHandler={endVideoCall} />
          </SafeAreaView>
        </StreamCall>
      </StreamVideo>
    );
  }

  return (
    <OverlayProvider>
      <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950" edges={['top']}>
        <Chat client={chatClient}>
          <Channel channel={channel} doSendMessageRequest={sendMessageWithPreview}>
            <View className="flex-1">
              <View className="flex-row items-center gap-3 border-b border-outline-100 bg-background-0 px-4 py-3 dark:border-outline-800 dark:bg-background-950">
                <Pressable
                  accessibilityLabel="Go back"
                  className="h-10 w-10 items-center justify-center rounded-full bg-background-100 dark:bg-background-900"
                  onPress={() => router.back()}>
                  <Ionicons name="chevron-back" size={22} color="#14A800" />
                </Pressable>
                <View className="min-w-0 flex-1">
                  <Text className="text-base font-bold text-typography-950 dark:text-typography-0">
                    Chat
                  </Text>
                  <Text className="text-xs text-typography-500 dark:text-typography-400" numberOfLines={1}>
                    {channel.id}
                  </Text>
                </View>
                <Pressable
                  accessibilityLabel="Start video call"
                  className="h-10 w-10 items-center justify-center rounded-full bg-success-600"
                  disabled={startingVideoCall}
                  onPress={handleVideoCall}>
                  {startingVideoCall ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Ionicons name="videocam" size={19} color="#FFFFFF" />
                  )}
                </Pressable>
              </View>

              <MessageList />
              <MessageComposer />
            </View>

            <Thread />
          </Channel>
        </Chat>
      </SafeAreaView>
    </OverlayProvider>
  );
}
