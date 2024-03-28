import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { fileURLToPath } from 'node:url';
import postCssNesting from 'postcss-nesting';
import postcssScss from 'postcss-scss';
import autoprefixer from 'autoprefixer';

// https://vitejs.dev/config/
const startPath = import.meta.url;

export default defineConfig({
  plugins: [vue()],
  css: {
    postcss: {
      plugins: [postCssNesting, autoprefixer],
      syntax: postcssScss,
    },
    preprocessorOptions: {
      scss: {},
    },
  },
  resolve: {
    alias: [
      { find: '@common', replacement: fileURLToPath(new URL('src/ui/common', startPath)) },
      { find: '@components', replacement: fileURLToPath(new URL('src/ui/components', startPath)) },
      { find: '@pages', replacement: fileURLToPath(new URL('src/ui/pages', startPath)) },
      { find: '@assets', replacement: fileURLToPath(new URL('src/assets', startPath)) },
    ],
  },
});
