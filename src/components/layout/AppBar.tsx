/**
 * App Bar Component
 *
 * Sticky app bar with branding, user controls, and collection settings toggle.
 * Follows XIV-Complete design patterns with turquoise base color and glass morphism effects.
 *
 * Features:
 * - Responsive glass morphism design with turquoise theme
 * - User authentication state management
 * - Collection settings toggle with active states
 * - Mobile-first responsive layout
 * - Full accessibility support with ARIA attributes
 * - Keyboard navigation support
 */

import {faCog} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import {UserMenu} from '@/components/auth/UserMenu';
import {Button} from '@/components/ui/button';
import {cn} from '@/lib/utils';

/**
 * Props for the AppBar component
 */
export type AppBarProps = {
  className?: string;
  isCollectionSettingsOpen?: boolean;
  onCollectionSettingsToggle?: () => void;
  onLoginClick?: () => void;
  user?: null | User;
};

/**
 * User object type for authentication state
 */
export type User = {
  email: string;
  id: string;
};

/**
 * Sticky app bar component with XIV-Complete design patterns
 *
 * Implements a modern glass morphism design with turquoise theming,
 * responsive layout, and comprehensive accessibility support.
 */
export const AppBar: React.FC<AppBarProps> = ({
  className,
  isCollectionSettingsOpen = false,
  onCollectionSettingsToggle,
  onLoginClick,
  user = null,
}) => (
  <header
    className={cn(
      // Positioning and layout - absolute positioning to ensure full width
      'fixed top-0 right-0 left-0 z-50 w-full',
      // Glass morphism with turquoise theme
      'bg-teal-900/80 backdrop-blur-md',
      // Border only
      'border-b border-teal-700/30',
      className
    )}
    data-testid="app-bar"
    role="banner"
  >
    <div className="flex items-center justify-between px-4 py-3 md:px-6">
      {/* Branding */}
      <div className="flex items-center space-x-3">
        <h1 className="text-lg font-bold text-teal-100">
          <span className="hidden sm:block">FFXI Complete</span>
        </h1>
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-3">
        {/* Collection Settings Toggle */}
        <Button
          aria-label="Toggle collection settings"
          className={cn(
            'h-9 w-9 p-0',
            isCollectionSettingsOpen ? 'bg-teal-700 hover:bg-teal-600' : 'bg-teal-800 hover:bg-teal-700'
          )}
          data-testid="collection-settings-toggle"
          onClick={onCollectionSettingsToggle}
          onKeyDown={event => {
            if (event.key === 'Enter') {
              onCollectionSettingsToggle?.();
            }
          }}
          size="sm"
          variant="ghost"
        >
          <FontAwesomeIcon className="h-4 w-4 text-teal-100" icon={faCog} />
        </Button>

        {/* User Controls */}
        {user ? (
          <div data-testid="user-menu-trigger">
            <UserMenu />
          </div>
        ) : (
          <Button className="bg-teal-700 text-teal-100 hover:bg-teal-600" onClick={onLoginClick}>
            Sign In
          </Button>
        )}
      </div>
    </div>
  </header>
);
