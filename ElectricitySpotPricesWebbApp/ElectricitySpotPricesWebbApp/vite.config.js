import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://data.fingrid.fi',  // API base URL
        changeOrigin: true,
        secure: true,
      },
    },
  },
});