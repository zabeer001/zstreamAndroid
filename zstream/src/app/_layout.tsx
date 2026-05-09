import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import { useColorScheme } from '@/src/hooks/use-color-scheme';
import { useAuthStore } from '@/src/stores/auth.store';
import { useThemeStore } from '@/src/stores/theme.store';
import '@/global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.mode);
  const resolvedColorScheme = themeMode === 'system' ? colorScheme : themeMode;
  const hydrate = useAuthStore((state) => state.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GluestackUIProvider mode={themeMode}>
        <ThemeProvider value={resolvedColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="sso-callback" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style={resolvedColorScheme === 'dark' ? 'light' : 'dark'} />
        </ThemeProvider>
      </GluestackUIProvider>
    </GestureHandlerRootView>
  );
}
