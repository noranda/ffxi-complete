-- Migration: Add Jobs/Crafts/Skills System and Character Privacy Controls
-- Date: 2025-06-19
-- Purpose: Implement core progression tracking and privacy features

-- =============================================================================
-- CHARACTER PRIVACY CONTROLS
-- =============================================================================

-- Add privacy and public sharing columns to characters table
ALTER TABLE characters
ADD COLUMN is_public BOOLEAN DEFAULT false,
ADD COLUMN public_url_slug VARCHAR(100) UNIQUE,
ADD COLUMN privacy_updated_at TIMESTAMPTZ DEFAULT NOW();

-- Create index for public character lookups
CREATE INDEX idx_characters_public_slug ON characters(public_url_slug) WHERE public_url_slug IS NOT NULL;
CREATE INDEX idx_characters_public_listing ON characters(is_public, created_at) WHERE is_public = true;

-- =============================================================================
-- JOBS SYSTEM
-- =============================================================================

-- Job types and expansion requirements
CREATE TABLE jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(50) NOT NULL UNIQUE,
  short_name VARCHAR(10) NOT NULL UNIQUE, -- WAR, BLM, etc.
  job_type VARCHAR(20) NOT NULL, -- 'combat', 'support', 'craft'
  required_expansion VARCHAR(50), -- NULL for base game jobs
  is_advanced_job BOOLEAN DEFAULT false,
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character job progress tracking
CREATE TABLE character_job_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  main_level INTEGER DEFAULT 1 CHECK (main_level >= 1 AND main_level <= 99),
  sub_level INTEGER DEFAULT 1 CHECK (sub_level >= 1 AND sub_level <= 49),
  job_points INTEGER DEFAULT 0 CHECK (job_points >= 0 AND job_points <= 2100),
  master_level INTEGER DEFAULT 0 CHECK (master_level >= 0 AND master_level <= 50),
  is_unlocked BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(character_id, job_id)
);

-- =============================================================================
-- SKILLS SYSTEM
-- =============================================================================

-- Skill definitions
CREATE TABLE skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  skill_type VARCHAR(20) NOT NULL, -- 'weapon', 'combat_support', 'magic', 'craft'
  category VARCHAR(50), -- For grouping (e.g., 'Sword', 'Elemental Magic', 'Alchemy')
  max_base_level INTEGER DEFAULT 110, -- Base maximum before ML bonuses
  sort_order INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Character skill progress tracking
CREATE TABLE character_skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  character_id UUID NOT NULL REFERENCES characters(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES skills(id) ON DELETE CASCADE,
  current_level INTEGER DEFAULT 0 CHECK (current_level >= 0),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(character_id, skill_id)
);

-- =============================================================================
-- INDEXES FOR PERFORMANCE
-- =============================================================================

-- Character progress lookups
CREATE INDEX idx_character_job_progress_character ON character_job_progress(character_id);
CREATE INDEX idx_character_job_progress_job ON character_job_progress(job_id);
CREATE INDEX idx_character_skill_progress_character ON character_skill_progress(character_id);
CREATE INDEX idx_character_skill_progress_skill ON character_skill_progress(skill_id);

-- Job and skill lookups
CREATE INDEX idx_jobs_type ON jobs(job_type);
CREATE INDEX idx_jobs_sort ON jobs(sort_order);
CREATE INDEX idx_skills_type ON skills(skill_type);
CREATE INDEX idx_skills_category ON skills(skill_type, category);
CREATE INDEX idx_skills_sort ON skills(sort_order);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================================================

-- Enable RLS on new tables
ALTER TABLE character_job_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_skill_progress ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own character data
CREATE POLICY "users_own_job_progress" ON character_job_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = character_job_progress.character_id
      AND characters.user_id = auth.uid()
    )
  );

CREATE POLICY "users_own_skill_progress" ON character_skill_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = character_skill_progress.character_id
      AND characters.user_id = auth.uid()
    )
  );

-- Public read access for public characters
CREATE POLICY "public_job_progress_read" ON character_job_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = character_job_progress.character_id
      AND characters.is_public = true
    )
  );

CREATE POLICY "public_skill_progress_read" ON character_skill_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM characters
      WHERE characters.id = character_skill_progress.character_id
      AND characters.is_public = true
    )
  );

-- Jobs and skills are reference data - readable by all authenticated users
CREATE POLICY "jobs_read_all" ON jobs FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "skills_read_all" ON skills FOR SELECT USING (auth.role() = 'authenticated');

-- =============================================================================
-- DATABASE FUNCTIONS
-- =============================================================================

-- Function: Toggle character privacy
CREATE OR REPLACE FUNCTION toggle_character_privacy(
  character_uuid UUID,
  new_is_public BOOLEAN
) RETURNS JSON AS $$
DECLARE
  result_character characters%ROWTYPE;
BEGIN
  -- Update character privacy
  UPDATE characters
  SET
    is_public = new_is_public,
    privacy_updated_at = NOW(),
    public_url_slug = CASE
      WHEN new_is_public = true AND public_url_slug IS NULL
      THEN LOWER(REGEXP_REPLACE(name || '-' || server, '[^a-zA-Z0-9]', '-', 'g'))
      WHEN new_is_public = false
      THEN NULL
      ELSE public_url_slug
    END
  WHERE id = character_uuid
    AND user_id = auth.uid()
  RETURNING * INTO result_character;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Character not found or access denied';
  END IF;

  RETURN row_to_json(result_character);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get character with public access check
CREATE OR REPLACE FUNCTION get_character_by_slug(slug VARCHAR(100))
RETURNS JSON AS $$
DECLARE
  result_character characters%ROWTYPE;
