/**
 * TypeScript type definitions for FFXI tracker
 *
 * This module exports all the types we need for working with our database
 * and provides convenient type aliases for common operations.
 */

// Export the generated database types
export type {Database} from './database.types';

// Import database types for creating aliases
import type {Database} from './database.types';

// =============================================================================
// TABLE ROW TYPES - The actual data structure returned from queries
// =============================================================================

/**
 * Character data as stored in the database
 * Represents a FFXI character belonging to a user
 */
export type Character = Database['public']['Tables']['characters']['Row'];

/**
 * Character progress data as stored in the database
 * Flexible progress tracking for jobs, skills, trusts, etc.
 */
export type CharacterProgress =
  Database['public']['Tables']['character_progress']['Row'];

// =============================================================================
// INSERT TYPES - For creating new records
// =============================================================================

/**
 * Data required when creating a new character
 * Some fields like id, timestamps are auto-generated
 */
export type CreateCharacterData =
  Database['public']['Tables']['characters']['Insert'];

/**
 * Data required when creating new progress entries
 * Some fields like id, timestamps are auto-generated
 */
export type CreateProgressData =
  Database['public']['Tables']['character_progress']['Insert'];

// =============================================================================
// UPDATE TYPES - For modifying existing records
// =============================================================================

/**
 * Data that can be updated on an existing character
 * All fields are optional since you can update just one field
 */
export type UpdateCharacterData =
  Database['public']['Tables']['characters']['Update'];

/**
 * Data that can be updated on existing progress entries
 * All fields are optional since you can update just one field
 */
export type UpdateProgressData =
  Database['public']['Tables']['character_progress']['Update'];

// =============================================================================
// CONVENIENCE TYPES - For common app-specific use cases
// =============================================================================

/**
 * Character with related progress data
 * Used when we need to display a character along with their progress
 */
export type CharacterWithProgress = Character & {
  progress: CharacterProgress[];
};

/**
 * Progress categories used throughout the app
 * Helps ensure consistency in progress tracking
 */
export type ProgressCategory =
  | 'job'
  | 'skill'
  | 'trust'
  | 'mount'
  | 'blue_magic'
  | 'fame'
  | 'quest'
  | 'mission'
  | 'item';

/**
 * Common progress metadata structures
 * These match what we store in the JSONB metadata field
 */
export type ProgressMetadata = {
  // Job-specific metadata
  job?: {
    experience?: number;
    sub_job?: string;
    abilities_learned?: string[];
  };

  // Skill-specific metadata
  skill?: {
    cap?: number;
    food_bonus?: number;
    merits?: number;
  };

  // Trust-specific metadata
  trust?: {
    acquired_date?: string;
    source?: string;
    unity_rank?: number;
  };

  // Item-specific metadata
  item?: {
    quantity?: number;
    augments?: string[];
    obtained_from?: string;
  };

  // General metadata that applies to any category
  notes?: string;
  last_updated_by?: string;
};

/**
 * Supabase auth user type
 * Re-exported for convenience when working with authentication
 */
export type {User} from '@supabase/supabase-js';

// =============================================================================
// API RESPONSE TYPES - For handling API calls
// =============================================================================

/**
 * Standard API response structure
 * Provides consistent error handling across the app
 */
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

/**
 * Paginated response structure
 * Used for lists that need pagination
 */
export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
};

// =============================================================================
// LEARNING NOTE
// =============================================================================
/*
Type Organization Best Practices:

1. **Separation of Concerns**: 
   - Generated types (database.types.ts) stay separate
   - Application types (index.ts) build on generated types
   - This allows regenerating database types without losing custom types

2. **Type Aliases**: 
   - Create meaningful names (Character vs Database['public']['Tables']['characters']['Row'])
   - Group related types together
   - Document the purpose of each type

3. **Convenience Types**:
   - Combine related data (CharacterWithProgress)
   - Create unions for known values (ProgressCategory)
   - Define metadata structures for JSONB fields

4. **API Types**:
   - Standardize response formats
   - Handle pagination consistently
   - Provide error handling patterns

This structure makes the codebase more maintainable and provides better
developer experience with autocomplete and type checking.
*/
