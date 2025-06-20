-- Migration: Seed Jobs and Skills Reference Data
-- Date: 2025-06-19
-- Purpose: Populate jobs and skills tables with FFXI reference data

-- =============================================================================
-- JOBS SEED DATA
-- =============================================================================

-- Base Game Combat Jobs
INSERT INTO jobs (name, short_name, job_type, required_expansion, is_advanced_job, sort_order) VALUES
-- Melee Jobs
('Warrior', 'WAR', 'combat', NULL, false, 1),
('Monk', 'MNK', 'combat', NULL, false, 2),
('Thief', 'THF', 'combat', NULL, false, 3),

-- Tank Jobs  
('Paladin', 'PLD', 'combat', NULL, false, 4),

-- Mage Jobs
('White Mage', 'WHM', 'support', NULL, false, 5),
('Black Mage', 'BLM', 'support', NULL, false, 6),
('Red Mage', 'RDM', 'support', NULL, false, 7),

-- Ranged Jobs
('Ranger', 'RNG', 'combat', NULL, false, 8),
('Beastmaster', 'BST', 'combat', NULL, false, 9);

-- Rise of the Zilart Jobs
INSERT INTO jobs (name, short_name, job_type, required_expansion, is_advanced_job, sort_order) VALUES
('Bard', 'BRD', 'support', 'Rise of the Zilart', true, 10),
('Summoner', 'SMN', 'support', 'Rise of the Zilart', true, 11);

-- Chains of Promathia Jobs
INSERT INTO jobs (name, short_name, job_type, required_expansion, is_advanced_job, sort_order) VALUES
('Ninja', 'NIN', 'combat', 'Chains of Promathia', true, 12),
('Dragoon', 'DRG', 'combat', 'Chains of Promathia', true, 13);

-- Treasures of Aht Urhgan Jobs
INSERT INTO jobs (name, short_name, job_type, required_expansion, is_advanced_job, sort_order) VALUES
('Blue Mage', 'BLU', 'support', 'Treasures of Aht Urhgan', true, 14),
('Corsair', 'COR', 'combat', 'Treasures of Aht Urhgan', true, 15),
('Puppetmaster', 'PUP', 'combat', 'Treasures of Aht Urhgan', true, 16);

-- Wings of the Goddess Jobs
INSERT INTO jobs (name, short_name, job_type, required_expansion, is_advanced_job, sort_order) VALUES
('Dancer', 'DNC', 'combat', 'Wings of the Goddess', true, 17),
('Scholar', 'SCH', 'support', 'Wings of the Goddess', true, 18);

-- Seekers of Adoulin Jobs
INSERT INTO jobs (name, short_name, job_type, required_expansion, is_advanced_job, sort_order) VALUES
('Geomancer', 'GEO', 'support', 'Seekers of Adoulin', true, 19),
('Rune Fencer', 'RUN', 'combat', 'Seekers of Adoulin', true, 20);

-- Rhapsodies of Vana'diel Jobs
INSERT INTO jobs (name, short_name, job_type, required_expansion, is_advanced_job, sort_order) VALUES
('Mystic Knight', 'MYK', 'combat', 'Rhapsodies of Vana\'diel', true, 21);

-- Craft Jobs
INSERT INTO jobs (name, short_name, job_type, required_expansion, is_advanced_job, sort_order) VALUES
('Alchemy', 'ALC', 'craft', NULL, false, 101),
('Bonecraft', 'BON', 'craft', NULL, false, 102),
('Clothcraft', 'CLO', 'craft', NULL, false, 103),
('Cooking', 'COO', 'craft', NULL, false, 104),
('Fishing', 'FIS', 'craft', NULL, false, 105),
('Goldsmithing', 'GOL', 'craft', NULL, false, 106),
('Leathercraft', 'LEA', 'craft', NULL, false, 107),
('Smithing', 'SMI', 'craft', NULL, false, 108),
('Woodworking', 'WOO', 'craft', NULL, false, 109),
('Synergy', 'SYN', 'craft', 'Wings of the Goddess', false, 110);

-- =============================================================================
-- WEAPON SKILLS SEED DATA
-- =============================================================================

