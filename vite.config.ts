import path from 'path';
import { defineConfig } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: [
      {
        find: /^~/,
        replacement: path.resolve(__dirname, 'node_modules') + '/',
      },
      {
        find: /@\//,
        replacement: path.resolve(__dirname, 'src') + '/',
      },
    ],
  },
  plugins: [reactRefresh()],
  optimizeDeps: {
    include: ['@ant-design/icons'],
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
});
