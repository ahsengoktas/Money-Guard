import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vite.dev/config/
// GitHub Pages serves the app from /Money-Guard/, so production builds use that
// base path. `npm run dev` keeps working at the root URL.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/Money-Guard/' : '/',
  plugins: [react()],
}));
