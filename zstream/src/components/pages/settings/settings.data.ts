import type { AppThemeMode } from '@/src/stores/theme.store';

export type ThemeOption = {
  description: string;
  icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  label: string;
  mode: AppThemeMode;
};

export const themeOptions: ThemeOption[] = [
  {
    description: 'Follow your phone theme',
    icon: 'phone-portrait-outline',
    label: 'System',
    mode: 'system',
  },
  {
    description: 'Bright interface',
    icon: 'sunny-outline',
    label: 'Light',
    mode: 'light',
  },
  {
    description: 'Low-light interface',
    icon: 'moon-outline',
    label: 'Dark',
    mode: 'dark',
  },
];
