-- Migration: Add dev_icon_tags table for icon library development
-- Purpose: Store tag modifications for development icon library tool
--
-- This table allows developers to add custom tags to icons during development
-- of the icon library, providing better searchability and categorization.
-- Tags are stored per-user but could be made global for team collaboration.

-- Create the dev_icon_tags table
CREATE TABLE dev_icon_tags (
  -- Primary key following project pattern
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User who created the tags (for future team collaboration)
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Icon identification (matching registry.json structure)
  icon_id INTEGER NOT NULL,
  icon_category TEXT NOT NULL CHECK (icon_category IN ('magic', 'status', 'abilities')),

  -- Tag data as array for flexibility
  tags TEXT[] NOT NULL DEFAULT '{}',

  -- Original tags from registry for comparison
  original_tags TEXT[] DEFAULT '{}',

  -- Metadata for additional context
  metadata JSONB DEFAULT '{}',

  -- Audit fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Unique constraint to prevent duplicates per user/icon
  UNIQUE(user_id, icon_id, icon_category)
);

-- Add helpful comments for documentation
COMMENT ON TABLE dev_icon_tags IS 'Development tool for storing custom icon tags during icon library development';
COMMENT ON COLUMN dev_icon_tags.user_id IS 'User who created these custom tags';
COMMENT ON COLUMN dev_icon_tags.icon_id IS 'Icon ID from the registry.json file';
COMMENT ON COLUMN dev_icon_tags.icon_category IS 'Icon category (magic, status, abilities)';
COMMENT ON COLUMN dev_icon_tags.tags IS 'Array of custom tags for better searchability';
COMMENT ON COLUMN dev_icon_tags.original_tags IS 'Original tags from registry for comparison';
COMMENT ON COLUMN dev_icon_tags.metadata IS 'Additional context like notes or source of tags';

-- Create indexes for efficient querying
CREATE INDEX idx_dev_icon_tags_user_id ON dev_icon_tags(user_id);
CREATE INDEX idx_dev_icon_tags_icon_category ON dev_icon_tags(icon_category);
CREATE INDEX idx_dev_icon_tags_icon_id ON dev_icon_tags(icon_id);

-- Index for searching tags using GIN for array operations
CREATE INDEX idx_dev_icon_tags_tags_gin ON dev_icon_tags USING GIN(tags);

-- Trigger for automatic updated_at timestamps
CREATE TRIGGER update_dev_icon_tags_updated_at
  BEFORE UPDATE ON dev_icon_tags
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE dev_icon_tags ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can manage their own icon tags
CREATE POLICY "users_can_manage_own_icon_tags" ON dev_icon_tags
  FOR ALL USING (auth.uid() = user_id);

-- Optional: Policy for development team to see all tags (uncomment if needed)
-- CREATE POLICY "authenticated_users_can_view_all_icon_tags" ON dev_icon_tags
--   FOR SELECT USING (auth.role() = 'authenticated');
