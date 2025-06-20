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
 * Portrait identification data
 */
export type PortraitId = {
  race: FFXIRace;
  gender: FFXIGender;
  face: FaceOption;
  hair: HairStyle;
};

/**
 * Portrait with metadata for display
 */
export type Portrait = PortraitId & {
  id: string;
  filename: string;
  path: string;
  url: string;
};

/**
 * Portrait filter options
 */
export type PortraitFilter = {
  race?: FFXIRace;
  gender?: FFXIGender;
  face?: FaceOption;
  hair?: HairStyle;
};

// =============================================================================
// PORTRAIT PATH & URL GENERATION
// =============================================================================

/**
 * Generate the filename for a portrait based on its characteristics
 *
 * @param portrait Portrait identification data
 * @returns Generated filename following the naming convention
 *
 * @example
 * ```typescript
 * const filename = generatePortraitFilename({
 *   race: 'hume',
 *   gender: 'male',
 *   face: 1,
 *   hair: 'A'
 * });
 * // Result: "portrait-hume-male-face1-hairA.webp"
 * ```
 */
export const generatePortraitFilename = (portrait: PortraitId): string => {
  return PORTRAIT_CONFIG.FILENAME_PATTERN.replace('{race}', portrait.race)
    .replace('{gender}', portrait.gender)
    .replace('{face}', portrait.face.toString())
    .replace('{hair}', portrait.hair);
};

/**
 * Generate the file path for a portrait in the assets directory
 *
 * @param portrait Portrait identification data
 * @returns Full path to the portrait file
 *
 * @example
 * ```typescript
 * const path = generatePortraitPath({
 *   race: 'hume',
 *   gender: 'male',
 *   face: 1,
 *   hair: 'A'
 * });
 * // Result: "/portraits/hume/male/portrait-hume-male-face1-hairA.webp"
 * ```
 */
export const generatePortraitPath = (portrait: PortraitId): string => {
  const filename = generatePortraitFilename(portrait);
  return `/portraits/${portrait.race}/${portrait.gender}/${filename}`;
};

/**
 * Generate the full URL for a portrait image
 *
 * @param portrait Portrait identification data
 * @param baseUrl Optional base URL for the assets (defaults to relative path)
 * @returns Full URL to the portrait image
 *
 * @example
 * ```typescript
 * const url = generatePortraitUrl({
 *   race: 'hume',
 *   gender: 'male',
 *   face: 1,
 *   hair: 'A'
 * });
 * // Result: "/src/assets/portraits/hume/male/portrait-hume-male-face1-hairA.webp"
 * ```
 */
export const generatePortraitUrl = (
  portrait: PortraitId,
  baseUrl = '/src/assets'
): string => {
  const path = generatePortraitPath(portrait);
  return `${baseUrl}${path}`;
};

// =============================================================================
// PORTRAIT GENERATION & ENUMERATION
// =============================================================================

/**
 * Generate all possible portrait combinations for the given filters
 *
 * @param filter Optional filters to limit the results
 * @returns Array of all matching portrait data
 *
 * @example
 * ```typescript
 * // Get all Hume Male portraits
 * const humePortraits = generateAllPortraits({race: 'hume', gender: 'male'});
 *
 * // Get all portraits for a specific face
 * const face1Portraits = generateAllPortraits({face: 1});
 *
 * // Get all portraits
 * const allPortraits = generateAllPortraits();
 * ```
 */
