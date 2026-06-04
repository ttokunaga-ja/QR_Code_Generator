import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { seoPlugin } from './seo.config';

export default defineConfig({
  // Absolute base so hashed asset URLs survive the Cloudflare Pages SPA
  // fallback (/* -> /index.html) even on deep paths.
  base: '/',
  plugins: [
    react(),
    seoPlugin(),
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
    rollupOptions: {
      output: {
        // Split rarely-changing vendor code into its own long-lived cache
        // entry so app-only deploys don't bust the (large) MUI/React chunk.
        manualChunks: {
          react: ['react', 'react-dom'],
          mui: ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
          i18n: ['i18next', 'react-i18next'],
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
