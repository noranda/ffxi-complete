/**
 * FFXI Icon Component
 *
 * A React component for displaying authentic FFXI icons from categorized SVG sprites.
 * Supports lazy loading, caching, and multiple sizes with excellent performance.
 * Supports 1,282 icons across magic and status categories.
 */

import {useEffect, useState} from 'react';

import {cn} from '@/lib/utils';

import type {FFXIIconProps, IconCategory, IconSize} from './types';

import {getCachedSprite, getLoadingState, loadSprite} from './sprite-loader';

/**
 * Category mapping from registry categories to sprite categories
 */
const CATEGORY_MAPPING: Record<string, string> = {
  buffs: 'status',
  spells: 'magic',
};

/**
 * Size mapping for consistent icon dimensions
 */
const SIZE_CLASSES: Record<IconSize, string> = {
  lg: 'w-8 h-8', // 32px
  md: 'w-6 h-6', // 24px
  sm: 'w-4 h-4', // 16px
  xl: 'w-12 h-12', // 48px
  xs: 'w-3 h-3', // 12px
  xxl: 'w-16 h-16', // 64px
};

/**
 * Loading spinner component
 */
const LoadingSpinner: React.FC<{size: IconSize}> = ({size}) => (
  <div
    aria-label="Loading icon"
    className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-gray-600', SIZE_CLASSES[size])}
    role="status"
  />
);

/**
 * Error placeholder component
 */
const ErrorPlaceholder: React.FC<{error: string; size: IconSize}> = ({error, size}) => (
  <div
    aria-label="Icon failed to load"
    className={cn('flex items-center justify-center rounded bg-gray-200 text-xs text-gray-500', SIZE_CLASSES[size])}
    role="img"
    title={`Error loading icon: ${error}`}
  >
    ⚠
  </div>
);

/**
 * Main FFXI Icon component
 */
export const FFXIIcon: React.FC<FFXIIconProps> = ({
  category,
  className,
  name,
  onClick,
  onError,
  onLoad,
  size = 'md',
  title,
}) => {
  // Map registry category to sprite category
  const spriteCategory = CATEGORY_MAPPING[category] || category;

  const [spriteContent, setSpriteContent] = useState<null | string>(null);
  const [loadingState, setLoadingState] = useState(() => getLoadingState(spriteCategory as IconCategory));

  useEffect(() => {
    // Check if sprite is already cached
    const cached = getCachedSprite(spriteCategory as IconCategory);
    if (cached) {
      setSpriteContent(cached);
      onLoad?.();
      return;
    }

    // Load sprite if not cached
    const loadSpriteAsync = async () => {
      try {
        setLoadingState({error: null, loaded: false, loading: true});
        const content = await loadSprite(spriteCategory as IconCategory);
        setSpriteContent(content);
        setLoadingState({error: null, loaded: true, loading: false});
        onLoad?.();
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to load sprite';
        setLoadingState({error: errorMessage, loaded: false, loading: false});
        onError?.(error instanceof Error ? error : new Error(errorMessage));
      }
    };

    loadSpriteAsync();
  }, [spriteCategory, onError, onLoad]);

  // Show loading state
  if (loadingState.loading) {
    return <LoadingSpinner size={size} />;
  }

  // Show error state
  if (loadingState.error) {
    return <ErrorPlaceholder error={loadingState.error} size={size} />;
  }

  // Show icon if sprite is loaded
  if (spriteContent) {
    // Handle different icon ID formats
    // For abilities icons, the name already includes the sprite category prefix
    const iconId = name.startsWith(`${spriteCategory}-`) ? name : `${spriteCategory}-${name}`;

    return (
      <svg
        aria-label={title || `${category} ${name} icon`}
        className={cn(SIZE_CLASSES[size], 'fill-current', className)}
        onClick={onClick}
        role="img"
        style={{cursor: onClick ? 'pointer' : undefined}}
      >
        {title && <title>{title}</title>}

        <use href={`#${iconId}`} />
      </svg>
    );
  }

  // Fallback if nothing to show
  return <ErrorPlaceholder error="No content available" size={size} />;
};

export default FFXIIcon;
