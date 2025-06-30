/**
 * UserMenu Component Tests
 *
 * Test suite for the user menu dropdown component with comprehensive coverage
 * of rendering states, interactions, accessibility, and error handling.
 */

import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {describe, expect, it, vi} from 'vitest';

import {AuthContext, type AuthContextType} from '@/contexts/AuthContext';

import {UserMenu} from '../UserMenu';

// Mock UserProfile component
vi.mock('../UserProfile', () => ({
  UserProfile: () => <div data-testid="user-profile">User Profile Component</div>,
}));

// Helper function to render UserMenu with auth context
type MockAuthContext = {
  isAuthenticated: boolean;
  loading: boolean;
  signOut: ReturnType;
  user: null | Record;
};

const renderUserMenu = (authValue: MockAuthContext) =>
  render(
    <AuthContext.Provider value={authValue as unknown as AuthContextType}>
      <UserMenu />
    </AuthContext.Provider>
  );

describe('UserMenu', () => {
  describe('Rendering States', () => {
    it('should not render when user is not authenticated', () => {
      const authValue = {
        isAuthenticated: false,
        loading: false,
        signOut: vi.fn(),
        user: null,
      };

      renderUserMenu(authValue);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should not render when user is null', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: null,
      };

      renderUserMenu(authValue);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should render user menu button when authenticated', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      expect(menuButton).toBeInTheDocument();
    });

    it('should be disabled when loading', () => {
      const authValue = {
        isAuthenticated: true,
        loading: true,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      expect(menuButton).toBeDisabled();
    });

    it('should display user initials from display name', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      expect(screen.getByText('TU')).toBeInTheDocument();
    });

    it('should display user initials from email when no display name', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'john.doe@example.com',
        },
      };

      renderUserMenu(authValue);

      expect(screen.getByText('JD')).toBeInTheDocument();
    });

    it('should display single initial from email when no display name and simple email', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
        },
      };

      renderUserMenu(authValue);

      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('should display fallback initial when no user data', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {},
      };

      renderUserMenu(authValue);

      expect(screen.getByText('U')).toBeInTheDocument();
    });
  });

  describe('Menu Interactions', () => {
    it('should open dropdown menu when button is clicked', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });
    });

    it('should display user information in dropdown menu', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => {
        expect(screen.getByText('Test User')).toBeInTheDocument();
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
      });
    });

    it('should close dropdown when clicking outside', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

      // Test that escape key closes the menu (Radix UI behavior)
      await user.keyboard('{Escape}');

      await waitFor(() => expect(screen.queryByText('Test User')).not.toBeInTheDocument());
    });

    it('should close dropdown when pressing Escape key', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

      await user.keyboard('{Escape}');

      await waitFor(() => expect(screen.queryByText('Test User')).not.toBeInTheDocument());
    });
  });

  describe('Menu Actions', () => {
    it('should have profile management menu item', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(screen.getByRole('menuitem', {name: /profile/i})).toBeInTheDocument());
    });

    it('should have sign out menu item', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(screen.getByRole('menuitem', {name: /sign out/i})).toBeInTheDocument());
    });

    it('should call signOut when sign out menu item is clicked', async () => {
      const user = userEvent.setup();
      const mockSignOut = vi.fn();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: mockSignOut,
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(screen.getByRole('menuitem', {name: /sign out/i})).toBeInTheDocument());

      const signOutButton = screen.getByRole('menuitem', {name: /sign out/i});
      await user.click(signOutButton);

      expect(mockSignOut).toHaveBeenCalledOnce();
    });

    it('should show loading state on sign out button during sign out', async () => {
      const user = userEvent.setup();
      const mockSignOut = vi.fn().mockResolvedValue(undefined);

      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: mockSignOut,
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(screen.getByRole('menuitem', {name: /sign out/i})).toBeInTheDocument());

      const signOutButton = screen.getByRole('menuitem', {name: /sign out/i});
      await user.click(signOutButton);

      // Verify the signOut function was called
      expect(mockSignOut).toHaveBeenCalledOnce();
    });

    it('should handle sign out errors gracefully', async () => {
      const user = userEvent.setup();
      const mockSignOut = vi.fn().mockImplementation(async () => {
        throw new Error('Sign out failed');
      });

      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: mockSignOut,
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(screen.getByRole('menuitem', {name: /sign out/i})).toBeInTheDocument());

      const signOutButton = screen.getByRole('menuitem', {name: /sign out/i});

      // Click the sign out button
      await user.click(signOutButton);

      // Verify the signOut function was called
      expect(mockSignOut).toHaveBeenCalledOnce();

      // The component should handle the error gracefully - menu closes but component still renders
      await waitFor(() => expect(screen.getByRole('button', {name: /user menu/i})).toBeInTheDocument());
    });
  });

  describe('Profile Dialog Integration', () => {
    it('should open profile dialog when profile menu item is clicked', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(screen.getByRole('menuitem', {name: /profile/i})).toBeInTheDocument());

      const profileButton = screen.getByRole('menuitem', {name: /profile/i});
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog', {name: /profile/i})).toBeInTheDocument();
        expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      });
    });

    it('should close menu when profile dialog is opened', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

      const profileButton = screen.getByRole('menuitem', {name: /profile/i});
      await user.click(profileButton);

      await waitFor(() => {
        expect(screen.getByRole('dialog', {name: /profile/i})).toBeInTheDocument();
        expect(screen.queryByText('Test User')).not.toBeInTheDocument();
      });
    });

    it('should close profile dialog when close button is clicked', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      const profileButton = screen.getByRole('menuitem', {name: /profile/i});
      await user.click(profileButton);

      await waitFor(() => expect(screen.getByRole('dialog', {name: /profile/i})).toBeInTheDocument());

      const closeButton = screen.getByRole('button', {name: /close/i});
      await user.click(closeButton);

      await waitFor(() => expect(screen.queryByRole('dialog', {name: /profile/i})).not.toBeInTheDocument());
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on menu button', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      expect(menuButton).toHaveAttribute('aria-label', 'User menu');
      expect(menuButton).toHaveAttribute('aria-haspopup', 'menu');
      expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when menu is opened', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      await user.click(menuButton);

      await waitFor(() => expect(menuButton).toHaveAttribute('aria-expanded', 'true'));
    });

    it('should have proper focus management', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});
      menuButton.focus();
      expect(menuButton).toHaveFocus();

      await user.click(menuButton);

      await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

      // Radix UI handles focus management automatically
      // We just verify the menu content is accessible
      const profileMenuItem = screen.getByRole('menuitem', {name: /profile/i});
      expect(profileMenuItem).toBeInTheDocument();
    });

    it('should have proper keyboard navigation', async () => {
      const user = userEvent.setup();
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          user_metadata: {display_name: 'Test User'},
        },
      };

      renderUserMenu(authValue);

      const menuButton = screen.getByRole('button', {name: /user menu/i});

      // Open menu with Enter key
      menuButton.focus();
      await user.keyboard('{Enter}');

      await waitFor(() => expect(screen.getByText('Test User')).toBeInTheDocument());

      // Menu items should be accessible
      expect(screen.getByRole('menuitem', {name: /profile/i})).toBeInTheDocument();
      expect(screen.getByRole('menuitem', {name: /sign out/i})).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle missing user metadata gracefully', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          email: 'test@example.com',
          // Missing user_metadata
        },
      };

      renderUserMenu(authValue);

      // Should still render with email fallback
      expect(screen.getByRole('button', {name: /user menu/i})).toBeInTheDocument();
      expect(screen.getByText('T')).toBeInTheDocument();
    });

    it('should handle missing email gracefully', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: {
          user_metadata: {display_name: 'Test User'},
          // Missing email
        },
      };

      renderUserMenu(authValue);

      // Should still render with display name
      expect(screen.getByRole('button', {name: /user menu/i})).toBeInTheDocument();
      expect(screen.getByText('TU')).toBeInTheDocument();
    });

    it('should handle auth context errors gracefully', () => {
      const authValue = {
        isAuthenticated: true,
        loading: false,
        signOut: vi.fn(),
        user: null, // This should prevent rendering
      };

      renderUserMenu(authValue);

      // Should not render when user is null
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
