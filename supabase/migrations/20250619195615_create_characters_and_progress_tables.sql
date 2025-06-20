-- FFXI Progress Tracker - Core Database Schema
-- Migration: Create characters and progress tracking tables
-- Learning Focus: User-owned data patterns, flexible progress tracking, RLS setup

-- ============================================================================
-- CHARACTERS TABLE
-- ============================================================================
-- Stores FFXI characters belonging to authenticated users
-- Each user can have multiple characters across different servers

CREATE TABLE characters (
  -- Primary key using UUID for better performance and security
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to Supabase auth.users - establishes ownership
  -- CASCADE DELETE ensures character data is cleaned up when user is deleted
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Character details
  name TEXT NOT NULL CHECK (length(name) >= 1 AND length(name) <= 15),
  server TEXT NOT NULL CHECK (length(server) >= 1),
  
  -- Privacy setting - allows characters to be public or private
  is_public BOOLEAN NOT NULL DEFAULT false,
  
  -- Standard audit fields with timezone awareness
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure one character name per user per server (realistic constraint)
  UNIQUE(user_id, name, server)
);

-- Add helpful comment to the table
COMMENT ON TABLE characters IS 'FFXI characters owned by users. Each character belongs to one user and can be public or private.';

-- Add comments to key columns for future reference
COMMENT ON COLUMN characters.user_id IS 'References auth.users.id - establishes character ownership';
COMMENT ON COLUMN characters.is_public IS 'Controls whether character progress can be viewed publicly';
COMMENT ON COLUMN characters.name IS 'FFXI character name (1-15 characters as per game limits)';

-- ============================================================================
-- CHARACTER_PROGRESS TABLE  
-- ============================================================================
-- Flexible progress tracking for any type of progression (jobs, skills, trusts, etc.)
-- Uses a key-value approach with structured metadata for extensibility

CREATE TABLE character_progress (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Foreign key to characters - establishes which character this progress belongs to
  -- CASCADE DELETE ensures progress is cleaned up when character is deleted
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  
  -- Progress categorization (jobs, skills, trusts, mounts, etc.)
  category TEXT NOT NULL CHECK (length(category) >= 1),
  
  -- Specific item within category (e.g., 'WAR', 'Sword Skill', 'Shantotto')
  item_name TEXT NOT NULL CHECK (length(item_name) >= 1),
  
  -- Current progress value (level, completion status, etc.)
  progress_value INTEGER NOT NULL DEFAULT 0 CHECK (progress_value >= 0),
  
  -- Optional maximum value for this type of progress
  max_value INTEGER CHECK (max_value IS NULL OR max_value > 0),
  
  -- Flexible JSON metadata for category-specific data
  -- Examples: 
  --   Jobs: {"experience": 12500, "sub_job": "WAR"}
  --   Trusts: {"acquired_date": "2024-01-15", "source": "quest"}
  --   Skills: {"cap": 230, "food_bonus": 5}
  metadata JSONB DEFAULT '{}',
  
  -- Audit field - when was this progress last updated
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Ensure one progress entry per character per category per item
  -- This prevents duplicate entries like multiple "WAR" job entries for same character
  UNIQUE(character_id, category, item_name)
);

-- Add helpful comments
COMMENT ON TABLE character_progress IS 'Flexible progress tracking for all types of FFXI progression (jobs, skills, collections)';
COMMENT ON COLUMN character_progress.category IS 'Type of progress: jobs, skills, trusts, mounts, etc.';
COMMENT ON COLUMN character_progress.item_name IS 'Specific item within category (WAR, Sword, Shantotto, etc.)';
COMMENT ON COLUMN character_progress.progress_value IS 'Current progress (level, completion %, etc.)';
COMMENT ON COLUMN character_progress.metadata IS 'Flexible JSON data for category-specific information';

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================
-- Create indexes on columns that will be frequently queried

-- Index for finding characters by user (most common query)
CREATE INDEX idx_characters_user_id ON characters(user_id);

-- Index for finding public characters (for public discovery)
CREATE INDEX idx_characters_public ON characters(is_public) WHERE is_public = true;

-- Index for finding progress by character (most common progress query)
CREATE INDEX idx_character_progress_character_id ON character_progress(character_id);

-- Index for finding progress by category (e.g., "show me all job progress")
CREATE INDEX idx_character_progress_category ON character_progress(category);

-- Composite index for efficient category + character queries
CREATE INDEX idx_character_progress_char_category ON character_progress(character_id, category);

-- ============================================================================
-- UPDATED_AT TRIGGERS
-- ============================================================================
-- Automatically update the updated_at timestamp when records are modified

-- Create a reusable function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply the trigger to both tables
CREATE TRIGGER update_characters_updated_at 
  BEFORE UPDATE ON characters 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_character_progress_updated_at 
  BEFORE UPDATE ON character_progress 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS to ensure users can only access their own data
-- This is crucial for multi-tenant applications

-- Enable RLS on both tables
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_progress ENABLE ROW LEVEL SECURITY;

-- CHARACTERS TABLE POLICIES

-- Policy: Users can view their own characters + any public characters
CREATE POLICY "users_can_view_own_and_public_characters" ON characters
  FOR SELECT USING (
    auth.uid() = user_id OR is_public = true
  );

-- Policy: Users can only insert characters for themselves
CREATE POLICY "users_can_insert_own_characters" ON characters
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own characters
CREATE POLICY "users_can_update_own_characters" ON characters
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can only delete their own characters
CREATE POLICY "users_can_delete_own_characters" ON characters
  FOR DELETE USING (auth.uid() = user_id);

-- CHARACTER_PROGRESS TABLE POLICIES

-- Policy: Users can view progress for characters they own + progress for public characters
CREATE POLICY "users_can_view_progress_for_owned_and_public_characters" ON character_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_progress.character_id 
      AND (characters.user_id = auth.uid() OR characters.is_public = true)
    )
  );

-- Policy: Users can only insert progress for their own characters
CREATE POLICY "users_can_insert_progress_for_own_characters" ON character_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_progress.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- Policy: Users can only update progress for their own characters
CREATE POLICY "users_can_update_progress_for_own_characters" ON character_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_progress.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- Policy: Users can only delete progress for their own characters
CREATE POLICY "users_can_delete_progress_for_own_characters" ON character_progress
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM characters 
      WHERE characters.id = character_progress.character_id 
      AND characters.user_id = auth.uid()
    )
  );

-- ============================================================================
-- LEARNING SUMMARY
-- ============================================================================
/*
Key Database Concepts Demonstrated:

1. **Foreign Key Relationships**: 
   - auth.users -> characters (one-to-many)
   - characters -> character_progress (one-to-many)

2. **Data Integrity Constraints**:
   - CHECK constraints for data validation
   - UNIQUE constraints to prevent duplicates
   - NOT NULL for required fields

3. **Performance Optimization**:
   - Strategic indexes on frequently queried columns
   - Composite indexes for multi-column queries

4. **Audit Trail**:
   - Timestamp fields with automatic updates
   - Triggers for maintenance tasks

5. **Security (Row Level Security)**:
   - User isolation - users only see their own data
   - Public data access - public characters visible to all
   - Cascading security - progress follows character ownership

6. **Flexibility**:
   - JSONB metadata for extensible data
   - Generic progress tracking for any category
   - Boolean flags for feature toggles

This schema supports the core FFXI tracking features while maintaining
data integrity, security, and performance.
*/
