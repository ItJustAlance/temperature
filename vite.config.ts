// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';

export default defineConfig(({ command, mode }) => {
  return {
    plugins: [vue()],
    build: {
      emptyOutDir: true,
      outDir: 'dist', // Укажите здесь выходную директорию
      minify: mode !== 'development',
      rollupOptions: {
        output: {
          assetFileNames: 'assets/[name][extname]',
          chunkFileNames: 'js/[name].js',
          entryFileNames: 'js/app.js'
        }
      }
    },
    resolve: {
      alias: [
        { find: "@", replacement: resolve(__dirname, "./src") },
      ]
    }
  }
});
