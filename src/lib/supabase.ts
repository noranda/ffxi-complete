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

// Validate environment variables in development
if (!supabaseUrl || !supabaseAnonKey) {
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
 */
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Enable automatic session refresh
    autoRefreshToken: true,
    // Persist session in localStorage
    persistSession: true,
    // Detect session from URL (for OAuth flows)
    detectSessionInUrl: true,
  },
});

/**
 * Development helper to test Supabase connection
 * Only runs in development mode
 */
if (import.meta.env.DEV) {
  supabase.auth.onAuthStateChange((event, session) => {
    console.log('🔐 Auth state changed:', event, session?.user?.email);
  });
}