INSERT INTO skills (name, skill_type, category, max_base_level, sort_order) VALUES
-- Melee Weapons
('Hand-to-Hand', 'weapon', 'Melee', 500, 1),
('Dagger', 'weapon', 'Melee', 500, 2),
('Sword', 'weapon', 'Melee', 500, 3),
('Great Sword', 'weapon', 'Melee', 500, 4),
('Axe', 'weapon', 'Melee', 500, 5),
('Great Axe', 'weapon', 'Melee', 500, 6),
('Scythe', 'weapon', 'Melee', 500, 7),
('Polearm', 'weapon', 'Melee', 500, 8),
('Katana', 'weapon', 'Melee', 500, 9),
('Great Katana', 'weapon', 'Melee', 500, 10),
('Club', 'weapon', 'Melee', 500, 11),
('Staff', 'weapon', 'Melee', 500, 12),

-- Ranged Weapons
('Archery', 'weapon', 'Ranged', 500, 13),
('Marksmanship', 'weapon', 'Ranged', 500, 14),
('Throwing', 'weapon', 'Ranged', 500, 15);

-- =============================================================================
-- COMBAT SUPPORT SKILLS SEED DATA
-- =============================================================================

INSERT INTO skills (name, skill_type, category, max_base_level, sort_order) VALUES
-- Defense Skills
('Shield', 'combat_support', 'Defense', 500, 20),
('Evasion', 'combat_support', 'Defense', 500, 21),
('Guard', 'combat_support', 'Defense', 500, 22),
('Parrying', 'combat_support', 'Defense', 500, 23);

-- =============================================================================
-- MAGIC SKILLS SEED DATA
-- =============================================================================

INSERT INTO skills (name, skill_type, category, max_base_level, sort_order) VALUES
-- Offensive Magic
('Elemental Magic', 'magic', 'Offensive', 500, 30),
('Dark Magic', 'magic', 'Offensive', 500, 31),
('Ninjutsu', 'magic', 'Offensive', 500, 32),

-- Support Magic
('Divine Magic', 'magic', 'Support', 500, 33),
('Healing Magic', 'magic', 'Support', 500, 34),
('Enhancing Magic', 'magic', 'Support', 500, 35),
('Enfeebling Magic', 'magic', 'Support', 500, 36),
('Summoning Magic', 'magic', 'Support', 500, 37),
('Blue Magic', 'magic', 'Support', 500, 38),
('Geomancy', 'magic', 'Support', 500, 39),

-- Instrument Skills
('Singing', 'magic', 'Instrument', 500, 40),
('String', 'magic', 'Instrument', 500, 41),
('Wind', 'magic', 'Instrument', 500, 42);

-- =============================================================================
-- CRAFT SKILLS SEED DATA
-- =============================================================================

INSERT INTO skills (name, skill_type, category, max_base_level, sort_order) VALUES
-- Primary Crafts
('Alchemy', 'craft', 'Primary', 110, 50),
('Bonecraft', 'craft', 'Primary', 110, 51),
('Clothcraft', 'craft', 'Primary', 110, 52),
('Cooking', 'craft', 'Primary', 110, 53),
('Fishing', 'craft', 'Primary', 110, 54),
('Goldsmithing', 'craft', 'Primary', 110, 55),
('Leathercraft', 'craft', 'Primary', 110, 56),
('Smithing', 'craft', 'Primary', 110, 57),
('Woodworking', 'craft', 'Primary', 110, 58),

-- Special Craft Systems
('Synergy', 'craft', 'Special', 80, 59),
('Chocobo Digging', 'craft', 'Special', 500, 60),
('Harvesting', 'craft', 'Special', 500, 61),
('Excavation', 'craft', 'Special', 500, 62),
('Logging', 'craft', 'Special', 500, 63),
('Mining', 'craft', 'Special', 500, 64);

-- =============================================================================
-- VERIFICATION QUERIES
-- =============================================================================

-- Verify job counts
DO $$
DECLARE
    job_count INTEGER;
    skill_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO job_count FROM jobs;
    SELECT COUNT(*) INTO skill_count FROM skills;
    
    RAISE NOTICE 'Seeded % jobs and % skills', job_count, skill_count;
    
    -- Log counts by category
    RAISE NOTICE 'Job breakdown:';
    FOR rec IN 
        SELECT job_type, COUNT(*) as count 
        FROM jobs 
        GROUP BY job_type 
        ORDER BY job_type
    LOOP
        RAISE NOTICE '  %: %', rec.job_type, rec.count;
    END LOOP;
    
    RAISE NOTICE 'Skill breakdown:';
    FOR rec IN 
        SELECT skill_type, COUNT(*) as count 
        FROM skills 
        GROUP BY skill_type 
        ORDER BY skill_type
    LOOP
        RAISE NOTICE '  %: %', rec.skill_type, rec.count;
    END LOOP;
END
$$; 