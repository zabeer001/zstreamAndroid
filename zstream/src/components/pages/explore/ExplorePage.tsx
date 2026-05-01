import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ExploreFeed } from './_components/ExploreFeed';
import { ExploreHeader } from './_components/ExploreHeader';
import { ExploreSearch } from './_components/ExploreSearch';
import { FeedCategoryTabs } from './_components/FeedCategoryTabs';

export function ExplorePage() {
  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-24 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <ExploreHeader />
        <ExploreSearch />
        <FeedCategoryTabs />
        <ExploreFeed />
      </ScrollView>
    </SafeAreaView>
  );
}
