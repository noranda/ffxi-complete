import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import {resolve} from 'path';
import {defineConfig} from 'vite';

// https://vite.dev/config/
export default defineConfig({
  // Build configuration for better development experience
  build: {
    // Reduce chunk size warnings threshold
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Better chunk splitting for development
        manualChunks: {
          ui: [
            '@radix-ui/react-slot',
            '@radix-ui/react-tabs',
            '@radix-ui/react-dialog',
          ],
          vendor: ['react', 'react-dom'],
        },
      },
    },
    // Generate source maps for debugging
    sourcemap: true,
  },
  // CSS configuration for better development experience
  css: {
    devSourcemap: true, // Generate CSS source maps in development
  },
  // Environment variable configuration
  envPrefix: ['VITE_', 'SUPABASE_'],
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
    cors: true,
    // Hot Module Replacement (HMR) configuration
    hmr: {
      overlay: true, // Show error overlay in browser
    },
    host: true, // Allow external connections
    open: false, // Don't auto-open browser (let user decide)
    // Development server configuration
    port: 5173,
    // Watch configuration for better file change detection
    watch: {
      interval: 100, // Polling interval if usePolling is true
      usePolling: false, // Use native file system events (faster)
    },
  },
});
