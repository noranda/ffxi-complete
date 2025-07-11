/**
 * FFXI Icon Sprite Loader
 *
 * Handles loading and caching of chunked SVG sprite files for optimal performance.
 * Sprites are split into chunks under 500KB each and loaded on-demand.
 * Supports 1,282 icons across magic and status categories.
 */

import type {IconCategory, IconLoadingState} from './types';

/**
 * Cache for loaded sprite content
 */
const spriteCache = new Map<IconCategory, string>();

/**
 * Set to track which sprites have been injected into the DOM
 */
const injectedSprites = new Set<IconCategory>();

/**
 * Loading state tracker for each category
 */
const loadingStates = new Map<IconCategory, IconLoadingState>();

/**
 * Active loading promises to prevent duplicate requests
 */
const loadingPromises = new Map<IconCategory, Promise<string>>();

/**
 * Chunked sprite configuration
 * Maps categories to their chunk counts
 */
const SPRITE_CHUNKS: Record<string, number> = {
  magic: 26,
  status: 7,
};

/**
 * Combine multiple SVG chunks into a single SVG
 */
function combineChunks(chunks: string[]): string {
  const parser = new DOMParser();
  const combinedDoc = parser.parseFromString(
    '<svg xmlns="http://www.w3.org/2000/svg" style="display: none;"></svg>',
    'image/svg+xml'
  );
  const combinedRoot = combinedDoc.documentElement;

  // Extract symbols from each chunk
  for (const chunk of chunks) {
    const chunkDoc = parser.parseFromString(chunk, 'image/svg+xml');
    const symbols = chunkDoc.querySelectorAll('symbol');

    symbols.forEach(symbol => {
      // Create a new symbol element in the combined document to avoid namespace issues
      const newSymbol = combinedDoc.createElementNS('http://www.w3.org/2000/svg', 'symbol');

      // Copy attributes, skipping problematic namespace declarations
      for (let i = 0; i < symbol.attributes.length; i++) {
        const attr = symbol.attributes[i];
        // Skip namespace prefixes that can cause Safari issues
        if (!attr.name.startsWith('xmlns:')) {
          newSymbol.setAttribute(attr.name, attr.value);
        }
      }

      // Safari-compatible way to copy inner content: recreate image elements
      const images = symbol.querySelectorAll('image');
      images.forEach(img => {
        const newImage = combinedDoc.createElementNS('http://www.w3.org/2000/svg', 'image');
        // Copy all image attributes
        for (let i = 0; i < img.attributes.length; i++) {
          const attr = img.attributes[i];
          newImage.setAttribute(attr.name, attr.value);
        }
        newSymbol.appendChild(newImage);
      });

      combinedRoot.appendChild(newSymbol);
    });
  }

  return new XMLSerializer().serializeToString(combinedDoc);
}

/**
 * Combined sprite loader for a category
 * Loads all chunks for a category and combines them
 */
async function loadAllChunks(category: IconCategory): Promise<string> {
  const chunkCount = SPRITE_CHUNKS[category];
  if (!chunkCount) {
    throw new Error(`No chunks configured for category: ${category}`);
  }

  // Load all chunks in parallel
  const chunkPromises = Array.from({length: chunkCount}, (_, i) => loadChunk(category, i + 1));

  const chunks = await Promise.all(chunkPromises);

  // Combine all chunks into a single SVG
  const combinedSvg = combineChunks(chunks);
  return combinedSvg;
}

/**
 * Load a single chunk using dynamic import
 */
