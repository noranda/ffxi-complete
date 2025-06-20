/**
 * Unit tests for FFXI game constants
 *
 * Tests the integrity and consistency of game data including
 * races, genders, servers, and other constants.
 */

import {describe, expect, it} from 'vitest';

import {
  FACE_OPTIONS,
  FFXI_GENDERS,
  FFXI_RACES,
  FFXI_WORLDS,
  HAIR_STYLES,
  PORTRAIT_CONFIG,
  PROGRESS_CATEGORIES,
  RACE_GENDER_COMBINATIONS,
} from '../constants';

describe('FFXI Game Constants', () => {
  describe('Races and Genders', () => {
    it('should have all 5 FFXI races defined', () => {
      expect(Object.keys(FFXI_RACES)).toHaveLength(5);
      expect(FFXI_RACES.HUME).toBe('hume');
      expect(FFXI_RACES.ELVAAN).toBe('elvaan');
      expect(FFXI_RACES.TARUTARU).toBe('tarutaru');
      expect(FFXI_RACES.MITHRA).toBe('mithra');
      expect(FFXI_RACES.GALKA).toBe('galka');
    });

    it('should have male and female genders defined', () => {
      expect(Object.keys(FFXI_GENDERS)).toHaveLength(2);
      expect(FFXI_GENDERS.MALE).toBe('male');
      expect(FFXI_GENDERS.FEMALE).toBe('female');
    });

    it('should have 8 valid race/gender combinations', () => {
      expect(RACE_GENDER_COMBINATIONS).toHaveLength(8);
    });

    it('should include gender-locked races correctly', () => {
      // Mithra should only be female
      const mithraEntries = RACE_GENDER_COMBINATIONS.filter(
        combo => combo.race === 'mithra'
      );
      expect(mithraEntries).toHaveLength(1);
      expect(mithraEntries[0].gender).toBe('female');

      // Galka should only be male
      const galkaEntries = RACE_GENDER_COMBINATIONS.filter(
        combo => combo.race === 'galka'
      );
      expect(galkaEntries).toHaveLength(1);
      expect(galkaEntries[0].gender).toBe('male');
    });

    it('should include both genders for non-locked races', () => {
      const nonLockedRaces = ['hume', 'elvaan', 'tarutaru'];

      for (const race of nonLockedRaces) {
        const raceEntries = RACE_GENDER_COMBINATIONS.filter(
          combo => combo.race === race
        );
        expect(raceEntries).toHaveLength(2);

        const genders = raceEntries.map(entry => entry.gender);
        expect(genders).toContain('male');
        expect(genders).toContain('female');
      }
    });
  });

  describe('Character Customization', () => {
    it('should have 8 face options', () => {
      expect(FACE_OPTIONS).toHaveLength(8);
      expect(FACE_OPTIONS).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
    });

    it('should have 2 hair style options', () => {
      expect(HAIR_STYLES).toHaveLength(2);
      expect(HAIR_STYLES).toContain('A');
      expect(HAIR_STYLES).toContain('B');
    });
  });

  describe('FFXI Worlds', () => {
    it('should have 16 active worlds', () => {
      expect(FFXI_WORLDS).toHaveLength(16);
    });

    it('should include major worlds', () => {
      expect(FFXI_WORLDS).toContain('Asura');
      expect(FFXI_WORLDS).toContain('Bahamut');
      expect(FFXI_WORLDS).toContain('Odin');
      expect(FFXI_WORLDS).toContain('Phoenix');
      expect(FFXI_WORLDS).toContain('Quetzalcoatl');
      expect(FFXI_WORLDS).toContain('Lakshmi');
    });

    it('should have worlds in alphabetical order', () => {
      const sorted = [...FFXI_WORLDS].sort();
      expect(FFXI_WORLDS).toEqual(sorted);
    });

    it('should not include test server', () => {
      expect(FFXI_WORLDS).not.toContain('Atomos');
    });
  });

  describe('Portrait Configuration', () => {
    it('should specify WebP format', () => {
      expect(PORTRAIT_CONFIG.FORMAT).toBe('webp');
    });

    it('should have consistent filename pattern', () => {
      expect(PORTRAIT_CONFIG.FILENAME_PATTERN).toBe(
        'portrait-{race}-{gender}-face{face}-hair{hair}.webp'
      );
    });

    it('should specify portrait dimensions', () => {
      expect(PORTRAIT_CONFIG.DIMENSIONS.WIDTH).toBe(200);
      expect(PORTRAIT_CONFIG.DIMENSIONS.HEIGHT).toBe(149);
    });
  });

  describe('Progress Categories', () => {
    it('should include all major tracking categories', () => {
      expect(PROGRESS_CATEGORIES.JOBS).toBe('jobs');
      expect(PROGRESS_CATEGORIES.SKILLS).toBe('skills');
      expect(PROGRESS_CATEGORIES.TRUSTS).toBe('trusts');
      expect(PROGRESS_CATEGORIES.MOUNTS).toBe('mounts');
      expect(PROGRESS_CATEGORIES.SPELLS).toBe('spells');
      expect(PROGRESS_CATEGORIES.QUESTS).toBe('quests');
      expect(PROGRESS_CATEGORIES.MISSIONS).toBe('missions');
      expect(PROGRESS_CATEGORIES.ITEMS).toBe('items');
      expect(PROGRESS_CATEGORIES.FAME).toBe('fame');
    });

    it('should have at least 9 progress categories', () => {
      expect(Object.keys(PROGRESS_CATEGORIES).length).toBeGreaterThanOrEqual(9);
    });
  });
});
