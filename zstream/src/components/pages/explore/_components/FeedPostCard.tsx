import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, Text, View } from 'react-native';

import { getPostComments, sharePost, togglePostLike, type PostComment } from '@/src/lib/api';
import { useAuthStore } from '@/src/stores/auth.store';

import { useExploreStore } from '../explore.store';
import type { FeedPost } from '../types';

type FeedPostCardProps = {
  post: FeedPost;
};

function formatTimeLabel(value?: string) {
  if (!value) return '';

  const timestamp = new Date(value).getTime();
  if (Number.isNaN(timestamp)) return '';

  const diffInSeconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (diffInSeconds < 60) return 'now';

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;

  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function FeedPostCard({ post }: FeedPostCardProps) {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isExpanded = useExploreStore((state) => state.expandedPostIds.has(post._id));
  const isCommentsOpen = useExploreStore((state) => state.openCommentsId === post._id);
  const toggleComments = useExploreStore((state) => state.toggleComments);
  const toggleReadMore = useExploreStore((state) => state.toggleReadMore);
  const updatePost = useExploreStore((state) => state.updatePost);
  const updatePostShareCount = useExploreStore((state) => state.updatePostShareCount);
  const [comments, setComments] = useState<PostComment[]>([]);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const canExpand = post.body.length > 120;
  const isLoved = Boolean(post.likedByMe);
  const categories = post.categories?.length ? post.categories : post.category ? [post.category] : [];
  const timeLabel = formatTimeLabel(post.createdAt);
  const authorName = post.author?.fullName || 'Unknown author';
  const authorSubtitle = post.author?.bio || post.author?.location || 'Community member';

  useEffect(() => {
    let isMounted = true;

    async function loadComments() {
      if (!isCommentsOpen || comments.length) return;

      try {
        setIsLoadingComments(true);
        const token = await getAccessToken();
        if (!token) throw new Error('Missing auth session');

        const response = await getPostComments(token, post._id);
        if (isMounted) {
          setComments(response.comments);
        }
      } catch (error) {
        console.log('Error loading post comments:', error);
        if (isMounted) {
          Alert.alert('Comments unavailable', error instanceof Error ? error.message : 'Could not load comments.');
        }
      } finally {
        if (isMounted) {
          setIsLoadingComments(false);
        }
      }
    }

    loadComments();

    return () => {
      isMounted = false;
    };
  }, [comments.length, getAccessToken, isCommentsOpen, post._id]);

  const handleLike = async () => {
    if (isLiking) return;

    try {
      setIsLiking(true);
      const token = await getAccessToken();
      if (!token) throw new Error('Missing auth session');

      const response = await togglePostLike(token, post._id);
      updatePost(response.post);
    } catch (error) {
      console.log('Error toggling post like:', error);
      Alert.alert('Reaction failed', error instanceof Error ? error.message : 'Could not update this post.');
    } finally {
      setIsLiking(false);
    }
  };

  const handleShare = async () => {
    if (isSharing) return;

    try {
      setIsSharing(true);
      const token = await getAccessToken();
      if (!token) throw new Error('Missing auth session');

      const response = await sharePost(token, post._id);
      updatePostShareCount(post._id, response.shareCount);
    } catch (error) {
      console.log('Error sharing post:', error);
      Alert.alert('Share failed', error instanceof Error ? error.message : 'Could not share this post.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <View className="rounded-md border border-outline-200 bg-background-0 p-3 dark:border-outline-800 dark:bg-background-900">
      {post.feedItemType === 'share' && post.sharedBy?.fullName ? (
        <View className="mb-3 flex-row items-center gap-1.5">
          <Ionicons name="repeat-outline" size={14} color="#6B7280" />
          <Text className="text-xs font-semibold text-typography-500 dark:text-typography-400" numberOfLines={1}>
            {post.sharedBy.fullName} shared this
          </Text>
        </View>
      ) : null}

      <Text className="text-base font-bold text-typography-950 dark:text-typography-0">
        {post.title}
      </Text>
      <Text
        className="mt-2 text-sm leading-5 text-typography-600 dark:text-typography-300"
        numberOfLines={isExpanded ? undefined : 2}>
        {post.body}
      </Text>
      {canExpand ? (
        <Pressable className="mt-1 self-start" onPress={() => toggleReadMore(post._id)}>
          <Text className="text-sm font-semibold text-success-700 dark:text-success-500">
            {isExpanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      ) : null}

      <View className="mt-3 flex-row flex-wrap gap-2">
        {categories.map((category) => (
          <View className="rounded bg-success-50 px-2 py-1 dark:bg-success-900" key={category._id || category.slug}>
            <Text className="text-xs font-semibold text-success-700 dark:text-success-400">
              {category.name}
            </Text>
          </View>
        ))}
        {(post.tags || []).map((tag) => (
          <View className="rounded bg-background-50 px-2 py-1 dark:bg-background-800" key={tag}>
            <Text className="text-xs font-semibold text-typography-500 dark:text-typography-400">
              {tag}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-3 flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          {post.author?.profilePic ? (
            <Image
              contentFit="cover"
              source={post.author.profilePic}
              style={{ borderRadius: 999, height: 28, width: 28 }}
            />
          ) : (
            <View className="h-7 w-7 items-center justify-center rounded-full bg-background-100 dark:bg-background-800">
              <Ionicons name="person-outline" size={15} color="#9CA3AF" />
            </View>
          )}
          <View className="min-w-0 flex-1">
            <Text
              className="text-xs font-bold text-typography-800 dark:text-typography-100"
              numberOfLines={1}>
              {authorName}
            </Text>
            <Text
              className="text-xs text-typography-500 dark:text-typography-400"
              numberOfLines={1}>
              {authorSubtitle}
            </Text>
          </View>
        </View>
        {timeLabel ? <Text className="text-xs text-typography-400">{timeLabel}</Text> : null}
      </View>

      <View className="mt-3 flex-row items-center border-t border-outline-100 pt-3 dark:border-outline-800">
        <Pressable
          accessibilityLabel={isLoved ? 'Remove love reaction' : 'Love this post'}
          className="mr-5 flex-row items-center gap-1.5"
          disabled={isLiking}
          onPress={handleLike}>
          {isLiking ? (
            <ActivityIndicator color="#14A800" size="small" />
          ) : (
            <Ionicons
              color={isLoved ? '#14A800' : '#6B7280'}
              name={isLoved ? 'heart' : 'heart-outline'}
              size={18}
            />
          )}
          <Text
            className={`text-sm font-semibold ${
              isLoved
                ? 'text-success-700 dark:text-success-500'
                : 'text-typography-500 dark:text-typography-400'
            }`}>
            {post.likeCount || 0}
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Show comments"
          className="mr-5 flex-row items-center gap-1.5"
          onPress={() => toggleComments(post._id)}>
          <Ionicons name="chatbubble-outline" size={17} color="#6B7280" />
          <Text className="text-sm font-semibold text-typography-500 dark:text-typography-400">
            {post.commentCount || 0}
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Share post"
          className="flex-row items-center gap-1.5"
          disabled={isSharing}
          onPress={handleShare}>
          {isSharing ? (
            <ActivityIndicator color="#6B7280" size="small" />
          ) : (
            <Ionicons name="share-social-outline" size={17} color="#6B7280" />
          )}
          <Text className="text-sm font-semibold text-typography-500 dark:text-typography-400">
            {post.shareCount || 0}
          </Text>
        </Pressable>
      </View>

      {isCommentsOpen ? (
        <View className="mt-3 gap-2 rounded bg-background-50 p-3 dark:bg-background-800">
          {isLoadingComments ? (
            <ActivityIndicator color="#14A800" size="small" />
          ) : comments.length ? (
            comments.map((comment) => (
              <View key={comment._id}>
                <Text className="text-xs font-bold text-typography-700 dark:text-typography-200">
                  {comment.author?.fullName || 'Community member'}
                </Text>
                <Text className="mt-0.5 text-sm text-typography-600 dark:text-typography-300">
                  {comment.body}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-sm text-typography-500 dark:text-typography-400">
              No comments yet.
            </Text>
          )}
        </View>
      ) : null}
    </View>
  );
}
