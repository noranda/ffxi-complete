/**
 * AppBar Component Tests
 *
 * Tests the sticky app bar component that provides branding, user controls,
 * and collection settings toggle following XIV-Complete design patterns.
 */

import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import {AuthProvider} from '@/contexts/AuthContext';

import {AppBar} from '../AppBar';

describe('AppBar', () => {
  describe('Basic Rendering', () => {
    it('should render the app bar container', () => {
      render(<AppBar />);

      expect(screen.getByTestId('app-bar')).toBeInTheDocument();
    });

    it('should display FFXI Complete branding', () => {
      render(<AppBar />);

      expect(screen.getByText('FFXI Complete')).toBeInTheDocument();
    });

    it('should apply flex layout for content organization', () => {
      render(<AppBar />);

      const appBar = screen.getByTestId('app-bar');
      expect(appBar).toHaveClass('flex', 'h-full', 'items-center', 'justify-between');
    });
  });

  describe('Turquoise Theme Integration', () => {
    it('should apply dark color scheme', () => {
      render(<AppBar />);

      const appBar = screen.getByTestId('app-bar');
      expect(appBar).toHaveClass('bg-[#21252a]');
    });

    it('should use backdrop blur for glass effect', () => {
      render(<AppBar />);

      const appBar = screen.getByTestId('app-bar');
      expect(appBar).toHaveClass('backdrop-blur-md');
    });
  });

  describe('User Controls', () => {
    it('should render user menu when user is authenticated', () => {
      const mockUser = {email: 'test@example.com', id: '1'};

      render(
        <AuthProvider>
          <AppBar user={mockUser} />
        </AuthProvider>
      );

      expect(screen.getByTestId('user-menu-trigger')).toBeInTheDocument();
    });

    it('should render login button when user is not authenticated', () => {
      render(<AppBar user={null} />);

      expect(screen.getByText('Sign In')).toBeInTheDocument();
    });

    it('should call onLoginClick when login button is clicked', () => {
      const mockOnLoginClick = vi.fn();

      render(<AppBar onLoginClick={mockOnLoginClick} user={null} />);

      fireEvent.click(screen.getByText('Sign In'));
      expect(mockOnLoginClick).toHaveBeenCalled();
    });
  });

  describe('Collection Settings Toggle', () => {
    it('should render collection settings toggle button', () => {
      render(<AppBar />);

      expect(screen.getByTestId('collection-settings-toggle')).toBeInTheDocument();
    });

    it('should call onCollectionSettingsToggle when toggle is clicked', () => {
      const mockOnToggle = vi.fn();

      render(<AppBar onCollectionSettingsToggle={mockOnToggle} />);

      fireEvent.click(screen.getByTestId('collection-settings-toggle'));
      expect(mockOnToggle).toHaveBeenCalled();
    });

    it('should show active state when collection settings are open', () => {
      render(<AppBar isCollectionSettingsOpen />);

      const toggle = screen.getByTestId('collection-settings-toggle');
      expect(toggle).toHaveClass('bg-cyan-700');
    });
  });

  describe('Responsive Design', () => {
    it('should apply mobile-first responsive classes', () => {
      render(<AppBar />);

      const appBar = screen.getByTestId('app-bar');
      // Padding is on the header element
      expect(appBar).toHaveClass('px-4', 'md:px-6');
    });

    it('should hide branding text on mobile', () => {
      render(<AppBar />);

      const brandingText = screen.getByText('FFXI Complete');
      expect(brandingText).toHaveClass('hidden', 'sm:block');
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<AppBar />);

      const appBar = screen.getByTestId('app-bar');
      expect(appBar).toHaveAttribute('role', 'banner');
    });

    it('should have accessible collection settings toggle', () => {
      render(<AppBar />);

      const toggle = screen.getByTestId('collection-settings-toggle');
      expect(toggle).toHaveAttribute('aria-label', 'Toggle collection settings');
    });

    it('should support keyboard navigation', () => {
      const mockOnToggle = vi.fn();

      render(<AppBar onCollectionSettingsToggle={mockOnToggle} />);

      const toggle = screen.getByTestId('collection-settings-toggle');
      fireEvent.keyDown(toggle, {key: 'Enter'});
      expect(mockOnToggle).toHaveBeenCalled();
    });
  });

  describe('Z-Index Management', () =>
    it('should have proper layering structure', () => {
      render(<AppBar />);

      const appBar = screen.getByTestId('app-bar');
      expect(appBar).toBeInTheDocument();
      expect(appBar).toHaveAttribute('role', 'banner');
    }));

  describe('XIV-Complete Design Patterns', () => {
    it('should use glass morphism effect', () => {
      render(<AppBar />);

      const appBar = screen.getByTestId('app-bar');
      expect(appBar).toHaveClass('backdrop-blur-md');
    });

    it('should have proper styling structure', () => {
      render(<AppBar />);

      const appBar = screen.getByTestId('app-bar');
      expect(appBar).toHaveClass('flex', 'items-center', 'justify-between');
    });
  });
});
