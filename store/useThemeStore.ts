'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeMode = 'dark' | 'light';

interface ThemeState {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => {
        const nextTheme = get().theme === 'dark' ? 'light' : 'dark';
        set({ theme: nextTheme });
        if (typeof document !== 'undefined') {
          if (nextTheme === 'light') {
            document.documentElement.classList.add('light-mode');
          } else {
            document.documentElement.classList.remove('light-mode');
          }
        }
      },
      setTheme: (theme: ThemeMode) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          if (theme === 'light') {
            document.documentElement.classList.add('light-mode');
          } else {
            document.documentElement.classList.remove('light-mode');
          }
        }
      },
    }),
    {
      name: 'velora_theme',
    }
  )
);
