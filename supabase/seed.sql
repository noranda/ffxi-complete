-- FFXI Progress Tracker - Database Seeding
-- Populates reference data for character creation and game progression

-- =============================================================================
-- FFXI WORLDS REFERENCE DATA
-- =============================================================================

-- Create a simple reference table for FFXI worlds
-- This helps with data validation and provides a consistent world list
CREATE TABLE IF NOT EXISTS ffxi_worlds (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Insert active FFXI worlds as of 2025
-- Source: http://www.playonline.com/pcd/service/ff11usindex.html
INSERT INTO ffxi_worlds (name) VALUES
  ('Asura'),
  ('Bahamut'),
  ('Bismarck'),
  ('Carbuncle'),
  ('Cerberus'),
  ('Fenrir'),
  ('Lakshmi'),
  ('Leviathan'),
  ('Odin'),
  ('Phoenix'),
  ('Quetzalcoatl'),
  ('Ragnarok'),
  ('Shiva'),
  ('Siren'),
  ('Sylph'),
  ('Valefor')
ON CONFLICT (name) DO NOTHING;

-- =============================================================================
-- CHARACTER PORTRAITS REFERENCE DATA
-- =============================================================================

-- Create a table to store available character portrait options
-- This provides a reference for character creation and portrait picker components
CREATE TABLE IF NOT EXISTS character_portraits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  race TEXT NOT NULL CHECK (race IN ('hume', 'elvaan', 'tarutaru', 'mithra', 'galka')),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  face INTEGER NOT NULL CHECK (face >= 1 AND face <= 8),
  hair TEXT NOT NULL CHECK (hair IN ('A', 'B')),
  filename TEXT NOT NULL,
  file_path TEXT NOT NULL,
  source_url TEXT, -- Original Google Sheets URL for reference
  created_at TIMESTAMPTZ DEFAULT now(),

  -- Ensure unique combinations and validate race/gender constraints
  UNIQUE(race, gender, face, hair),

  -- Constraint: Mithra is female only, Galka is male only
  CONSTRAINT valid_race_gender_combo CHECK (
    (race = 'mithra' AND gender = 'female') OR
    (race = 'galka' AND gender = 'male') OR
    (race IN ('hume', 'elvaan', 'tarutaru'))
  )
);

-- Add helpful comments
COMMENT ON TABLE character_portraits IS 'Available character portrait options for character creation';
COMMENT ON COLUMN character_portraits.race IS 'FFXI character race (hume, elvaan, tarutaru, mithra, galka)';
COMMENT ON COLUMN character_portraits.gender IS 'Character gender (male/female) - some races are gender-locked';
COMMENT ON COLUMN character_portraits.face IS 'Face option number (1-8)';
COMMENT ON COLUMN character_portraits.hair IS 'Hair style option (A or B)';
COMMENT ON COLUMN character_portraits.filename IS 'Portrait image filename in assets directory';
COMMENT ON COLUMN character_portraits.file_path IS 'Full path to portrait image for web serving';

-- Create index for efficient portrait lookups during character creation
CREATE INDEX IF NOT EXISTS idx_portraits_race_gender ON character_portraits(race, gender);

-- =============================================================================
-- SAMPLE PORTRAIT DATA
-- =============================================================================

