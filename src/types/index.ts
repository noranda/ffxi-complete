/**
 * TypeScript type definitions for FFXI tracker
 *
 * This module exports all the types we need for working with our database
 * and provides convenient type aliases for common operations.
 */

// Export the generated database types
// Import database types for creating aliases
import type {Database} from './database.types';

export type {Database} from './database.types';

// =============================================================================
// TABLE ROW TYPES - The actual data structure returned from queries
// =============================================================================

// Standard API response wrapper
export type ApiResponse<T> = {
  data: null | T;
  error: null | string;
  success: boolean;
};

/**
 * Character data as stored in the database
 * Represents a FFXI character belonging to a user
 */
export type Character = Database['public']['Tables']['characters']['Row'];

// =============================================================================
// INSERT TYPES - For creating new records
// =============================================================================

// Character creation form
export type CharacterFormData = {
  face: number;
  gender: string;
  hair: string;
  name: string;
  race: string;
  server: string;
};

export type CharacterInsert = Database['public']['Tables']['characters']['Insert'];

// =============================================================================
// UPDATE TYPES - For modifying existing records
// =============================================================================

export type CharacterJobProgress = Database['public']['Tables']['character_job_progress']['Row'];

export type CharacterJobProgressInsert = Database['public']['Tables']['character_job_progress']['Insert'];

// =============================================================================
// CONVENIENCE TYPES - For common app-specific use cases
// =============================================================================

// Removed: CharacterWithProgress - see comprehensive definition below

export type CharacterJobProgressUpdate = Database['public']['Tables']['character_job_progress']['Update'];

/**
 * Character progress data as stored in the database
 * Flexible progress tracking for jobs, skills, trusts, etc.
 */
export type CharacterProgress = Database['public']['Tables']['character_progress']['Row'];

/**
 * Supabase auth user type
 * Re-exported for convenience when working with authentication
 */
export type {User} from '@supabase/supabase-js';

// =============================================================================
// API RESPONSE TYPES - For handling API calls
// =============================================================================

// Removed: ApiResponse - see comprehensive definition below

export type CharacterSkillProgress = Database['public']['Tables']['character_skill_progress']['Row'];

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

export type CharacterSkillProgressInsert = Database['public']['Tables']['character_skill_progress']['Insert'];
export type CharacterSkillProgressUpdate = Database['public']['Tables']['character_skill_progress']['Update'];

// =============================================================================
// JOB SYSTEM TYPES
// =============================================================================

export type CharacterUpdate = Database['public']['Tables']['characters']['Update'];
// Character with full progress data
export type CharacterWithProgress = {
  character: Character;
  jobs: {
    job: Job;
    progress: CharacterJobProgress;
  }[];
  skills: {
    progress: CharacterSkillProgress;
    skill: Skill;
  }[];
};
/**
 * Data required when creating a new character
 * Some fields like id, timestamps are auto-generated
 */
export type CreateCharacterData = Database['public']['Tables']['characters']['Insert'];

/**
 * Data required when creating new progress entries
 * Some fields like id, timestamps are auto-generated
 */
export type CreateProgressData = Database['public']['Tables']['character_progress']['Insert'];
export type DatabaseFunctions = Database['public']['Functions'];
export type FFXIExpansion =
  | "Rhapsodies of Vana'diel"
  | 'Chains of Promathia'
  | 'Rise of the Zilart'
  | 'Seekers of Adoulin'
  | 'Treasures of Aht Urhgan'
  | 'Wings of the Goddess';

export type GetCharacterBySlugArgs = DatabaseFunctions['get_character_by_slug']['Args'];

// =============================================================================
// SKILL SYSTEM TYPES
// =============================================================================

export type GetCharacterProgressSummaryArgs = DatabaseFunctions['get_character_progress_summary']['Args'];
export type Job = Database['public']['Tables']['jobs']['Row'];
// For handling filters
export type JobFilter = {
  expansion?: FFXIExpansion | null;
  isAdvanced?: boolean;
  isUnlocked?: boolean;
  jobType?: JobType;
};

