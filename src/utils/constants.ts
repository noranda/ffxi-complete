/**
 * FFXI Game Constants
 *
 * Defines core game data including character races, worlds, and other
 * constants used throughout the application for character management.
 */

// =============================================================================
// CHARACTER RACES & GENDERS
// =============================================================================

export const FFXI_RACES = {
  ELVAAN: 'elvaan',
  GALKA: 'galka',
  HUME: 'hume',
  MITHRA: 'mithra',
  TARUTARU: 'tarutaru',
} as const;

export const FFXI_GENDERS = {
  FEMALE: 'female',
  MALE: 'male',
} as const;

/**
 * Valid race and gender combinations in FFXI
 * Some races are gender-locked (Mithra = female only, Galka = male only)
 */
export const RACE_GENDER_COMBINATIONS = [
  {gender: FFXI_GENDERS.MALE, race: FFXI_RACES.HUME},
  {gender: FFXI_GENDERS.FEMALE, race: FFXI_RACES.HUME},
  {gender: FFXI_GENDERS.MALE, race: FFXI_RACES.ELVAAN},
  {gender: FFXI_GENDERS.FEMALE, race: FFXI_RACES.ELVAAN},
  {gender: FFXI_GENDERS.MALE, race: FFXI_RACES.TARUTARU},
  {gender: FFXI_GENDERS.FEMALE, race: FFXI_RACES.TARUTARU},
  {gender: FFXI_GENDERS.FEMALE, race: FFXI_RACES.MITHRA}, // Female only
  {gender: FFXI_GENDERS.MALE, race: FFXI_RACES.GALKA}, // Male only
] as const;

// =============================================================================
// CHARACTER CUSTOMIZATION
// =============================================================================

/**
 * Available face options for character creation
 * FFXI typically has 8 face options per race/gender combination
 */
export const FACE_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8] as const;

/**
 * Available hair style options
 * A = Hair Style A, B = Hair Style B
 */
export const HAIR_STYLES = ['A', 'B'] as const;

// =============================================================================
// FFXI WORLDS
// =============================================================================

/**
 * Active FFXI worlds as of 2025
 * Used for character creation and world selection
 * Source: http://www.playonline.com/pcd/service/ff11usindex.html
 */
export const FFXI_WORLDS = [
  'Asura',
  'Bahamut',
  'Bismarck',
  'Carbuncle',
  'Cerberus',
  'Fenrir',
  'Lakshmi',
  'Leviathan',
  'Odin',
  'Phoenix',
  'Quetzalcoatl',
  'Ragnarok',
  'Shiva',
  'Siren',
  'Sylph',
  'Valefor',
] as const;

// =============================================================================
// PORTRAIT CONFIGURATION
// =============================================================================

/**
 * Portrait file naming and organization settings
 */
export const PORTRAIT_CONFIG = {
  /** Portrait dimensions for consistent display */
  DIMENSIONS: {
    HEIGHT: 149,
    WIDTH: 200,
  },
  /** Base filename pattern: portrait-{race}-{gender}-face{face}-hair{hair}.webp */
  FILENAME_PATTERN: 'portrait-{race}-{gender}-face{face}-hair{hair}.webp',
  /** File format for optimized web portraits */
  FORMAT: 'webp',
} as const;

// =============================================================================
// PROGRESS TRACKING CATEGORIES
// =============================================================================

/**
 * Categories for character progress tracking
 * Used in the character_progress table for organizing different types of progression
 */
export const PROGRESS_CATEGORIES = {
  FAME: 'fame',
  ITEMS: 'items',
  JOBS: 'jobs',
  MISSIONS: 'missions',
  MOUNTS: 'mounts',
  QUESTS: 'quests',
  SKILLS: 'skills',
  SPELLS: 'spells',
  TRUSTS: 'trusts',
} as const;

// =============================================================================
// TYPE EXPORTS
// =============================================================================

export type FaceOption = (typeof FACE_OPTIONS)[number];
export type FFXIGender = (typeof FFXI_GENDERS)[keyof typeof FFXI_GENDERS];
export type FFXIRace = (typeof FFXI_RACES)[keyof typeof FFXI_RACES];
export type FFXIWorld = (typeof FFXI_WORLDS)[number];
export type HairStyle = (typeof HAIR_STYLES)[number];
export type ProgressCategory = (typeof PROGRESS_CATEGORIES)[keyof typeof PROGRESS_CATEGORIES];
export type RaceGenderCombination = (typeof RACE_GENDER_COMBINATIONS)[number];
