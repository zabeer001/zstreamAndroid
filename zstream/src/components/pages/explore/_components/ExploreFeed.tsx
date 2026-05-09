import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { useExploreStore } from '../explore.store';
import { ExploreEmptyState } from './ExploreEmptyState';
import { FeedPostCard } from './FeedPostCard';

type ExploreFeedProps = {
  errorMessage?: string | null;
  isLoading?: boolean;
  onRetry?: () => void;
};

export function ExploreFeed({ errorMessage, isLoading = false, onRetry }: ExploreFeedProps) {
  const posts = useExploreStore((state) => state.posts);

  if (isLoading) {
    return (
      <View className="items-center rounded-md border border-outline-200 bg-background-0 px-4 py-12 dark:border-outline-800 dark:bg-background-900">
        <ActivityIndicator color="#14A800" size="large" />
        <Text className="mt-3 text-sm font-semibold text-typography-600 dark:text-typography-300">
          Loading posts
        </Text>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <View className="items-center rounded-md border border-outline-200 bg-background-0 px-4 py-10 dark:border-outline-800 dark:bg-background-900">
        <Text className="text-center text-sm font-semibold text-typography-700 dark:text-typography-300">
          {errorMessage}
        </Text>
        {onRetry ? (
          <Pressable className="mt-4 rounded-md bg-success-600 px-4 py-2" onPress={onRetry}>
            <Text className="text-sm font-bold text-white">Try again</Text>
          </Pressable>
        ) : null}
      </View>
    );
  }

  return (
    <View className="gap-3">
      {posts.map((post) => (
        <FeedPostCard key={post.feedItemId || post._id} post={post} />
      ))}

      {!posts.length ? <ExploreEmptyState /> : null}
    </View>
  );
}
