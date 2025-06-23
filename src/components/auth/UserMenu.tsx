/**
 * User Menu Component
 *
 * Dropdown menu for authenticated users providing access to profile
 * management and sign out functionality. Displays user avatar with
 * initials and provides accessible menu interactions.
 */

import {useState} from 'react';

import {Button, Dialog, DropdownMenu} from '@/components/ui';
import {useAuth} from '@/contexts/AuthContext';

import {UserProfile} from './UserProfile';

/**
 * Generates user initials from display name or email
 *
 * Priority order:
 * 1. Display name (first letter of each word, max 2)
 * 2. Email (first letters of parts before @, or first letter)
 * 3. Fallback to 'U' for User
 */
const getUserInitials = (user: {email?: string; user_metadata?: {display_name?: string}}): string => {
  const displayName = user.user_metadata?.display_name;

  if (displayName) {
    return displayName
      .split(' ')
      .map(name => name.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  }

  if (user.email) {
    const emailParts = user.email.split('@')[0].split('.');
    if (emailParts.length >= 2) {
      return (emailParts[0].charAt(0) + emailParts[1].charAt(0)).toUpperCase();
    }
    return user.email.charAt(0).toUpperCase();
  }

  return 'U';
};

/**
 * User menu component for app bar
 *
 * Provides dropdown menu with user profile actions including:
 * - User information display
 * - Profile management dialog
 * - Sign out functionality
 * - Proper accessibility and keyboard navigation
 */
export const UserMenu: React.FC = () => {
  const {isAuthenticated, loading, signOut, user} = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleProfileOpen = () => setIsProfileOpen(true);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    try {
      await signOut();
    } catch (error) {
      // Log error for debugging but don't throw it
      console.error('Sign out error:', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Don't render if not authenticated or no user
  if (!isAuthenticated || !user) {
    return null;
  }

  const userInitials = getUserInitials(user);
  const displayName = user.user_metadata?.display_name || user.email || 'User';

  return (
    <>
      <DropdownMenu>
        <DropdownMenu.Trigger asChild>
          <Button
            aria-label="User menu"
            className="h-8 w-8 rounded-full p-0"
            disabled={loading}
            size="sm"
            variant="ghost"
          >
            <div className="bg-primary text-primary-foreground flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium">
              {userInitials}
            </div>
          </Button>
        </DropdownMenu.Trigger>

        <DropdownMenu.Content align="end" className="w-56">
          <DropdownMenu.Label>
            <div className="flex flex-col space-y-1">
              <div className="text-sm leading-none font-medium">{displayName}</div>
              <div className="text-muted-foreground text-xs leading-none">{user.email}</div>
            </div>
          </DropdownMenu.Label>

          <DropdownMenu.Separator />

          <DropdownMenu.Item onClick={handleProfileOpen}>Profile</DropdownMenu.Item>

          <DropdownMenu.Separator />

          <DropdownMenu.Item disabled={isSigningOut} onClick={handleSignOut}>
            {isSigningOut ? 'Signing out...' : 'Sign out'}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu>

      {/* Profile Dialog */}
      <Dialog onOpenChange={setIsProfileOpen} open={isProfileOpen}>
        <Dialog.Content className="sm:max-w-md">
          <Dialog.Header>
            <Dialog.Title>Profile</Dialog.Title>
          </Dialog.Header>
          <UserProfile />
        </Dialog.Content>
      </Dialog>
    </>
  );
};
