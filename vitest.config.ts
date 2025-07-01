import react from '@vitejs/plugin-react';
import {defineConfig} from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  test: {
    coverage: {
      exclude: ['node_modules/', 'src/test/', '**/*.d.ts', '**/*.config.*', '**/coverage/**'],
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
    css: true,
    environment: 'jsdom',
    exclude: ['node_modules', 'dist', '.git', '.cache'],
    globals: true,
    include: [
      'src/**/__tests__/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
    ],
    setupFiles: ['./src/test/setup.ts'],
  },
});
