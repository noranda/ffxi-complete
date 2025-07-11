/**
 * FFXI Icon System
 *
 * Exports for the categorized SVG sprite icon system.
 * Provides 1,282 authentic FFXI icons with optimal performance through sprite loading.
 * Supports magic and status icon categories.
 */

// Main component export
export {FFXIIcon} from './FFXIIcon';

// Registry data
export {default as iconRegistry} from './registry.json';

// Utility exports
export {getCachedSprite, getLoadingState, isSpriteLoaded, loadSprite, preloadSprites} from './sprite-loader';

// Type exports
export type {
  FFXIIconProps,
  IconCategory,
  IconLoadingState,
  IconMetadata,
  IconName,
  IconRegistry,
  IconSize,
  MagicIconName,
  StatusIconName,
} from './types';
