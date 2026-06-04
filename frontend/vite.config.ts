import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Absolute base so hashed asset URLs survive the Cloudflare Pages SPA
  // fallback (/* -> /index.html) even on deep paths.
  base: '/',
  plugins: [
    react(),
    {
      name: 'remove-css-crossorigin',
      transformIndexHtml(html) {
        return html.replace(/<link rel="stylesheet" crossorigin=""/g, '<link rel="stylesheet"');
      },
    },
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: 'esnext',
    outDir: 'build',
  },
  server: {
    port: 3000,
    open: true,
  },
});
