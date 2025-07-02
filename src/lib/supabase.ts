import {createClient} from '@supabase/supabase-js';

import type {Database} from '@/types/database.types';

/**
 * Supabase client configuration with full TypeScript support
 *
 * This creates a single instance of the Supabase client that will be used
 * throughout the application for all database operations and authentication.
 *
 * The Database type provides:
 * - Full type safety for all database operations
 * - Autocomplete for table and column names
 * - Compile-time validation of queries
 * - Generated from actual database schema
 *
 * Environment Variables:
 * - VITE_SUPABASE_URL: Your Supabase project URL
 * - VITE_SUPABASE_ANON_KEY: Your Supabase anonymous key (safe for browser)
 *
 * Security Note:
 * - The anon key respects Row Level Security policies
 * - Never use the service_role key in client-side code
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

// Provide fallback values for testing environments
const url = supabaseUrl || 'https://localhost:3000';
const key = supabaseAnonKey || 'test-anon-key';

// Validate environment variables in development (but not in test environments)
if ((!supabaseUrl || !supabaseAnonKey) && import.meta.env.DEV && !import.meta.env.VITEST) {
  console.error(
    '🔴 Missing Supabase environment variables. Please check your .env.local file:\n' +
      '   VITE_SUPABASE_URL=your_supabase_url\n' +
      '   VITE_SUPABASE_ANON_KEY=your_anon_key\n' +
      '   See .env.example for the template.'
  );
}

/**
 * Supabase client instance with full TypeScript support
 *
 * This client handles:
 * - Database queries (supabase.from('table')) - with full type safety
 * - Authentication (supabase.auth) - with proper user types
 * - Real-time subscriptions (supabase.channel()) - with typed payloads
 * - File storage (supabase.storage) - with upload/download types
 *
 * TypeScript Benefits:
 * - Autocomplete for table and column names
 * - Compile-time validation of queries
 * - Proper return types for all operations
 * - Integration with generated database types
 *
 * Session Management:
 * - Automatic token refresh before expiry
 * - Persistent session storage in localStorage
 * - Cross-tab session synchronization
 * - Automatic session recovery on app restart
 */
export const supabase = createClient<Database>(url, key, {
  auth: {
    // Enable automatic session refresh (refreshes ~5 minutes before expiry)
    autoRefreshToken: true,
    // Detect session from URL (for OAuth flows and email confirmations)
    detectSessionInUrl: true,
    // Use PKCE flow for enhanced security (recommended for SPAs)
    flowType: 'pkce',
    // Persist session in localStorage for cross-session persistence
    persistSession: true,
    // Additional storage options for enhanced persistence
    storage: {
      getItem: (key: string) => {
        if (typeof window !== 'undefined') {
          return window.localStorage.getItem(key);
        }
        return null;
      },
      removeItem: (key: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      },
      setItem: (key: string, value: string) => {
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, value);
        }
      },
    },
  },
  // Enable debug mode in development for better session monitoring
  ...(import.meta.env.DEV && {
    auth: {
      autoRefreshToken: true,
      debug: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      persistSession: true,
    },
  }),
});

/**
 * Development helper to test Supabase connection
 * Only runs in development mode
 */
if (import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) =>
    console.log('🔐 Auth state changed:', event, session?.user?.email)
  );
}
