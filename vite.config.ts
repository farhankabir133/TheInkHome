import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import fs from 'fs';

export default defineConfig(() => {
  return {
    base: '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      rollupOptions: {
        output: {
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
        },
        external: ['three', '@google/genai', 'groq-sdk', '@upstash/redis', 'express', 'helmet', 'express-rate-limit'],
      },
      // Copy knowledge base into dist so it is available in Vercel deployments
      writeBundle: async () => {
        const srcDir = path.resolve(__dirname, 'knowledge');
        const destDir = path.resolve(__dirname, 'dist', 'knowledge');
        if (fs.existsSync(srcDir)) {
          fs.cpSync(srcDir, destDir, { recursive: true });
        }
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
