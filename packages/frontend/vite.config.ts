import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@examples': path.resolve(__dirname, '../../examples'),
      // Ensure examples can resolve modules from frontend's node_modules
      '@mui/material': path.resolve(__dirname, 'node_modules/@mui/material'),
      '@opengov/react-capital-assets': path.resolve(__dirname, 'node_modules/@opengov/react-capital-assets'),
      '@opengov/components-og-grid-table': path.resolve(__dirname, 'node_modules/@opengov/components-og-grid-table'),
      '@opengov/components-page-header': path.resolve(__dirname, 'node_modules/@opengov/components-page-header'),
      'react-router': path.resolve(__dirname, 'node_modules/react-router')
    }
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/health': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
