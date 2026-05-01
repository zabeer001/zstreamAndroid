import { ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { CourseCategoryTabs } from './_components/CourseCategoryTabs';
import { CoursesHeader } from './_components/CoursesHeader';
import { CoursesList } from './_components/CoursesList';
import { CoursesSearch } from './_components/CoursesSearch';

export function CoursesPage() {
  return (
    <SafeAreaView className="flex-1 bg-background-0 dark:bg-background-950" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-24 pt-4"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <CoursesHeader />
        <CoursesSearch />
        <CourseCategoryTabs />
        <CoursesList />
      </ScrollView>
    </SafeAreaView>
  );
}
