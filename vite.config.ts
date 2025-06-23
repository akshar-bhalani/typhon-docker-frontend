import path from 'path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ckeditor5({ theme: require.resolve('@ckeditor/ckeditor5-theme-lark') })],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
