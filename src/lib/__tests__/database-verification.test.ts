/**
 * Basic database verification test
 * Verifies database connectivity and RLS functionality
 */

import {describe, expect, it} from 'vitest';

import {supabase} from '@/lib/supabase';

describe('Database Verification', () => {
  describe('Database Connectivity', () => {
    it('should connect to Supabase successfully', async () => {
      // Test basic connectivity using the characters table which we know exists
      const {data, error} = await supabase.from('characters').select('id').limit(0); // Just test connectivity, not data

      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
    });

    it('should have environment variables configured correctly', () => {
      expect(import.meta.env.VITE_SUPABASE_URL).toBeDefined();
      expect(import.meta.env.VITE_SUPABASE_ANON_KEY).toBeDefined();
      expect(import.meta.env.VITE_SUPABASE_URL).toContain('supabase');
    });
  });

  describe('Row Level Security (RLS)', () => {
    it('should block access to characters table without authentication', async () => {
      // When not authenticated, should not be able to access characters due to RLS
      const {data, error} = await supabase.from('characters').select('*').limit(10);

      // Should return empty array due to RLS filtering (not an error)
      expect(error).toBeNull();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0); // Should be empty due to RLS
    });

    it('should prevent unauthorized inserts due to RLS', async () => {
      // Attempting to insert without proper authentication should fail
      const {error} = await supabase.from('characters').insert({
        name: 'TestCharacter',
        server: 'TestServer',
        user_id: '00000000-0000-0000-0000-000000000000', // Fake UUID
      });

      // Should fail due to RLS policy
      expect(error).toBeTruthy();
      expect(error?.message).toContain('new row violates row-level security policy');
    });
  });
});