async function loadChunk(category: IconCategory, chunkNum: number): Promise<string> {
  // Use dynamic import with explicit path construction
  try {
    let module;

    if (category === 'status') {
      switch (chunkNum) {
        case 1:
          module = await import('./sprites/chunks/status-chunk-1.svg?raw');
          break;
        case 2:
          module = await import('./sprites/chunks/status-chunk-2.svg?raw');
          break;
        case 3:
          module = await import('./sprites/chunks/status-chunk-3.svg?raw');
          break;
        case 4:
          module = await import('./sprites/chunks/status-chunk-4.svg?raw');
          break;
        case 5:
          module = await import('./sprites/chunks/status-chunk-5.svg?raw');
          break;
        case 6:
          module = await import('./sprites/chunks/status-chunk-6.svg?raw');
          break;
        case 7:
          module = await import('./sprites/chunks/status-chunk-7.svg?raw');
          break;
        default:
          throw new Error(`Unknown status chunk: ${chunkNum}`);
      }
    } else if (category === 'magic') {
      switch (chunkNum) {
        case 1:
          module = await import('./sprites/chunks/magic-chunk-1.svg?raw');
          break;
        case 2:
          module = await import('./sprites/chunks/magic-chunk-2.svg?raw');
          break;
        case 3:
          module = await import('./sprites/chunks/magic-chunk-3.svg?raw');
          break;
        case 4:
          module = await import('./sprites/chunks/magic-chunk-4.svg?raw');
          break;
        case 5:
          module = await import('./sprites/chunks/magic-chunk-5.svg?raw');
          break;
        case 6:
          module = await import('./sprites/chunks/magic-chunk-6.svg?raw');
          break;
        case 7:
          module = await import('./sprites/chunks/magic-chunk-7.svg?raw');
          break;
        case 8:
          module = await import('./sprites/chunks/magic-chunk-8.svg?raw');
          break;
        case 9:
          module = await import('./sprites/chunks/magic-chunk-9.svg?raw');
          break;
        case 10:
          module = await import('./sprites/chunks/magic-chunk-10.svg?raw');
          break;
        case 11:
          module = await import('./sprites/chunks/magic-chunk-11.svg?raw');
          break;
        case 12:
          module = await import('./sprites/chunks/magic-chunk-12.svg?raw');
          break;
        case 13:
          module = await import('./sprites/chunks/magic-chunk-13.svg?raw');
          break;
        case 14:
          module = await import('./sprites/chunks/magic-chunk-14.svg?raw');
          break;
        case 15:
          module = await import('./sprites/chunks/magic-chunk-15.svg?raw');
          break;
        case 16:
          module = await import('./sprites/chunks/magic-chunk-16.svg?raw');
          break;
        case 17:
          module = await import('./sprites/chunks/magic-chunk-17.svg?raw');
          break;
        case 18:
          module = await import('./sprites/chunks/magic-chunk-18.svg?raw');
          break;
        case 19:
          module = await import('./sprites/chunks/magic-chunk-19.svg?raw');
          break;
        case 20:
          module = await import('./sprites/chunks/magic-chunk-20.svg?raw');
          break;
        case 21:
          module = await import('./sprites/chunks/magic-chunk-21.svg?raw');
          break;
        case 22:
          module = await import('./sprites/chunks/magic-chunk-22.svg?raw');
          break;
        case 23:
          module = await import('./sprites/chunks/magic-chunk-23.svg?raw');
          break;
        case 24:
          module = await import('./sprites/chunks/magic-chunk-24.svg?raw');
          break;
        case 25:
          module = await import('./sprites/chunks/magic-chunk-25.svg?raw');
          break;
        case 26:
          module = await import('./sprites/chunks/magic-chunk-26.svg?raw');
          break;
        default:
          throw new Error(`Unknown magic chunk: ${chunkNum}`);
      }
    } else {
      throw new Error(`Unknown category: ${category}`);
    }

    return module.default;
  } catch (error) {
    console.error(`Failed to load chunk ${category}-${chunkNum}:`, error);
    throw error;
  }
}

/**
 * Dynamic sprite loaders for each category
 * Sprites are loaded on-demand to reduce bundle size
 */
const SPRITE_LOADERS: Partial<Record<IconCategory, () => Promise<string>>> = {
  magic: () => loadAllChunks('magic'),
  status: () => loadAllChunks('status'),
};

/**
 * Get cached sprite content and ensure it's injected into DOM
 */
export function getCachedSprite(category: IconCategory): string | undefined {
  const cached = spriteCache.get(category);
  if (cached && !injectedSprites.has(category)) {
    // Sprite is cached but not injected, inject it now
    injectSpriteIntoDOM(category, cached);
  }
  return cached;
}

/**
 * Get current loading state for a category
 */
