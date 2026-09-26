// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/',
  server: { proxy: { '/api': { target: 'http://localhost:5238', changeOrigin: true }, '/uploads': { target: 'http://localhost:5238', changeOrigin: true } } },
  build: {
    outDir: '../backend/TrailsUA.API/wwwroot',
    emptyOutDir: true,
    // Збільшуємо ліміт попередження з 500кБ до 1000кБ
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Розділяємо важкі бібліотеки на окремі кешовані файли
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor-react';
            }
            if (id.includes('@react-oauth')) {
              return 'vendor-oauth';
            }
            if (id.includes('axios')) {
              return 'vendor-axios';
            }
            return 'vendor';
          }
        },
      },
    },
  },
});