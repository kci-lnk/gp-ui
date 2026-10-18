import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
export default defineConfig({
  plugins: [vue()],
  build: {
    lib: { entry: 'src/index.ts', formats: ['es'], fileName: 'gp-ui', cssFileName: 'style' },
    rolldownOptions: { external: ['vue', 'reka-ui', '@internationalized/date'] },
  },
});
