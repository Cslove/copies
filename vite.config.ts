import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            sourcemap: process.env.NODE_ENV === 'development',
            minify: process.env.NODE_ENV === 'production',
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron'],
              output: {
                assetFileNames: (assetInfo) => {
                  if (assetInfo.name?.endsWith('.node')) {
                    return 'assets/[name][extname]'
                  }
                  return 'assets/[name]-[hash][extname]'
                },
              },
            },
          },
        },
      },
      preload: {
        input: 'electron/preload.ts',
        vite: {
          build: {
            sourcemap: process.env.NODE_ENV === 'development',
            minify: process.env.NODE_ENV === 'production',
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['electron'],
              output: {
                entryFileNames: '[name].js',
              },
            },
          },
        },
        onstart(options) {
          // 当预加载脚本变化时，自动重启 Electron 渲染进程
          options.reload()
        },
      },
    }),
  ],
  server: {
    open: true, // Open the browser window
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      external: ['electron'],
    },
  },
})
