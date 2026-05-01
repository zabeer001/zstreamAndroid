import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SettingsHeader } from './_components/SettingsHeader';
import { ThemeModeCard } from './_components/ThemeModeCard';

export function SettingsPage() {
  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-24 pt-4"
        showsVerticalScrollIndicator={false}>
        <SettingsHeader />
        <ThemeModeCard />
      </ScrollView>
    </SafeAreaView>
  );
}
