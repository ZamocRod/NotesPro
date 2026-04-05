import { create } from 'zustand';

interface ThemeState {
    isDark: boolean;
    toggleTheme: () => void;
    initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => {
    // Helper to sync theme with Electron's native material
    const syncWithElectron = (isDark: boolean) => {
        try {
            // Using window.require since nodeIntegration: true and contextIsolation: false
            const electron = (window as any).require?.('electron');
            if (electron?.ipcRenderer) {
                electron.ipcRenderer.send('set-native-theme', isDark ? 'dark' : 'light');
            }
        } catch (e) {
            // console.warn('Not in Electron environment or IPC failed');
        }
    };

    return {
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

            syncWithElectron(isDark);
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

            syncWithElectron(isDark);
            set({ isDark });
        }
    };
});
