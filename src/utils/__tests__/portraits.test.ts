/**
 * Unit tests for portrait utility functions
 *
 * Tests portrait path generation, filtering, validation,
 * and other portrait-related utility functions.
 */

import {describe, expect, it} from 'vitest';

import {
  generateAllPortraits,
  generatePortraitFilename,
  generatePortraitPath,
  generatePortraitUrl,
  getPortraitsForRaceGender,
  getPortraitStats,
  getValidGendersForRace,
  isValidRaceGenderCombo,
  parsePortraitFilename,
  type PortraitId,
} from '../portraits';

describe('Portrait Utilities', () => {
  // Sample portrait data for testing
  const samplePortrait: PortraitId = {
    face: 1,
    gender: 'male',
    hair: 'A',
    race: 'hume',
  };

  describe('Filename Generation', () => {
    it('should generate correct filename for portrait', () => {
      const filename = generatePortraitFilename(samplePortrait);
      expect(filename).toBe('portrait-hume-male-face1-hairA.webp');
    });

    it('should generate different filenames for different portraits', () => {
      const portrait1 = generatePortraitFilename({
        face: 1,
        gender: 'male',
        hair: 'A',
        race: 'hume',
      });
      const portrait2 = generatePortraitFilename({
        face: 1,
        gender: 'male',
        hair: 'B',
        race: 'hume',
      });
      const portrait3 = generatePortraitFilename({
        face: 5,
        gender: 'female',
        hair: 'B',
        race: 'elvaan',
      });

      expect(portrait1).toBe('portrait-hume-male-face1-hairA.webp');
      expect(portrait2).toBe('portrait-hume-male-face1-hairB.webp');
      expect(portrait3).toBe('portrait-elvaan-female-face5-hairB.webp');
    });
  });

  describe('Path Generation', () => {
    it('should generate correct file path', () => {
      const path = generatePortraitPath(samplePortrait);
      expect(path).toBe('/portraits/hume/male/portrait-hume-male-face1-hairA.webp');
    });

    it('should generate correct URL with default base', () => {
      const url = generatePortraitUrl(samplePortrait);
      expect(url).toBe('/src/assets/portraits/hume/male/portrait-hume-male-face1-hairA.webp');
    });

    it('should generate correct URL with custom base', () => {
      const url = generatePortraitUrl(samplePortrait, 'https://cdn.example.com');
      expect(url).toBe('https://cdn.example.com/portraits/hume/male/portrait-hume-male-face1-hairA.webp');
    });
  });

  describe('Portrait Generation', () => {
    it('should generate all possible portraits', () => {
      const allPortraits = generateAllPortraits();

      // 8 race/gender combinations × 8 faces × 2 hair styles = 128 total
      expect(allPortraits).toHaveLength(128);

      // Each portrait should have required properties
      allPortraits.forEach(portrait => {
        expect(portrait).toHaveProperty('id');
        expect(portrait).toHaveProperty('race');
        expect(portrait).toHaveProperty('gender');
        expect(portrait).toHaveProperty('face');
        expect(portrait).toHaveProperty('hair');
        expect(portrait).toHaveProperty('filename');
        expect(portrait).toHaveProperty('path');
        expect(portrait).toHaveProperty('url');
      });
    });

    it('should filter portraits by race', () => {
      const humePortraits = generateAllPortraits({race: 'hume'});

      // Hume has 2 genders × 8 faces × 2 hair styles = 32 portraits
      expect(humePortraits).toHaveLength(32);
      humePortraits.forEach(portrait => expect(portrait.race).toBe('hume'));
    });

    it('should filter portraits by gender', () => {
      const malePortraits = generateAllPortraits({gender: 'male'});

      // Male: hume, elvaan, tarutaru, galka = 4 races × 8 faces × 2 hair styles = 64 portraits
      expect(malePortraits).toHaveLength(64);
      malePortraits.forEach(portrait => expect(portrait.gender).toBe('male'));
    });

    it('should filter portraits by race and gender', () => {
      const humePortraits = generateAllPortraits({
        gender: 'male',
        race: 'hume',
      });

      // 1 race/gender combo × 8 faces × 2 hair styles = 16 portraits
      expect(humePortraits).toHaveLength(16);
      humePortraits.forEach(portrait => {
        expect(portrait.race).toBe('hume');
        expect(portrait.gender).toBe('male');
      });
    });

    it('should filter portraits by face', () => {
      const face1Portraits = generateAllPortraits({face: 1});

      // 8 race/gender combinations × 1 face × 2 hair styles = 16 portraits
      expect(face1Portraits).toHaveLength(16);
      face1Portraits.forEach(portrait => expect(portrait.face).toBe(1));
    });

    it('should filter portraits by hair style', () => {
      const hairAPortraits = generateAllPortraits({hair: 'A'});

      // 8 race/gender combinations × 8 faces × 1 hair style = 64 portraits
      expect(hairAPortraits).toHaveLength(64);
      hairAPortraits.forEach(portrait => expect(portrait.hair).toBe('A'));
    });
  });

  describe('Race/Gender Specific Functions', () => {
    it('should get portraits for valid race/gender combinations', () => {
      const humePortraits = getPortraitsForRaceGender('hume', 'male');
      expect(humePortraits).toHaveLength(16); // 8 faces × 2 hair styles

      const mithraPortraits = getPortraitsForRaceGender('mithra', 'female');
      expect(mithraPortraits).toHaveLength(16); // 8 faces × 2 hair styles
    });

    it('should return empty array for invalid race/gender combinations', () => {
      const invalidPortraits1 = getPortraitsForRaceGender('mithra', 'male');
      expect(invalidPortraits1).toHaveLength(0);

      const invalidPortraits2 = getPortraitsForRaceGender('galka', 'female');
      expect(invalidPortraits2).toHaveLength(0);
    });
  });

  describe('Validation Functions', () => {
    it('should validate correct race/gender combinations', () => {
      expect(isValidRaceGenderCombo('hume', 'male')).toBe(true);
      expect(isValidRaceGenderCombo('hume', 'female')).toBe(true);
      expect(isValidRaceGenderCombo('mithra', 'female')).toBe(true);
      expect(isValidRaceGenderCombo('galka', 'male')).toBe(true);
    });

    it('should reject invalid race/gender combinations', () => {
      expect(isValidRaceGenderCombo('mithra', 'male')).toBe(false);
      expect(isValidRaceGenderCombo('galka', 'female')).toBe(false);
    });

    it('should get valid genders for each race', () => {
      expect(getValidGendersForRace('hume')).toEqual(['male', 'female']);
      expect(getValidGendersForRace('elvaan')).toEqual(['male', 'female']);
      expect(getValidGendersForRace('tarutaru')).toEqual(['male', 'female']);
      expect(getValidGendersForRace('mithra')).toEqual(['female']);
      expect(getValidGendersForRace('galka')).toEqual(['male']);
    });
  });

  describe('Filename Parsing', () => {
    it('should parse valid portrait filenames', () => {
      const parsed = parsePortraitFilename('portrait-hume-male-face1-hairA.webp');
      expect(parsed).toEqual({
        face: 1,
        gender: 'male',
        hair: 'A',
        race: 'hume',
      });

      const parsed2 = parsePortraitFilename('portrait-elvaan-female-face8-hairB.webp');
      expect(parsed2).toEqual({
        face: 8,
        gender: 'female',
        hair: 'B',
        race: 'elvaan',
      });
    });

    it('should return null for invalid filenames', () => {
      expect(parsePortraitFilename('invalid-filename.jpg')).toBeNull();
      expect(parsePortraitFilename('portrait-invalid-race-face1-hairA.webp')).toBeNull();
      expect(parsePortraitFilename('portrait-hume-male-face0-hairA.webp')).toBeNull(); // Face 0 invalid
      expect(parsePortraitFilename('portrait-hume-male-face1-hairC.webp')).toBeNull(); // Hair C invalid
      expect(parsePortraitFilename('not-a-portrait.webp')).toBeNull();
    });

    it('should handle edge cases in parsing', () => {
      expect(parsePortraitFilename('')).toBeNull();
      expect(parsePortraitFilename('portrait-hume-male-face9-hairA.webp')).toBeNull(); // Face 9 invalid
      expect(parsePortraitFilename('portrait-hume-unknown-face1-hairA.webp')).toBeNull(); // Unknown gender
    });
  });

  describe('Portrait Statistics', () =>
    it('should calculate correct portrait statistics', () => {
      const stats = getPortraitStats();

      expect(stats.total).toBe(128); // Total expected portraits
      expect(stats.facesPerRaceGender).toBe(8);
      expect(stats.hairStylesPerFace).toBe(2);
      expect(stats.portraitsPerRaceGender).toBe(16);

      // Check race-specific counts
      expect(stats.byRace.hume).toBe(32); // 2 genders × 8 faces × 2 hair = 32
      expect(stats.byRace.elvaan).toBe(32); // 2 genders × 8 faces × 2 hair = 32
      expect(stats.byRace.tarutaru).toBe(32); // 2 genders × 8 faces × 2 hair = 32
      expect(stats.byRace.mithra).toBe(16); // 1 gender × 8 faces × 2 hair = 16
      expect(stats.byRace.galka).toBe(16); // 1 gender × 8 faces × 2 hair = 16
    }));

  describe('Portrait Data Integrity', () => {
    it('should generate unique IDs for all portraits', () => {
      const portraits = generateAllPortraits();
      const ids = portraits.map(portrait => portrait.id);
      const uniqueIds = new Set(ids);

      expect(ids).toHaveLength(uniqueIds.size); // No duplicates
    });

    it('should generate consistent paths and URLs', () => {
      const portraits = generateAllPortraits();

      portraits.forEach(portrait => {
        // Verify filename consistency
        const expectedFilename = generatePortraitFilename(portrait);
        expect(portrait.filename).toBe(expectedFilename);

        // Verify path consistency
        const expectedPath = generatePortraitPath(portrait);
        expect(portrait.path).toBe(expectedPath);

        // Verify URL consistency
        const expectedUrl = generatePortraitUrl(portrait);
        expect(portrait.url).toBe(expectedUrl);
      });
    });

    it('should maintain race/gender constraints', () => {
      const portraits = generateAllPortraits();

      // Check that Mithra are only female
      const mithraPortraits = portraits.filter(portrait => portrait.race === 'mithra');
      mithraPortraits.forEach(portrait => expect(portrait.gender).toBe('female'));

      // Check that Galka are only male
      const galkaPortraits = portraits.filter(portrait => portrait.race === 'galka');
      galkaPortraits.forEach(portrait => expect(portrait.gender).toBe('male'));
    });
  });
});
