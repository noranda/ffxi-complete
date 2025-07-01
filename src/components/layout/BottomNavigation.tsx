/**
 * Bottom Navigation Component
 *
 * Mobile navigation component that replaces the sidebar on mobile devices.
 * Provides character controls and quick navigation to main sections.
 * Fixed at bottom of screen with safe area handling for mobile devices.
 */

import type {Character} from '@/types';

import {Button} from '@/components/ui';
import {cn} from '@/lib/utils';

/**
 * Props for the BottomNavigation component
 */
export type BottomNavigationProps = {
  activeTab?: string;
  character?: Character;
  className?: string;
  onTabChange?: (tab: string) => void;
};

/**
 * Navigation tab type
 */
type NavigationTab = {
  readonly id: string;
  readonly label: string;
};

/**
 * Available navigation tabs
 */
const NAVIGATION_TABS: readonly NavigationTab[] = [
  {id: 'jobs', label: 'Jobs'},
  {id: 'skills', label: 'Skills'},
  {id: 'trusts', label: 'Trusts'},
] as const;

/**
 * Character portrait configuration
 */
const CHARACTER_PORTRAIT = {
  ALT_TEXT: (name: string) => `${name} portrait`,
  PLACEHOLDER_URL: '/src/assets/portraits/elvaan/female/portrait-elvaan-female-face1-hairA.jpg',
  SIZE_CLASSES: 'h-8 w-8',
} as const;

/**
 * Character control button configuration
 */
const CHARACTER_CONTROLS = {
  MENU: {
    ICON: '⋯',
    LABEL: 'Character menu',
    TEST_ID: 'character-menu-button',
  },
  SWITCH: {
    ICON: '↕',
    LABEL: 'Switch character',
    TEST_ID: 'character-switch-button',
  },
} as const;

/**
 * Generate character portrait URL based on character data
 * Currently returns placeholder - will be enhanced when portrait system is implemented
 */
const getCharacterPortraitUrl = (_character: Character): string => CHARACTER_PORTRAIT.PLACEHOLDER_URL;

/**
 * Character Display Component for Bottom Navigation
 * Compact display for mobile layout
 */
type CharacterDisplayProps = {
  character: Character;
};

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({character}) => (
  <div className="flex items-center space-x-2" data-testid="character-display">
    <img
      alt={CHARACTER_PORTRAIT.ALT_TEXT(character.name)}
      className={cn(CHARACTER_PORTRAIT.SIZE_CLASSES, 'border-border bg-muted rounded-full border object-cover')}
      data-testid="character-portrait"
      src={getCharacterPortraitUrl(character)}
    />

    <div className="text-card-foreground text-xs font-medium" data-testid="character-name">
      {character.name}
    </div>
  </div>
);

/**
 * Character Placeholder Component
 * Compact placeholder for mobile layout
 */
const CharacterPlaceholder: React.FC = () => (
  <div className="flex items-center space-x-2" data-testid="character-placeholder">
    <div className={cn(CHARACTER_PORTRAIT.SIZE_CLASSES, 'border-border bg-muted rounded-full border')} />

    <div className="text-muted-foreground text-xs">No character</div>
  </div>
);

/**
 * Character Controls Component
 * Renders character control buttons (switch, menu)
 */
type CharacterControlsProps = {
  hasCharacter: boolean;
};

const CharacterControls: React.FC<CharacterControlsProps> = ({hasCharacter}) => (
  <div className="flex items-center space-x-1">
    <Button
      aria-label={CHARACTER_CONTROLS.SWITCH.LABEL}
      className="h-6 w-6 p-1 text-xs"
      data-testid={CHARACTER_CONTROLS.SWITCH.TEST_ID}
      disabled={!hasCharacter}
      size="icon"
      variant="secondary"
    >
      {CHARACTER_CONTROLS.SWITCH.ICON}
    </Button>

    <Button
      aria-label={CHARACTER_CONTROLS.MENU.LABEL}
      className="h-6 w-6 p-1 text-xs"
      data-testid={CHARACTER_CONTROLS.MENU.TEST_ID}
      disabled={!hasCharacter}
      size="icon"
      variant="secondary"
    >
      {CHARACTER_CONTROLS.MENU.ICON}
    </Button>
  </div>
);

/**
 * Bottom navigation component for mobile character navigation and controls
 *
 * Features:
 * - Responsive design (visible on mobile, hidden on desktop)
 * - Character display with compact layout
 * - Character control buttons (switch, menu)
 * - Quick navigation tabs for main sections
 * - Fixed positioning at bottom with safe area support
 * - Proper accessibility attributes and keyboard navigation
 */
export const BottomNavigation: React.FC<BottomNavigationProps> = ({activeTab, character, className, onTabChange}) => (
  <nav
    aria-label="Bottom navigation"
    className={cn(
      // Responsive behavior - visible on mobile, hidden on desktop
      'block md:hidden',
      // Fixed positioning at bottom
      'fixed right-0 bottom-0 left-0',
      // Layout and dimensions
      'w-full',
      // Safe area for mobile devices
      'pb-safe',
      // Styling
      'bg-card border-border border-t',
      // Z-index for overlay
      'z-50',
      // Padding
      'px-4 py-2',
      className
    )}
    data-testid="bottom-navigation"
    role="navigation"
  >
    <div className="flex items-center justify-between">
      {/* Character Section */}
      <div className="flex items-center space-x-3">
        {/* Character Display */}
        {character ? <CharacterDisplay character={character} /> : <CharacterPlaceholder />}

        {/* Character Controls */}
        <CharacterControls hasCharacter={Boolean(character)} />
      </div>

      {/* Navigation Tabs */}
      <div className="flex" role="tablist">
        {NAVIGATION_TABS.map(tab => (
          <Button
            aria-current={activeTab === tab.id ? 'page' : undefined}
            className="text-xs"
            data-testid={`nav-${tab.id}`}
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            role="tab"
            size="sm"
            variant={activeTab === tab.id ? 'secondary' : 'ghost'}
          >
            {tab.label}
          </Button>
        ))}
      </div>
    </div>
  </nav>
);
