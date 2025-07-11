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

import {faCog, faIcons} from '@fortawesome/free-solid-svg-icons';
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
      'flex h-full items-center justify-between bg-[#21252a] px-4 py-3 backdrop-blur-md md:px-6',
      className
    )}
    data-testid="app-bar"
    role="banner"
  >
    {/* Branding */}
    <div className="flex items-center space-x-3">
      <h1 className="text-lg font-bold">
        <a className="transition-colors hover:text-cyan-300" href="/">
          <span className="hidden sm:block">FFXI Complete</span>
        </a>
      </h1>
    </div>

    {/* Controls */}
    <div className="flex items-center space-x-3">
      {/* Icon Library Link (Development) */}
      {import.meta.env.DEV && (
        <Button
          aria-label="View icon library"
          className="h-9 w-9 bg-slate-700 p-0 hover:bg-slate-600"
          data-testid="icon-library-link"
          onClick={() => window.open('/icons', '_blank')}
          size="sm"
          variant="ghost"
        >
          <FontAwesomeIcon className="h-4 w-4 text-slate-300" icon={faIcons} />
        </Button>
      )}

      {/* Collection Settings Toggle */}
      <Button
        aria-label="Toggle collection settings"
        className={cn(
          'h-9 w-9 p-0',
          isCollectionSettingsOpen ? 'bg-cyan-700 hover:bg-cyan-600' : 'bg-cyan-800 hover:bg-cyan-700'
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
        <FontAwesomeIcon className="h-4 w-4 text-cyan-100" icon={faCog} />
      </Button>

      {/* User Controls */}
      {user ? (
        <div data-testid="user-menu-trigger">
          <UserMenu />
        </div>
      ) : (
        <Button className="bg-cyan-700 text-cyan-100 hover:bg-cyan-600" onClick={onLoginClick}>
          Sign In
        </Button>
      )}
    </div>
  </header>
);