export function getLoadingState(category: IconCategory): IconLoadingState {
  return (
    loadingStates.get(category) || {
      error: null,
      loaded: false,
      loading: false,
    }
  );
}

/**
 * Check if a sprite is already loaded
 */
export function isSpriteLoaded(category: IconCategory): boolean {
  return spriteCache.has(category);
}

/**
 * Load sprite file for a category
 */
export async function loadSprite(category: IconCategory): Promise<string> {
  // Return cached sprite if available
  const cached = getCachedSprite(category);
  if (cached) {
    return cached;
  }

  // Return existing loading promise if already in progress
  const existingPromise = loadingPromises.get(category);
  if (existingPromise) {
    return existingPromise;
  }

  // Start loading
  setLoadingState(category, {error: null, loading: true});

  const loadingPromise = Promise.resolve()
    .then(async () => {
      // Get dynamic sprite loader
      const spriteLoader = SPRITE_LOADERS[category];
      if (!spriteLoader) {
        throw new Error(`No sprite loader available for category: ${category}`);
      }

      // Load sprite content dynamically
      const svgContent = await spriteLoader();

      // Cache the sprite content
      spriteCache.set(category, svgContent);

      // Inject sprite into DOM for <use> elements to work
      injectSpriteIntoDOM(category, svgContent);

      setLoadingState(category, {error: null, loaded: true, loading: false});

      // Clean up loading promise
      loadingPromises.delete(category);

      return svgContent;
    })
    .catch(error => {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setLoadingState(category, {error: errorMessage, loaded: false, loading: false});

      // Clean up loading promise
      loadingPromises.delete(category);

      throw error;
    });

  // Store the loading promise
  loadingPromises.set(category, loadingPromise);

  return loadingPromise;
}

/**
 * Preload sprites for given categories
 */
export async function preloadSprites(categories: IconCategory[]): Promise<void> {
  const loadPromises = categories.map(category =>
    loadSprite(category).catch(error => console.warn(`Failed to preload sprite ${category}:`, error))
  );

  await Promise.all(loadPromises);
}

/**
 * Inject sprite content into the DOM
 */
function injectSpriteIntoDOM(category: IconCategory, svgContent: string): void {
  if (injectedSprites.has(category)) {
    return; // Already injected
  }

  // Get or create the main SVG sprite container
  let spriteContainer = document.getElementById('ffxi-sprite-container') as null | SVGSVGElement;
  if (!spriteContainer) {
    spriteContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    spriteContainer.id = 'ffxi-sprite-container';
    spriteContainer.style.display = 'none';
    spriteContainer.setAttribute('aria-hidden', 'true');
    document.body.appendChild(spriteContainer);
  }

  // Safari-compatible SVG parsing using DOMParser instead of innerHTML
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');

  // Extract symbols from the parsed document
  const symbols = svgDoc.querySelectorAll('symbol');
  symbols.forEach(symbol => {
    // Create a new symbol element in the main document namespace
    const newSymbol = document.createElementNS('http://www.w3.org/2000/svg', 'symbol');

    // Copy all attributes from the original symbol
    for (let i = 0; i < symbol.attributes.length; i++) {
      const attr = symbol.attributes[i];
      // Skip namespace prefixes that Safari doesn't handle well
      if (!attr.name.startsWith('xmlns:')) {
        newSymbol.setAttribute(attr.name, attr.value);
      }
    }

    // Copy inner content by recreating image elements for Safari compatibility
    const images = symbol.querySelectorAll('image');
    images.forEach(img => {
      const newImage = document.createElementNS('http://www.w3.org/2000/svg', 'image');
      // Copy image attributes
      for (let i = 0; i < img.attributes.length; i++) {
        const attr = img.attributes[i];
        newImage.setAttribute(attr.name, attr.value);
      }
      newSymbol.appendChild(newImage);
    });

    spriteContainer.appendChild(newSymbol);
  });

  injectedSprites.add(category);
}

/**
 * Set loading state for a category
 */
function setLoadingState(category: IconCategory, state: Partial<IconLoadingState>): void {
  const currentState = getLoadingState(category);
  loadingStates.set(category, {...currentState, ...state});
}
