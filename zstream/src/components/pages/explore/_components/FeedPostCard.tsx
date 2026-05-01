import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Pressable, Text, View } from 'react-native';

import { useExploreStore } from '../explore.store';
import type { FeedPost } from '../types';

type FeedPostCardProps = {
  post: FeedPost;
};

export function FeedPostCard({ post }: FeedPostCardProps) {
  const isExpanded = useExploreStore((state) => state.expandedPostIds.has(post.id));
  const isLoved = useExploreStore((state) => state.lovedPostIds.has(post.id));
  const isCommentsOpen = useExploreStore((state) => state.openCommentsId === post.id);
  const toggleComments = useExploreStore((state) => state.toggleComments);
  const toggleLove = useExploreStore((state) => state.toggleLove);
  const toggleReadMore = useExploreStore((state) => state.toggleReadMore);

  const canExpand = post.body.length > 120;
  const loveCount = post.loves + (isLoved ? 1 : 0);

  return (
    <View className="rounded-md border border-outline-200 bg-background-0 p-3 dark:border-outline-800 dark:bg-background-900">
      <Text className="text-base font-bold text-typography-950 dark:text-typography-0">
        {post.title}
      </Text>
      <Text
        className="mt-2 text-sm leading-5 text-typography-600 dark:text-typography-300"
        numberOfLines={isExpanded ? undefined : 2}>
        {post.body}
      </Text>
      {canExpand ? (
        <Pressable className="mt-1 self-start" onPress={() => toggleReadMore(post.id)}>
          <Text className="text-sm font-semibold text-success-700 dark:text-success-500">
            {isExpanded ? 'Show less' : 'Read more'}
          </Text>
        </Pressable>
      ) : null}

      <View className="mt-3 flex-row flex-wrap gap-2">
        {post.tags.map((tag) => (
          <View className="rounded bg-background-50 px-2 py-1 dark:bg-background-800" key={tag}>
            <Text className="text-xs font-semibold text-typography-500 dark:text-typography-400">
              {tag}
            </Text>
          </View>
        ))}
      </View>

      <View className="mt-3 flex-row items-center justify-between gap-3">
        <View className="min-w-0 flex-1 flex-row items-center gap-2">
          <Image
            contentFit="cover"
            source={post.avatar}
            style={{ borderRadius: 999, height: 28, width: 28 }}
          />
          <View className="min-w-0 flex-1">
            <Text
              className="text-xs font-bold text-typography-800 dark:text-typography-100"
              numberOfLines={1}>
              {post.author}
            </Text>
            <Text
              className="text-xs text-typography-500 dark:text-typography-400"
              numberOfLines={1}>
              {post.role}
            </Text>
          </View>
        </View>
        <Text className="text-xs text-typography-400">{post.postedAt}</Text>
      </View>

      <View className="mt-3 flex-row items-center border-t border-outline-100 pt-3 dark:border-outline-800">
        <Pressable
          accessibilityLabel={isLoved ? 'Remove love reaction' : 'Love this post'}
          className="mr-5 flex-row items-center gap-1.5"
          onPress={() => toggleLove(post.id)}>
          <Ionicons
            color={isLoved ? '#14A800' : '#6B7280'}
            name={isLoved ? 'heart' : 'heart-outline'}
            size={18}
          />
          <Text
            className={`text-sm font-semibold ${
              isLoved
                ? 'text-success-700 dark:text-success-500'
                : 'text-typography-500 dark:text-typography-400'
            }`}>
            {loveCount}
          </Text>
        </Pressable>

        <Pressable
          accessibilityLabel="Show comments"
          className="mr-5 flex-row items-center gap-1.5"
          onPress={() => toggleComments(post.id)}>
          <Ionicons name="chatbubble-outline" size={17} color="#6B7280" />
          <Text className="text-sm font-semibold text-typography-500 dark:text-typography-400">
            {post.comments.length}
          </Text>
        </Pressable>

        <Pressable accessibilityLabel="Share post" className="flex-row items-center gap-1.5">
          <Ionicons name="share-social-outline" size={17} color="#6B7280" />
          <Text className="text-sm font-semibold text-typography-500 dark:text-typography-400">
            {post.shares}
          </Text>
        </Pressable>
      </View>

      {isCommentsOpen ? (
        <View className="mt-3 gap-2 rounded bg-background-50 p-3 dark:bg-background-800">
          {post.comments.map((comment) => (
            <Text className="text-sm text-typography-600 dark:text-typography-300" key={comment}>
              {comment}
            </Text>
          ))}
        </View>
      ) : null}
    </View>
  );
}
