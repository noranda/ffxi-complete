/**
 * Left Sidebar Component
 *
 * Desktop-only navigation sidebar that displays current character information
 * and provides independent scrolling behavior. Hidden on mobile devices
 * where bottom navigation is used instead.
 */

import type {Character} from '@/types';

import {Typography} from '@/components/ui';
import {cn} from '@/lib/utils';

/**
 * Props for the LeftSidebar component
 */
export type LeftSidebarProps = {
  character?: Character;
  className?: string;
};

/**
 * Character portrait configuration
 */
const CHARACTER_PORTRAIT = {
  ALT_TEXT: (name: string) => `${name} portrait`,
  PLACEHOLDER_URL: '/src/assets/portraits/elvaan/female/portrait-elvaan-female-face1-hairA.jpg',
  SIZE_CLASSES: 'h-16 w-16',
} as const;

/**
 * Character placeholder configuration
 */
const CHARACTER_PLACEHOLDER = {
  ICON_TEXT: 'No',
  MESSAGE: 'No character selected',
  SIZE_CLASSES: 'h-16 w-16',
} as const;

/**
 * Generate character portrait URL based on character data
 * Currently returns placeholder - will be enhanced when portrait system is implemented
 */
const getCharacterPortraitUrl = (_character: Character): string => CHARACTER_PORTRAIT.PLACEHOLDER_URL;

/**
 * Format character server information for display
 */
const formatServerInfo = (character: Character): string => character.server || 'Unknown Server';

/**
 * Character Display Component
 * Renders character information including portrait, name, and server
 */
type CharacterDisplayProps = {
  character: Character;
};

const CharacterDisplay: React.FC<CharacterDisplayProps> = ({character}) => (
  <div className="space-y-3" data-testid="character-display">
    {/* Character Portrait */}
    <div className="flex justify-center">
      <img
        alt={CHARACTER_PORTRAIT.ALT_TEXT(character.name)}
        className={cn(CHARACTER_PORTRAIT.SIZE_CLASSES, 'border-border bg-muted rounded-full border-2 object-cover')}
        data-testid="character-portrait"
        src={getCharacterPortraitUrl(character)}
      />
    </div>

    {/* Character Name */}
    <div className="text-center">
      <Typography className="text-card-foreground font-medium" data-testid="character-name" variant="h3">
        {character.name}
      </Typography>

      <Typography className="text-muted-foreground text-sm" data-testid="character-server" variant="p">
        {formatServerInfo(character)}
      </Typography>
    </div>

    {/* Character Details */}
    <div className="text-center">
      <Typography className="text-muted-foreground text-sm" data-testid="character-details" variant="p">
        Character ID: {character.id.slice(0, 8)}
      </Typography>
    </div>
  </div>
);

/**
 * Character Placeholder Component
 * Renders placeholder when no character is selected
 */
const CharacterPlaceholder: React.FC = () => (
  <div className="space-y-3 text-center" data-testid="character-placeholder">
    <div className="flex justify-center">
      <span className="text-muted-foreground text-xs">{CHARACTER_PLACEHOLDER.ICON_TEXT}</span>
    </div>

    <Typography className="text-muted-foreground text-sm" variant="p">
      {CHARACTER_PLACEHOLDER.MESSAGE}
    </Typography>
  </div>
);

/**
 * Left sidebar component for desktop character navigation
 *
 * Features:
 * - Responsive design (hidden on mobile, visible on desktop)
 * - Character display with portrait and details
 * - Independent scrolling behavior
 * - Proper accessibility attributes
 * - Integration with MainLayout system
 */
export const LeftSidebar: React.FC<LeftSidebarProps> = ({character, className}) => (
  <aside
    aria-label="Character navigation"
    className={cn(
      // Responsive behavior - hidden on mobile, visible on desktop
      'hidden md:flex',
      // Layout structure
      'flex-col',
      // Dimensions
      'h-full md:w-64',
      // Scrolling behavior
      'overflow-auto',
      // Styling
      'bg-card border-border border-r',
      // Padding
      'p-4',
      className
    )}
    data-testid="left-sidebar"
    role="complementary"
  >
    {/* Character Section */}
    <div className="space-y-4">
      <Typography className="text-card-foreground text-lg font-semibold" variant="h2">
        Character
      </Typography>

      {character ? <CharacterDisplay character={character} /> : <CharacterPlaceholder />}
    </div>

    {/* Future: Navigation items will go here */}
    {/* Future: Character switching controls will go here */}
  </aside>
);
