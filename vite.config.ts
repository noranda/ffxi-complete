import {resolve} from 'path';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {defineConfig} from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Include .tsx files for JSX processing
      include: ['**/*.tsx', '**/*.ts'],
    }),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(process.cwd(), './src'),
    },
  },
  server: {
    // Development server configuration
    port: 5173,
    host: true, // Allow external connections
    open: false, // Don't auto-open browser (let user decide)
    cors: true,
    // Hot Module Replacement (HMR) configuration
    hmr: {
      overlay: true, // Show error overlay in browser
    },
    // Watch configuration for better file change detection
    watch: {
      usePolling: false, // Use native file system events (faster)
      interval: 100, // Polling interval if usePolling is true
    },
  },
  // Build configuration for better development experience
  build: {
    // Generate source maps for debugging
    sourcemap: true,
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Better chunk splitting for development
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: [
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-dialog',
          ],
        },
      },
    },
  },
  // Optimize dependencies for faster dev server startup
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      '@radix-ui/react-dialog',
      'clsx',
      'tailwind-merge',
      'tailwind-variants',
      'lucide-react',
      'vaul',
    ],
  },
  // Environment variable configuration
  envPrefix: ['VITE_', 'SUPABASE_'],
  // CSS configuration for better development experience
  css: {
    devSourcemap: true, // Generate CSS source maps in development
  },
});
