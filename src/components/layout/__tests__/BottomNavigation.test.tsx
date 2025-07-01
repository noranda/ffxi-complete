/**
 * Tests for BottomNavigation component
 *
 * Testing strategy:
 * - Component renders correctly with character data
 * - Responsive behavior (visible on mobile, hidden on desktop)
 * - Character controls functionality
 * - Navigation items and interactions
 * - Integration with layout system
 */

import {fireEvent, render, screen} from '@testing-library/react';
import {describe, expect, it, vi} from 'vitest';

import type {Character} from '@/types';

import {BottomNavigation} from '../BottomNavigation';

// Mock character data for testing
const mockCharacter: Character = {
  created_at: '2024-01-01T00:00:00Z',
  id: 'test-character-id',
  is_public: false,
  name: 'TestChar',
  privacy_updated_at: '2024-01-01T00:00:00Z',
  public_url_slug: 'testchar-bahamut',
  server: 'Bahamut',
  updated_at: '2024-01-01T00:00:00Z',
  user_id: 'test-user-id',
};

describe('BottomNavigation', () => {
  describe('rendering', () => {
    it('should render with character data', () => {
      render(<BottomNavigation character={mockCharacter} />);

      expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();
      expect(screen.getByText('TestChar')).toBeInTheDocument();
    });

    it('should render without character data', () => {
      render(<BottomNavigation />);

      expect(screen.getByTestId('bottom-navigation')).toBeInTheDocument();
      expect(screen.getByText('No character')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<BottomNavigation character={mockCharacter} className="custom-class" />);

      const navigation = screen.getByTestId('bottom-navigation');
      expect(navigation).toHaveClass('custom-class');
    });
  });

  describe('responsive behavior', () => {
    it('should be visible on mobile screens', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const navigation = screen.getByTestId('bottom-navigation');
      // Should be visible on mobile, hidden on desktop (opposite of sidebar)
      expect(navigation).toHaveClass('block', 'md:hidden');
    });

    it('should be fixed at bottom of screen', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const navigation = screen.getByTestId('bottom-navigation');
      // Should be fixed at bottom
      expect(navigation).toHaveClass('fixed', 'bottom-0');
    });

    it('should span full width', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const navigation = screen.getByTestId('bottom-navigation');
      // Should span full width
      expect(navigation).toHaveClass('w-full');
    });
  });

  describe('character display', () => {
    it('should display character portrait when character exists', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const portrait = screen.getByTestId('character-portrait');
      expect(portrait).toBeInTheDocument();
      expect(portrait).toHaveAttribute('alt', 'TestChar portrait');
    });

    it('should display character name', () => {
      render(<BottomNavigation character={mockCharacter} />);

      expect(screen.getByTestId('character-name')).toHaveTextContent('TestChar');
    });

    it('should show placeholder when no character', () => {
      render(<BottomNavigation />);

      expect(screen.getByTestId('character-placeholder')).toBeInTheDocument();
      expect(screen.queryByTestId('character-portrait')).not.toBeInTheDocument();
    });
  });

  describe('character controls', () => {
    it('should display character switch button', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const switchButton = screen.getByTestId('character-switch-button');
      expect(switchButton).toBeInTheDocument();
      expect(switchButton).toHaveAttribute('aria-label', 'Switch character');
    });

    it('should display character menu button', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const menuButton = screen.getByTestId('character-menu-button');
      expect(menuButton).toBeInTheDocument();
      expect(menuButton).toHaveAttribute('aria-label', 'Character menu');
    });

    it('should be disabled when no character', () => {
      render(<BottomNavigation />);

      const switchButton = screen.getByTestId('character-switch-button');
      const menuButton = screen.getByTestId('character-menu-button');

      expect(switchButton).toBeDisabled();
      expect(menuButton).toBeDisabled();
    });
  });

  describe('navigation items', () => {
    it('should display navigation tabs', () => {
      render(<BottomNavigation character={mockCharacter} />);

      // Should have navigation tabs for main sections
      expect(screen.getByTestId('nav-jobs')).toBeInTheDocument();
      expect(screen.getByTestId('nav-skills')).toBeInTheDocument();
      expect(screen.getByTestId('nav-trusts')).toBeInTheDocument();
    });

    it('should show active navigation state', () => {
      render(<BottomNavigation activeTab="jobs" character={mockCharacter} />);

      const jobsTab = screen.getByTestId('nav-jobs');
      expect(jobsTab).toHaveAttribute('aria-current', 'page');
    });

    it('should handle tab navigation', () => {
      const mockOnTabChange = vi.fn();
      render(<BottomNavigation character={mockCharacter} onTabChange={mockOnTabChange} />);

      const skillsTab = screen.getByTestId('nav-skills');
      fireEvent.click(skillsTab);

      expect(mockOnTabChange).toHaveBeenCalledWith('skills');
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const navigation = screen.getByTestId('bottom-navigation');
      expect(navigation).toHaveAttribute('role', 'navigation');
      expect(navigation).toHaveAttribute('aria-label', 'Bottom navigation');
    });

    it('should have proper tab navigation', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const tabList = screen.getByRole('tablist');
      expect(tabList).toBeInTheDocument();

      const tabs = screen.getAllByRole('tab');
      expect(tabs).toHaveLength(3); // jobs, skills, trusts
    });

    it('should support keyboard navigation', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const firstTab = screen.getByTestId('nav-jobs');
      firstTab.focus();

      expect(firstTab).toHaveFocus();
    });
  });

  describe('z-index layering', () =>
    it('should have proper z-index for bottom overlay', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const navigation = screen.getByTestId('bottom-navigation');
      // Should have high z-index to stay above content
      expect(navigation).toHaveClass('z-50');
    }));

  describe('integration', () => {
    it('should work within MainLayout footer area', () => {
      // This test ensures the component integrates properly with the layout system
      render(<BottomNavigation character={mockCharacter} />);

      const navigation = screen.getByTestId('bottom-navigation');
      // Should have proper styling for footer integration
      expect(navigation).toHaveClass('bg-card', 'border-border');
    });

    it('should provide safe area for mobile devices', () => {
      render(<BottomNavigation character={mockCharacter} />);

      const navigation = screen.getByTestId('bottom-navigation');
      // Should account for mobile safe areas
      expect(navigation).toHaveClass('pb-safe');
    });
  });
});
