/**
 * Character Portrait Utilities
 *
 * Provides helper functions for working with FFXI character portraits
 * including path generation, filtering, and validation.
 */

import {
  FACE_OPTIONS,
  type FaceOption,
  FFXI_GENDERS,
  FFXI_RACES,
  type FFXIGender,
  type FFXIRace,
  HAIR_STYLES,
  type HairStyle,
  PORTRAIT_CONFIG,
  RACE_GENDER_COMBINATIONS,
} from './constants';

// =============================================================================
// TYPES
// =============================================================================

/**
 * Portrait with metadata for display
 */
export type Portrait = PortraitId & {
  filename: string;
  id: string;
  path: string;
  url: string;
};

/**
 * Portrait filter options
 */
export type PortraitFilter = {
  face?: FaceOption;
  gender?: FFXIGender;
  hair?: HairStyle;
  race?: FFXIRace;
};

/**
 * Portrait identification data
 */
export type PortraitId = {
  face: FaceOption;
  gender: FFXIGender;
  hair: HairStyle;
  race: FFXIRace;
};

// =============================================================================
// PORTRAIT PATH & URL GENERATION
// =============================================================================

/**
 * Generate the filename for a portrait based on its characteristics
 */
export const generatePortraitFilename = (portrait: PortraitId): string =>
  PORTRAIT_CONFIG.FILENAME_PATTERN.replace('{race}', portrait.race)
    .replace('{gender}', portrait.gender)
    .replace('{face}', portrait.face.toString())
    .replace('{hair}', portrait.hair);

/**
 * Generate the file path for a portrait in the assets directory
 */
export const generatePortraitPath = (portrait: PortraitId): string => {
  const filename = generatePortraitFilename(portrait);
  return `/portraits/${portrait.race}/${portrait.gender}/${filename}`;
};

/**
 * Generate the full URL for a portrait image
 */
export const generatePortraitUrl = (portrait: PortraitId, baseUrl = '/src/assets'): string => {
  const path = generatePortraitPath(portrait);
  return `${baseUrl}${path}`;
};

// =============================================================================
// PORTRAIT GENERATION & ENUMERATION
// =============================================================================

/**
 * Generate all possible portrait combinations for the given filters
 */
export const generateAllPortraits = (filter: PortraitFilter = {}): Portrait[] => {
  const portraits: Portrait[] = [];

  // Filter valid race/gender combinations
  const validCombinations = RACE_GENDER_COMBINATIONS.filter(combo => {
    if (filter.race && combo.race !== filter.race) return false;
    if (filter.gender && combo.gender !== filter.gender) return false;
    return true;
  });

  // Generate portraits for each valid combination
  for (const {gender, race} of validCombinations) {
    const faces = filter.face ? [filter.face] : FACE_OPTIONS;
    const hairs = filter.hair ? [filter.hair] : HAIR_STYLES;

    for (const face of faces) {
      for (const hair of hairs) {
        const portraitId: PortraitId = {face, gender, hair, race};
        const filename = generatePortraitFilename(portraitId);
        const path = generatePortraitPath(portraitId);
        const url = generatePortraitUrl(portraitId);

        portraits.push({
          ...portraitId,
          filename,
          id: `${race}-${gender}-${face}-${hair}`,
          path,
          url,
        });
      }
    }
  }

  return portraits;
};

/**
 * Get available portrait options for a specific race/gender combination
 */
export const getPortraitsForRaceGender = (race: FFXIRace, gender: FFXIGender): Portrait[] => {
  // Validate race/gender combination
  const isValidCombination = RACE_GENDER_COMBINATIONS.some(combo => combo.race === race && combo.gender === gender);

  if (!isValidCombination) {
    return [];
  }

  return generateAllPortraits({gender, race});
};

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Check if a race/gender combination is valid in FFXI
 */
export const isValidRaceGenderCombo = (race: FFXIRace, gender: FFXIGender): boolean =>
  RACE_GENDER_COMBINATIONS.some(combo => combo.race === race && combo.gender === gender);

/**
 * Get valid genders for a specific race
 */
export const getValidGendersForRace = (race: FFXIRace): FFXIGender[] =>
  RACE_GENDER_COMBINATIONS.filter(combo => combo.race === race).map(combo => combo.gender);

/**
 * Parse a portrait filename to extract its characteristics
 */
export const parsePortraitFilename = (filename: string): null | PortraitId => {
  const regex = /^portrait-(\w+)-(\w+)-face(\d+)-hair([AB])\.webp$/;
  const match = filename.match(regex);

  if (!match) {
    return null;
  }

  const [, race, gender, faceStr, hair] = match;
  const face = parseInt(faceStr, 10);

  // Validate parsed values
  if (
    !Object.values(FFXI_RACES).includes(race as FFXIRace) ||
    !Object.values(FFXI_GENDERS).includes(gender as FFXIGender) ||
    !FACE_OPTIONS.includes(face as FaceOption) ||
    !HAIR_STYLES.includes(hair as HairStyle)
  ) {
    return null;
  }

  return {
    face: face as FaceOption,
    gender: gender as FFXIGender,
    hair: hair as HairStyle,
    race: race as FFXIRace,
  };
};

// =============================================================================
// PORTRAIT STATISTICS
// =============================================================================

/**
 * Get statistics about portrait availability
 */
export const getPortraitStats = () => {
  const allPossiblePortraits = generateAllPortraits();
  const byRace = Object.fromEntries(
    Object.values(FFXI_RACES).map(race => [
      race,
      allPossiblePortraits.filter(portrait => portrait.race === race).length,
    ])
  );

  return {
    byRace,
    facesPerRaceGender: FACE_OPTIONS.length,
    hairStylesPerFace: HAIR_STYLES.length,
    portraitsPerRaceGender: FACE_OPTIONS.length * HAIR_STYLES.length,
    total: allPossiblePortraits.length,
  };
};
