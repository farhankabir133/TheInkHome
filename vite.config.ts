import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    // Base path for assets. Can be overridden at build time via VITE_BASE.
    // Defaults to '/TheInkHome/' for repo-based gh-pages builds, or '/' for dev.
    base:
      (typeof (process.env.VITE_BASE) === 'string' && process.env.VITE_BASE.length > 0)
        ? process.env.VITE_BASE
        : process.env.NODE_ENV === 'production'
        ? '/TheInkHome/'
        : '/',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
