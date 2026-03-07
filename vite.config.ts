import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron/simple'
import tailwindcss from '@tailwindcss/vite'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
          options.reload()
        },
      },
    }),
  ],
  server: {
    open: true,
  },
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
      '@/types': join(__dirname, 'types'),
    },
  },
  build: {
    rollupOptions: {
      external: ['electron'],
    },
  },
})