export const generateAllPortraits = (
  filter: PortraitFilter = {}
): Portrait[] => {
  const portraits: Portrait[] = [];

  // Filter valid race/gender combinations
  const validCombinations = RACE_GENDER_COMBINATIONS.filter(combo => {
    if (filter.race && combo.race !== filter.race) return false;
    if (filter.gender && combo.gender !== filter.gender) return false;
    return true;
  });

  // Generate portraits for each valid combination
  for (const {race, gender} of validCombinations) {
    const faces = filter.face ? [filter.face] : FACE_OPTIONS;
    const hairs = filter.hair ? [filter.hair] : HAIR_STYLES;

    for (const face of faces) {
      for (const hair of hairs) {
        const portraitId: PortraitId = {race, gender, face, hair};
        const filename = generatePortraitFilename(portraitId);
        const path = generatePortraitPath(portraitId);
        const url = generatePortraitUrl(portraitId);

        portraits.push({
          ...portraitId,
          id: `${race}-${gender}-${face}-${hair}`,
          filename,
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
 *
 * @param race FFXI character race
 * @param gender Character gender
 * @returns Array of portraits for the specified race/gender, or empty array if invalid
 *
 * @example
 * ```typescript
 * const humePortraits = getPortraitsForRaceGender('hume', 'male');
 * const mithraPortraits = getPortraitsForRaceGender('mithra', 'female'); // Valid
 * const invalidPortraits = getPortraitsForRaceGender('mithra', 'male'); // Returns []
 * ```
 */
export const getPortraitsForRaceGender = (
  race: FFXIRace,
  gender: FFXIGender
): Portrait[] => {
  // Validate race/gender combination
  const isValidCombination = RACE_GENDER_COMBINATIONS.some(
    combo => combo.race === race && combo.gender === gender
  );

  if (!isValidCombination) {
    return [];
  }

  return generateAllPortraits({race, gender});
};

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Check if a race/gender combination is valid in FFXI
 *
 * @param race Character race
 * @param gender Character gender
 * @returns True if the combination is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidRaceGenderCombo('hume', 'male'); // true
 * isValidRaceGenderCombo('mithra', 'female'); // true
 * isValidRaceGenderCombo('mithra', 'male'); // false (Mithra are female-only)
 * isValidRaceGenderCombo('galka', 'female'); // false (Galka are male-only)
 * ```
 */
export const isValidRaceGenderCombo = (
  race: FFXIRace,
  gender: FFXIGender
): boolean => {
  return RACE_GENDER_COMBINATIONS.some(
    combo => combo.race === race && combo.gender === gender
  );
};

/**
 * Get valid genders for a specific race
 *
 * @param race Character race
 * @returns Array of valid genders for the race
 *
 * @example
 * ```typescript
 * getValidGendersForRace('hume'); // ['male', 'female']
 * getValidGendersForRace('mithra'); // ['female']
 * getValidGendersForRace('galka'); // ['male']
 * ```
 */
export const getValidGendersForRace = (race: FFXIRace): FFXIGender[] => {
  return RACE_GENDER_COMBINATIONS.filter(combo => combo.race === race).map(
    combo => combo.gender
  );
};

/**
 * Parse a portrait filename to extract its characteristics
 *
 * @param filename Portrait filename to parse
 * @returns Parsed portrait data or null if invalid format
 *
 * @example
 * ```typescript
 * const parsed = parsePortraitFilename('portrait-hume-male-face1-hairA.webp');
 * // Result: { race: 'hume', gender: 'male', face: 1, hair: 'A' }
 *
 * const invalid = parsePortraitFilename('invalid-filename.jpg');
 * // Result: null
 * ```
 */
export const parsePortraitFilename = (filename: string): PortraitId | null => {
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
    race: race as FFXIRace,
    gender: gender as FFXIGender,
    face: face as FaceOption,
    hair: hair as HairStyle,
  };
};

// =============================================================================
// PORTRAIT STATISTICS
// =============================================================================

/**
 * Get statistics about portrait availability
 *
 * @returns Object with portrait counts and coverage statistics
 */
export const getPortraitStats = () => {
  const allPossiblePortraits = generateAllPortraits();
  const byRace = Object.fromEntries(
    Object.values(FFXI_RACES).map(race => [
      race,
      allPossiblePortraits.filter(p => p.race === race).length,
    ])
  );

  return {
    total: allPossiblePortraits.length,
    byRace,
    facesPerRaceGender: FACE_OPTIONS.length,
    hairStylesPerFace: HAIR_STYLES.length,
    portraitsPerRaceGender: FACE_OPTIONS.length * HAIR_STYLES.length,
  };
};
