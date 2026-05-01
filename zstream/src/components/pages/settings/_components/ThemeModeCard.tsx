import { Ionicons } from '@expo/vector-icons';
import { Pressable, Text, View } from 'react-native';

import { useThemeStore } from '@/src/stores/theme.store';

import { themeOptions } from '../settings.data';

export function ThemeModeCard() {
  const themeMode = useThemeStore((state) => state.mode);
  const setThemeMode = useThemeStore((state) => state.setMode);

  return (
    <View className="rounded-md border border-outline-200 bg-background-0 p-3 dark:border-outline-800 dark:bg-background-900">
      <Text className="text-base font-bold text-typography-950 dark:text-typography-0">
        Theme
      </Text>
      <Text className="mt-1 text-sm text-typography-500 dark:text-typography-400">
        Choose the color mode for the app
      </Text>

      <View className="mt-3 gap-2">
        {themeOptions.map((option) => {
          const isActive = themeMode === option.mode;

          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: isActive }}
              className={`flex-row items-center gap-3 rounded-md border px-3 py-3 ${
                isActive
                  ? 'border-success-600 bg-success-50 dark:bg-background-800'
                  : 'border-outline-200 bg-background-0 dark:border-outline-800 dark:bg-background-900'
              }`}
              key={option.mode}
              onPress={() => setThemeMode(option.mode)}>
              <View className="h-9 w-9 items-center justify-center rounded-md bg-background-50 dark:bg-background-800">
                <Ionicons
                  name={option.icon}
                  size={18}
                  color={isActive ? '#14A800' : '#6B7280'}
                />
              </View>
              <View className="min-w-0 flex-1">
                <Text
                  className={`text-sm font-bold ${
                    isActive
                      ? 'text-success-700 dark:text-success-500'
                      : 'text-typography-950 dark:text-typography-0'
                  }`}>
                  {option.label}
                </Text>
                <Text className="mt-0.5 text-xs text-typography-500 dark:text-typography-400">
                  {option.description}
                </Text>
              </View>
              {isActive ? <Ionicons name="checkmark-circle" size={20} color="#14A800" /> : null}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
