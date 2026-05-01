import { useMemo } from 'react';
import { View } from 'react-native';

import { useExploreStore } from '../explore.store';
import { ExploreEmptyState } from './ExploreEmptyState';
import { FeedPostCard } from './FeedPostCard';

export function ExploreFeed() {
  const activeCategory = useExploreStore((state) => state.activeCategory);
  const posts = useExploreStore((state) => state.posts);
  const query = useExploreStore((state) => state.query);

  const visiblePosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return posts.filter((post) => {
      if (activeCategory !== 'all' && post.category !== activeCategory) return false;
      if (!normalizedQuery) return true;

      return [post.author, post.role, post.title, post.body, post.category, ...post.tags]
        .join(' ')
        .toLowerCase()
        .includes(normalizedQuery);
    });
  }, [activeCategory, posts, query]);

  return (
    <View className="gap-3">
      {visiblePosts.map((post) => (
        <FeedPostCard key={post.id} post={post} />
      ))}

      {!visiblePosts.length ? <ExploreEmptyState /> : null}
    </View>
  );
}
