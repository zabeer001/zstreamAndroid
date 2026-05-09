import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { getPosts } from '@/src/lib/api';
import { useAuthStore } from '@/src/stores/auth.store';

import { ExploreFeed } from './_components/ExploreFeed';
import { ExploreHeader } from './_components/ExploreHeader';
import { ExploreSearch } from './_components/ExploreSearch';
import { FeedCategoryTabs } from './_components/FeedCategoryTabs';
import { useExploreStore } from './explore.store';

export function ExplorePage() {
  const getAccessToken = useAuthStore((state) => state.getAccessToken);
  const isLoaded = useAuthStore((state) => state.isLoaded);
  const isSignedIn = useAuthStore((state) => Boolean(state.accessToken));
  const activeCategory = useExploreStore((state) => state.activeCategory);
  const query = useExploreStore((state) => state.query);
  const setPosts = useExploreStore((state) => state.setPosts);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const loadPosts = useCallback(
    async (mode: 'initial' | 'refresh' = 'initial') => {
      if (!isLoaded) return;

      const requestId = requestIdRef.current + 1;
      requestIdRef.current = requestId;

      if (!isSignedIn) {
        setPosts([]);
        setIsLoading(false);
        setIsRefreshing(false);
        setErrorMessage('Sign in to explore posts.');
        return;
      }

      try {
        if (mode === 'refresh') {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setErrorMessage(null);

        const token = await getAccessToken();
        if (!token) throw new Error('Missing auth session');

        const response = await getPosts(token, {
          category: activeCategory,
          search: query,
          page: 1,
          limit: 20,
        });

        if (requestIdRef.current === requestId) {
          setPosts(response.posts);
        }
      } catch (error) {
        if (requestIdRef.current !== requestId) return;

        const message = error instanceof Error ? error.message : 'Could not load posts right now.';
        console.log('Error loading explore posts:', error);
        setErrorMessage(message);
        if (mode === 'refresh') {
          Alert.alert('Explore unavailable', message);
        }
      } finally {
        if (requestIdRef.current === requestId) {
          setIsLoading(false);
          setIsRefreshing(false);
        }
      }
    },
    [activeCategory, getAccessToken, isLoaded, isSignedIn, query, setPosts]
  );

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-24 pt-4"
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} tintColor="#14A800" onRefresh={() => loadPosts('refresh')} />
        }
        showsVerticalScrollIndicator={false}>
        <ExploreHeader />
        <ExploreSearch />
        <FeedCategoryTabs />
        <ExploreFeed errorMessage={errorMessage} isLoading={isLoading} onRetry={() => loadPosts()} />
      </ScrollView>
    </SafeAreaView>
  );
}
