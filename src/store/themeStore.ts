import { create } from 'zustand';
import { isTauri } from '@tauri-apps/api/core';
import { getCurrentWindow } from '@tauri-apps/api/window';
import { THEME_STORAGE_KEY } from '../lib/environment';

interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => {
    const syncNativeTheme = (isDark: boolean) => {
        if (isTauri()) {
            void getCurrentWindow().setTheme(isDark ? 'dark' : 'light')
                .catch(error => console.error('Error syncing native theme:', error));
        }
    };

    return {
        isDark: false,
        toggleTheme: () => {
            const isDark = !get().isDark;

            // update localStorage
            if (isDark) {
                localStorage.setItem(THEME_STORAGE_KEY, 'dark');
                document.body.classList.add('dark-theme');
            } else {
                localStorage.setItem(THEME_STORAGE_KEY, 'light');
                document.body.classList.remove('dark-theme');
            }

            syncNativeTheme(isDark);
            set({ isDark });
        },
        initTheme: () => {
            const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
            // Default to system preference if no saved theme
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

            const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

            if (isDark) {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }

            syncNativeTheme(isDark);
            set({ isDark });
        }
    };
});