export type JobInsert = Database['public']['Tables']['jobs']['Insert'];
// Job progress update form
export type JobProgressFormData = {
  jobId: string;
  jobPoints?: number;
  mainLevel?: number;
  masterLevel?: number;
  subLevel?: number;
};
// Job progress with job details
export type JobProgressWithDetails = CharacterJobProgress & {
  job: Job;
};

// Job type enums
export type JobType = 'combat' | 'craft' | 'support';

// =============================================================================
// PROGRESS TRACKING TYPES
// =============================================================================

export type JobUpdate = Database['public']['Tables']['jobs']['Update'];

// For handling loading states
export type LoadingState<T> = {
  data: null | T;
  error: null | string;
  loading: boolean;
};

/**
 * Paginated response structure
 * Used for lists that need pagination
 */
export type PaginatedResponse<T> = ApiResponse<T[]> & {
  pagination?: {
    hasMore: boolean;
    page: number;
    pageSize: number;
    total: number;
  };
};

// =============================================================================
// EXPANSION TYPES
// =============================================================================

// For handling pagination
export type PaginationState = {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
};

// =============================================================================
// DATABASE FUNCTION TYPES
// =============================================================================

/**
 * Progress categories used throughout the app
 * Helps ensure consistency in progress tracking
 */
export type ProgressCategory =
  | 'blue_magic'
  | 'fame'
  | 'item'
  | 'job'
  | 'mission'
  | 'mount'
  | 'quest'
  | 'skill'
  | 'trust';

/**
 * Common progress metadata structures
 * These match what we store in the JSONB metadata field
 */
export type ProgressMetadata = {
  // Item-specific metadata
  item?: {
    augments?: string[];
    obtained_from?: string;
    quantity?: number;
  };

  // Job-specific metadata
  job?: {
    abilities_learned?: string[];
    experience?: number;
    sub_job?: string;
  };

  // General metadata that applies to any category
  last_updated_by?: string;
  notes?: string;

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
};
// Progress calculation results
export type ProgressSummary = {
  completionPercentage: number;
  masteredJobs: number;
  skilledUpSkills: number;
  totalJobs: number;
  totalSkills: number;
  unlockedJobs: number;
};
export type Skill = Database['public']['Tables']['skills']['Row'];

export type SkillFilter = {
  category?: string;
  hasProgress?: boolean;
  skillType?: SkillType;
};
export type SkillInsert = Database['public']['Tables']['skills']['Insert'];

// =============================================================================
// API RESPONSE TYPES
// =============================================================================

// Skill progress update form
export type SkillProgressFormData = {
  currentLevel: number;
  skillId: string;
};

// Skill progress with skill details
export type SkillProgressWithDetails = CharacterSkillProgress & {
  skill: Skill;
};

// =============================================================================
// FORM TYPES
// =============================================================================

// Skill type enums
export type SkillType = 'combat_support' | 'craft' | 'magic' | 'weapon';

export type SkillUpdate = Database['public']['Tables']['skills']['Update'];

// Character privacy function types
export type ToggleCharacterPrivacyArgs = DatabaseFunctions['toggle_character_privacy']['Args'];

// =============================================================================
// UTILITY TYPES
// =============================================================================

/**
 * Data that can be updated on an existing character
 * All fields are optional since you can update just one field
 */
export type UpdateCharacterData = Database['public']['Tables']['characters']['Update'];

// Progress update function types
export type UpdateJobProgressArgs = DatabaseFunctions['update_job_progress']['Args'];

/**
 * Data that can be updated on existing progress entries
 * All fields are optional since you can update just one field
 */
export type UpdateProgressData = Database['public']['Tables']['character_progress']['Update'];

export type UpdateSkillProgressArgs = DatabaseFunctions['update_skill_progress']['Args'];
