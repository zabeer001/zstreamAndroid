import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useColorScheme } from '@/src/hooks/use-color-scheme';


import { GluestackUIProvider } from '@/src/components/ui/gluestack-ui-provider';
import { useThemeStore } from '@/src/stores/theme.store';
import '@/global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const themeMode = useThemeStore((state) => state.mode);
  const resolvedColorScheme = themeMode === 'system' ? colorScheme : themeMode;

  return (
    
    <GluestackUIProvider mode={themeMode}>
      <ThemeProvider value={resolvedColorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style={resolvedColorScheme === 'dark' ? 'light' : 'dark'} />
    </ThemeProvider>
    </GluestackUIProvider>
  
  );
}
