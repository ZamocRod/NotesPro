import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  base: './',
  clearScreen: false,
  define: { __APP_VERSION__: JSON.stringify(packageJson.version) },
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: host || '127.0.0.1',
    watch: { ignored: ['**/src-tauri/**'] },
  },
});