-- Insert sample portrait data
-- In production, this would be populated by the portrait extraction script
INSERT INTO character_portraits (race, gender, face, hair, filename, file_path, source_url) VALUES
  -- Hume Male samples
  ('hume', 'male', 1, 'A', 'portrait-hume-male-face1-hairA.webp', '/portraits/hume/male/portrait-hume-male-face1-hairA.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('hume', 'male', 1, 'B', 'portrait-hume-male-face1-hairB.webp', '/portraits/hume/male/portrait-hume-male-face1-hairB.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('hume', 'male', 2, 'A', 'portrait-hume-male-face2-hairA.webp', '/portraits/hume/male/portrait-hume-male-face2-hairA.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('hume', 'male', 2, 'B', 'portrait-hume-male-face2-hairB.webp', '/portraits/hume/male/portrait-hume-male-face2-hairB.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),

  -- Hume Female samples
  ('hume', 'female', 1, 'A', 'portrait-hume-female-face1-hairA.webp', '/portraits/hume/female/portrait-hume-female-face1-hairA.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('hume', 'female', 1, 'B', 'portrait-hume-female-face1-hairB.webp', '/portraits/hume/female/portrait-hume-female-face1-hairB.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),

  -- Elvaan Male samples
  ('elvaan', 'male', 1, 'A', 'portrait-elvaan-male-face1-hairA.webp', '/portraits/elvaan/male/portrait-elvaan-male-face1-hairA.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('elvaan', 'male', 1, 'B', 'portrait-elvaan-male-face1-hairB.webp', '/portraits/elvaan/male/portrait-elvaan-male-face1-hairB.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),

  -- Elvaan Female samples
  ('elvaan', 'female', 1, 'A', 'portrait-elvaan-female-face1-hairA.webp', '/portraits/elvaan/female/portrait-elvaan-female-face1-hairA.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('elvaan', 'female', 1, 'B', 'portrait-elvaan-female-face1-hairB.webp', '/portraits/elvaan/female/portrait-elvaan-female-face1-hairB.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),

  -- Tarutaru Male samples
  ('tarutaru', 'male', 1, 'A', 'portrait-tarutaru-male-face1-hairA.webp', '/portraits/tarutaru/male/portrait-tarutaru-male-face1-hairA.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('tarutaru', 'male', 1, 'B', 'portrait-tarutaru-male-face1-hairB.webp', '/portraits/tarutaru/male/portrait-tarutaru-male-face1-hairB.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),

  -- Tarutaru Female samples
  ('tarutaru', 'female', 1, 'A', 'portrait-tarutaru-female-face1-hairA.webp', '/portraits/tarutaru/female/portrait-tarutaru-female-face1-hairA.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('tarutaru', 'female', 1, 'B', 'portrait-tarutaru-female-face1-hairB.webp', '/portraits/tarutaru/female/portrait-tarutaru-female-face1-hairB.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),

  -- Mithra (female only) samples
  ('mithra', 'female', 1, 'A', 'portrait-mithra-female-face1-hairA.webp', '/portraits/mithra/female/portrait-mithra-female-face1-hairA.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('mithra', 'female', 1, 'B', 'portrait-mithra-female-face1-hairB.webp', '/portraits/mithra/female/portrait-mithra-female-face1-hairB.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),

  -- Galka (male only) samples
  ('galka', 'male', 1, 'A', 'portrait-galka-male-face1-hairA.webp', '/portraits/galka/male/portrait-galka-male-face1-hairA.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit'),
  ('galka', 'male', 1, 'B', 'portrait-galka-male-face1-hairB.webp', '/portraits/galka/male/portrait-galka-male-face1-hairB.webp', 'https://docs.google.com/spreadsheets/d/1hlddyUH37WG6s5vUZxkG9JqX_7D6HCzdnTT_pCYAQqE/edit')

ON CONFLICT (race, gender, face, hair) DO NOTHING;

-- =============================================================================
-- ROW LEVEL SECURITY FOR REFERENCE TABLES
-- =============================================================================

-- Enable RLS on reference tables (though they'll be readable by everyone)
ALTER TABLE ffxi_worlds ENABLE ROW LEVEL SECURITY;
ALTER TABLE character_portraits ENABLE ROW LEVEL SECURITY;

-- Allow everyone to read world and portrait reference data
CREATE POLICY "worlds_are_public" ON ffxi_worlds FOR SELECT USING (true);
CREATE POLICY "portraits_are_public" ON character_portraits FOR SELECT USING (true);

-- =============================================================================
-- SEEDING SUMMARY
-- =============================================================================

/*
This seed file creates and populates:

1. **FFXI Worlds Table**: Reference data for all active FFXI worlds
   - Used in character creation dropdowns
   - Source: PlayOnline official world status page

2. **Character Portraits Table**: Reference data for character portrait options
   - Organized by race, gender, face, and hair combinations
   - Validates race/gender constraints (Mithra=female, Galka=male)
   - Links to portrait image files in the assets directory
   - Used by CharacterPortraitPicker component

3. **Row Level Security**: Enables RLS with public read access for reference data

Next Steps:
- Run the portrait extraction script to populate actual image files
- Extend character_portraits table with all face/hair combinations (currently has samples)
- Add additional reference data as needed (jobs, skills, etc.)
*/
