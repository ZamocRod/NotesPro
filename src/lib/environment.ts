// Vite replaces DEV at build time: packaged builds always use production data.
export const DATA_ENVIRONMENT = import.meta.env.DEV ? 'development' : 'production';
export const DATABASE_NAME = import.meta.env.DEV ? 'NotesProDB-dev' : 'NotesProDB';
export const THEME_STORAGE_KEY = import.meta.env.DEV ? 'notespro-theme-dev' : 'notespro-theme';
