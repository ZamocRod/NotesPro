import { create } from 'zustand';

interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    isDark: false,
    toggleTheme: () => {
        const isDark = !get().isDark;

        // update localStorage
        if (isDark) {
            localStorage.setItem('notespro-theme', 'dark');
            document.body.classList.add('dark-theme');
        } else {
            localStorage.setItem('notespro-theme', 'light');
            document.body.classList.remove('dark-theme');
        }

        set({ isDark });
    },
    initTheme: () => {
        const savedTheme = localStorage.getItem('notespro-theme');
        // Default to system preference if no saved theme
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);

        if (isDark) {
            document.body.classList.add('dark-theme');
        } else {
            document.body.classList.remove('dark-theme');
        }

        set({ isDark });
    }
}));
