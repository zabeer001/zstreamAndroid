import { create } from 'zustand';

export type AppThemeMode = 'system' | 'light' | 'dark';

type ThemeState = {
  mode: AppThemeMode;
  setMode: (mode: AppThemeMode) => void;
};

export const useThemeStore = create<ThemeState>((set) => ({
  mode: 'system',
  setMode: (mode) => set({ mode }),
}));