BEGIN
  SELECT * INTO result_character
  FROM characters
  WHERE public_url_slug = slug AND is_public = true;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Public character not found';
  END IF;

  RETURN row_to_json(result_character);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update job progress
CREATE OR REPLACE FUNCTION update_job_progress(
  character_uuid UUID,
  job_uuid UUID,
  new_main_level INTEGER DEFAULT NULL,
  new_sub_level INTEGER DEFAULT NULL,
  new_job_points INTEGER DEFAULT NULL,
  new_master_level INTEGER DEFAULT NULL
) RETURNS JSON AS $$
DECLARE
  result_progress character_job_progress%ROWTYPE;
BEGIN
  -- Verify character ownership
  IF NOT EXISTS (
    SELECT 1 FROM characters
    WHERE id = character_uuid AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Character not found or access denied';
  END IF;

  -- Upsert job progress
  INSERT INTO character_job_progress (
    character_id, job_id, main_level, sub_level, job_points, master_level, is_unlocked
  ) VALUES (
    character_uuid,
    job_uuid,
    COALESCE(new_main_level, 1),
    COALESCE(new_sub_level, 1),
    COALESCE(new_job_points, 0),
    COALESCE(new_master_level, 0),
    true
  )
  ON CONFLICT (character_id, job_id)
  DO UPDATE SET
    main_level = COALESCE(new_main_level, character_job_progress.main_level),
    sub_level = COALESCE(new_sub_level, character_job_progress.sub_level),
    job_points = COALESCE(new_job_points, character_job_progress.job_points),
    master_level = COALESCE(new_master_level, character_job_progress.master_level),
    is_unlocked = true,
    updated_at = NOW()
  RETURNING * INTO result_progress;

  RETURN row_to_json(result_progress);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Update skill progress
CREATE OR REPLACE FUNCTION update_skill_progress(
  character_uuid UUID,
  skill_uuid UUID,
  new_level INTEGER
) RETURNS JSON AS $$
DECLARE
  result_progress character_skill_progress%ROWTYPE;
BEGIN
  -- Verify character ownership
  IF NOT EXISTS (
    SELECT 1 FROM characters
    WHERE id = character_uuid AND user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Character not found or access denied';
  END IF;

  -- Upsert skill progress
  INSERT INTO character_skill_progress (character_id, skill_id, current_level)
  VALUES (character_uuid, skill_uuid, new_level)
  ON CONFLICT (character_id, skill_id)
  DO UPDATE SET
    current_level = new_level,
    updated_at = NOW()
  RETURNING * INTO result_progress;

  RETURN row_to_json(result_progress);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function: Get character progress summary
CREATE OR REPLACE FUNCTION get_character_progress_summary(character_uuid UUID)
RETURNS JSON AS $$
DECLARE
  character_data JSON;
  job_progress JSON;
  skill_progress JSON;
  result JSON;
BEGIN
  -- Verify access (owner or public character)
  SELECT row_to_json(c.*) INTO character_data
  FROM characters c
  WHERE c.id = character_uuid
    AND (c.user_id = auth.uid() OR c.is_public = true);

  IF character_data IS NULL THEN
    RAISE EXCEPTION 'Character not found or access denied';
  END IF;

  -- Get job progress
  SELECT json_agg(
    json_build_object(
      'job', row_to_json(j.*),
      'progress', row_to_json(cjp.*)
    )
  ) INTO job_progress
  FROM character_job_progress cjp
  JOIN jobs j ON j.id = cjp.job_id
  WHERE cjp.character_id = character_uuid;

  -- Get skill progress
  SELECT json_agg(
    json_build_object(
      'skill', row_to_json(s.*),
      'progress', row_to_json(csp.*)
    )
  ) INTO skill_progress
  FROM character_skill_progress csp
  JOIN skills s ON s.id = csp.skill_id
  WHERE csp.character_id = character_uuid;

  -- Build result
  SELECT json_build_object(
    'character', character_data,
    'jobs', COALESCE(job_progress, '[]'::json),
    'skills', COALESCE(skill_progress, '[]'::json)
  ) INTO result;

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =============================================================================
-- TRIGGER FUNCTIONS
-- =============================================================================

-- Update character privacy timestamp when character data changes
CREATE OR REPLACE FUNCTION update_character_privacy_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.privacy_updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for character privacy updates
CREATE TRIGGER character_privacy_update
  BEFORE UPDATE OF is_public, public_url_slug ON characters
  FOR EACH ROW
  EXECUTE FUNCTION update_character_privacy_timestamp();

-- =============================================================================
-- COMMENTS FOR DOCUMENTATION
-- =============================================================================

COMMENT ON TABLE jobs IS 'FFXI job definitions with expansion requirements';
COMMENT ON TABLE character_job_progress IS 'Character-specific job level and progress tracking';
COMMENT ON TABLE skills IS 'FFXI skill definitions (weapon, magic, craft skills)';
COMMENT ON TABLE character_skill_progress IS 'Character-specific skill level tracking';

COMMENT ON COLUMN characters.is_public IS 'Whether character profile is publicly viewable';
COMMENT ON COLUMN characters.public_url_slug IS 'URL-friendly slug for public character access';
COMMENT ON COLUMN characters.privacy_updated_at IS 'When privacy settings were last changed';

COMMENT ON FUNCTION toggle_character_privacy IS 'Toggle character public/private status with automatic slug generation';
COMMENT ON FUNCTION get_character_by_slug IS 'Get public character data by URL slug';
COMMENT ON FUNCTION update_job_progress IS 'Update character job levels and progress';
COMMENT ON FUNCTION update_skill_progress IS 'Update character skill levels';
COMMENT ON FUNCTION get_character_progress_summary IS 'Get complete character progress data';
