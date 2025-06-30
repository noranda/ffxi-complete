/**
 * Tests for LeftSidebar component
 *
 * Testing strategy:
 * - Component renders correctly with character data
 * - Responsive behavior (hidden on mobile, visible on desktop)
 * - Independent scrolling behavior
 * - Character display functionality
 * - Integration with layout system
 */

import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import type {Character} from '@/types';

import {LeftSidebar} from '../LeftSidebar';

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

describe('LeftSidebar', () => {
  describe('rendering', () => {
    it('should render with character data', () => {
      render(<LeftSidebar character={mockCharacter} />);

      expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
      expect(screen.getByText('TestChar')).toBeInTheDocument();
      expect(screen.getByText('Bahamut')).toBeInTheDocument();
    });

    it('should render without character data', () => {
      render(<LeftSidebar />);

      expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
      expect(screen.getByText('No character selected')).toBeInTheDocument();
    });

    it('should apply custom className', () => {
      render(<LeftSidebar character={mockCharacter} className="custom-class" />);

      const sidebar = screen.getByTestId('left-sidebar');
      expect(sidebar).toHaveClass('custom-class');
    });
  });

  describe('responsive behavior', () => {
    it('should be hidden on mobile screens', () => {
      render(<LeftSidebar character={mockCharacter} />);

      const sidebar = screen.getByTestId('left-sidebar');
      // Should have classes that hide on mobile and show on desktop
      expect(sidebar).toHaveClass('hidden', 'md:flex');
    });

    it('should have proper width on desktop', () => {
      render(<LeftSidebar character={mockCharacter} />);

      const sidebar = screen.getByTestId('left-sidebar');
      // Should have fixed width on desktop
      expect(sidebar).toHaveClass('md:w-64');
    });
  });

  describe('scrolling behavior', () => {
    it('should have independent scrolling', () => {
      render(<LeftSidebar character={mockCharacter} />);

      const sidebar = screen.getByTestId('left-sidebar');
      // Should have overflow-auto for independent scrolling
      expect(sidebar).toHaveClass('overflow-auto');
    });

    it('should have proper height for scrolling', () => {
      render(<LeftSidebar character={mockCharacter} />);

      const sidebar = screen.getByTestId('left-sidebar');
      // Should use full height for proper scrolling
      expect(sidebar).toHaveClass('h-full');
    });
  });

  describe('character display', () => {
    it('should display character portrait when character exists', () => {
      render(<LeftSidebar character={mockCharacter} />);

      const portrait = screen.getByTestId('character-portrait');
      expect(portrait).toBeInTheDocument();
      expect(portrait).toHaveAttribute('alt', 'TestChar portrait');
    });

    it('should display character name and server', () => {
      render(<LeftSidebar character={mockCharacter} />);

      expect(screen.getByTestId('character-name')).toHaveTextContent('TestChar');
      expect(screen.getByTestId('character-server')).toHaveTextContent('Bahamut');
    });

    it('should show placeholder when no character', () => {
      render(<LeftSidebar />);

      expect(screen.getByTestId('character-placeholder')).toBeInTheDocument();
      expect(screen.queryByTestId('character-portrait')).not.toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<LeftSidebar character={mockCharacter} />);

      const sidebar = screen.getByTestId('left-sidebar');
      expect(sidebar).toHaveAttribute('role', 'complementary');
      expect(sidebar).toHaveAttribute('aria-label', 'Character navigation');
    });

    it('should have proper heading structure', () => {
      render(<LeftSidebar character={mockCharacter} />);

      const heading = screen.getByRole('heading', {level: 2});
      expect(heading).toHaveTextContent('Character');
    });
  });

  describe('integration', () => {
    it('should work within MainLayout', () => {
      // This test ensures the component integrates properly with the layout system
      render(<LeftSidebar character={mockCharacter} />);

      const sidebar = screen.getByTestId('left-sidebar');
      // Should have proper positioning classes for layout integration
      expect(sidebar).toHaveClass('flex-col');
    });
  });
});
