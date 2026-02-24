import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      entry: ['electron/main.ts', 'electron/preload.ts'],
      onstart(options) {
        options.startup()
      },
      vite: {
        build: {
          sourcemap: true,
          minify: false,
          outDir: 'dist-electron',
          rollupOptions: {
            external: ['better-sqlite3', 'electron-clipboard-watcher', 'clipboard'],
            output: {
              assetFileNames: assetInfo => {
                if (assetInfo.name?.endsWith('.node')) {
                  return 'assets/[name][extname]'
                }
                return 'assets/[name]-[hash][extname]'
              },
            },
          },
        },
      },
    }),
    renderer(),
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
      external: ['better-sqlite3', 'electron-clipboard-watcher', 'clipboard'],
    },
  },
})
