import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import reactRefresh from '@vitejs/plugin-react-refresh';
import styleImport from 'vite-plugin-style-import';
import { viteMockServe } from 'vite-plugin-mock';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const viteEnv = loadEnv(mode, process.cwd());
  const plugins = [
    reactRefresh(),
    styleImport({
      libs: [
        {
          libraryName: 'antd',
          esModule: true,
          resolveStyle: name => {
            return `antd/es/${name}/style/index`;
          },
        },
      ],
    }),
  ];

  viteEnv.VITE_MOCK &&
    plugins.push(
      viteMockServe({
        localEnabled: true,
      }),
    );

  return {
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
    server: {
      proxy: {
        '/api': {
          target: 'http://insurance.wghtstudio.cn',
          changeOrigin: true,
        },
      },
    },
    plugins: plugins,
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
  };
});
