/// <reference types="vitest/config" />
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@eqds': path.resolve(rootDir, 'src/eqds'),
      '@features': path.resolve(rootDir, 'src/features'),
      '@hooks': path.resolve(rootDir, 'src/hooks'),
      '@types': path.resolve(rootDir, 'src/types'),
      '@utils': path.resolve(rootDir, 'src/utils'),
      '@eqds-utils': path.resolve(rootDir, 'src/eqds/utils'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    css: true,
  },
})
