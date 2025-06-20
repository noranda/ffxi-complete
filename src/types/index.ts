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

// Removed: CharacterWithProgress - see comprehensive definition below

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

// Removed: ApiResponse - see comprehensive definition below

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

/**
 * Convenient type aliases for database entities
 * Re-exports from database.types.ts for easier importing
 */

// =============================================================================
// CHARACTER TYPES
// =============================================================================

export type CharacterInsert =
  Database['public']['Tables']['characters']['Insert'];
export type CharacterUpdate =
  Database['public']['Tables']['characters']['Update'];

// =============================================================================
// JOB SYSTEM TYPES
// =============================================================================

export type Job = Database['public']['Tables']['jobs']['Row'];
export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
export type JobUpdate = Database['public']['Tables']['jobs']['Update'];

export type CharacterJobProgress =
  Database['public']['Tables']['character_job_progress']['Row'];
export type CharacterJobProgressInsert =
  Database['public']['Tables']['character_job_progress']['Insert'];
export type CharacterJobProgressUpdate =
  Database['public']['Tables']['character_job_progress']['Update'];

// Job type enums
export type JobType = 'combat' | 'support' | 'craft';

// =============================================================================
// SKILL SYSTEM TYPES
// =============================================================================

export type Skill = Database['public']['Tables']['skills']['Row'];
export type SkillInsert = Database['public']['Tables']['skills']['Insert'];
export type SkillUpdate = Database['public']['Tables']['skills']['Update'];

export type CharacterSkillProgress =
  Database['public']['Tables']['character_skill_progress']['Row'];
export type CharacterSkillProgressInsert =
  Database['public']['Tables']['character_skill_progress']['Insert'];
export type CharacterSkillProgressUpdate =
  Database['public']['Tables']['character_skill_progress']['Update'];

// Skill type enums
export type SkillType = 'weapon' | 'combat_support' | 'magic' | 'craft';

// =============================================================================
// PROGRESS TRACKING TYPES
// =============================================================================

// Character with full progress data
export type CharacterWithProgress = {
  character: Character;
  jobs: Array<{
    job: Job;
    progress: CharacterJobProgress;
  }>;
  skills: Array<{
    skill: Skill;
    progress: CharacterSkillProgress;
  }>;
};

// Job progress with job details
export type JobProgressWithDetails = CharacterJobProgress & {
  job: Job;
};

// Skill progress with skill details
export type SkillProgressWithDetails = CharacterSkillProgress & {
  skill: Skill;
};

// =============================================================================
// EXPANSION TYPES
// =============================================================================

export type FFXIExpansion =
  | 'Rise of the Zilart'
  | 'Chains of Promathia'
  | 'Treasures of Aht Urhgan'
  | 'Wings of the Goddess'
  | 'Seekers of Adoulin'
  | "Rhapsodies of Vana'diel";

// =============================================================================
// DATABASE FUNCTION TYPES
// =============================================================================

export type DatabaseFunctions = Database['public']['Functions'];

// Character privacy function types
export type ToggleCharacterPrivacyArgs =
  DatabaseFunctions['toggle_character_privacy']['Args'];
export type GetCharacterBySlugArgs =
  DatabaseFunctions['get_character_by_slug']['Args'];
export type GetCharacterProgressSummaryArgs =
  DatabaseFunctions['get_character_progress_summary']['Args'];

// Progress update function types
export type UpdateJobProgressArgs =
  DatabaseFunctions['update_job_progress']['Args'];
export type UpdateSkillProgressArgs =
  DatabaseFunctions['update_skill_progress']['Args'];

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

// Standard API response wrapper
export type ApiResponse<T> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

// Progress calculation results
export type ProgressSummary = {
  totalJobs: number;
  unlockedJobs: number;
  masteredJobs: number;
  totalSkills: number;
  skilledUpSkills: number;
  completionPercentage: number;
};

// =============================================================================
// FORM TYPES
// =============================================================================

// Character creation form
export type CharacterFormData = {
  name: string;
  server: string;
  race: string;
  gender: string;
  face: number;
  hair: string;
};

// Job progress update form
export type JobProgressFormData = {
  jobId: string;
  mainLevel?: number;
  subLevel?: number;
  jobPoints?: number;
  masterLevel?: number;
};

// Skill progress update form
export type SkillProgressFormData = {
  skillId: string;
  currentLevel: number;
};

// =============================================================================
// UTILITY TYPES
// =============================================================================

// For handling loading states
export type LoadingState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};

// For handling pagination
export type PaginationState = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

// For handling filters
export type JobFilter = {
  jobType?: JobType;
  expansion?: FFXIExpansion | null;
  isUnlocked?: boolean;
  isAdvanced?: boolean;
};

export type SkillFilter = {
  skillType?: SkillType;
  category?: string;
  hasProgress?: boolean;
};
