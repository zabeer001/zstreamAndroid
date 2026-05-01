import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

export function SettingsHeader() {
  return (
    <View className="mb-4 flex-row items-start gap-3">
      <View className="h-10 w-10 items-center justify-center rounded-md bg-success-50 dark:bg-background-900">
        <Ionicons name="settings-outline" size={20} color="#14A800" />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="text-2xl font-bold text-typography-950 dark:text-typography-0">
          Settings
        </Text>
        <Text className="mt-1 text-sm text-typography-500 dark:text-typography-400">
          Control how the app looks
        </Text>
      </View>
    </View>
  );
}
