import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import { join } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron({
      main: {
        entry: 'electron/main.ts',
        vite: {
          build: {
            sourcemap: true,
            minify: false,
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['better-sqlite3', 'electron-clipboard-watcher', 'clipboard'],
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
            sourcemap: undefined, // #332
            minify: false,
            outDir: 'dist-electron',
            rollupOptions: {
              external: ['better-sqlite3', 'electron-clipboard-watcher', 'clipboard'],
              output: {
                entryFileNames: '[name].js',
              },
            },
          },
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
      external: ['better-sqlite3', 'electron-clipboard-watcher', 'clipboard'],
    },
  },
})
