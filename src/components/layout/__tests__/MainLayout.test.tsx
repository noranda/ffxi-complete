/**
 * MainLayout Component Tests
 *
 * Tests the main layout component that orchestrates all UI areas including
 * responsive behavior, viewport height management, and layout structure.
 */

import {render, screen} from '@testing-library/react';
import {describe, expect, it} from 'vitest';

import {MainLayout} from '../MainLayout';

describe('MainLayout', () => {
  describe('Basic Rendering', () => {
    it('should render the main layout container', () => {
      render(
        <MainLayout>
          <div data-testid="test-content">Test Content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('main-layout')).toBeInTheDocument();
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });

    it('should render children content', () => {
      const testContent = 'Main layout content';

      render(<MainLayout>{testContent}</MainLayout>);

      expect(screen.getByText(testContent)).toBeInTheDocument();
    });

    it('should apply proper accessibility attributes', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const layout = screen.getByTestId('main-layout');
      expect(layout).toHaveAttribute('role', 'main');
      expect(layout).toHaveAttribute('aria-label', 'Main application layout');
    });
  });

  describe('Viewport Height Management', () => {
    it('should use full viewport height', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const layout = screen.getByTestId('main-layout');
      expect(layout).toHaveClass('min-h-dvh', 'md:min-h-screen');
    });

    it('should handle dynamic viewport height on mobile', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const layout = screen.getByTestId('main-layout');
      // Should use CSS custom properties for dynamic viewport height
      expect(layout).toHaveClass('min-h-dvh', 'md:min-h-screen');
    });

    it('should prevent content overflow', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const layout = screen.getByTestId('main-layout');
      expect(layout).toHaveClass('overflow-hidden');
    });
  });

  describe('Responsive Design', () => {
    it('should apply mobile-first responsive classes', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const layout = screen.getByTestId('main-layout');
      expect(layout).toHaveClass('flex', 'flex-col');
    });

    it('should handle different breakpoints correctly', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const layout = screen.getByTestId('main-layout');
      // Always flex-col for proper header/content/footer stacking
      expect(layout).toHaveClass('flex-col');
    });
  });

  describe('Layout Structure', () => {
    it('should provide proper layout areas', () => {
      render(
        <MainLayout>
          <div data-testid="content-area">Main Content</div>
        </MainLayout>
      );

      // Should have a main content area
      expect(screen.getByTestId('main-content-area')).toBeInTheDocument();
      expect(screen.getByTestId('content-area')).toBeInTheDocument();
    });

    it('should support header area', () => {
      render(
        <MainLayout header={<div data-testid="header-content">Header</div>}>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('header-area')).toBeInTheDocument();
      expect(screen.getByTestId('header-content')).toBeInTheDocument();
    });

    it('should support sidebar areas', () => {
      render(
        <MainLayout leftSidebar={<div data-testid="left-sidebar">Left</div>}>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('left-sidebar-area')).toBeInTheDocument();
      expect(screen.getByTestId('left-sidebar')).toBeInTheDocument();
    });

    it('should support footer area', () => {
      render(
        <MainLayout footer={<div data-testid="footer-content">Footer</div>}>
          <div>Content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('footer-area')).toBeInTheDocument();
      expect(screen.getByTestId('footer-content')).toBeInTheDocument();
    });
  });

  describe('Layout Composition', () => {
    it('should render all layout areas when provided', () => {
      render(
        <MainLayout
          footer={<div data-testid="footer">Footer</div>}
          header={<div data-testid="header">Header</div>}
          leftSidebar={<div data-testid="left">Left</div>}
        >
          <div data-testid="main">Main Content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('header')).toBeInTheDocument();
      expect(screen.getByTestId('left')).toBeInTheDocument();
      expect(screen.getByTestId('footer')).toBeInTheDocument();
      expect(screen.getByTestId('main')).toBeInTheDocument();
    });

    it('should work with minimal layout (content only)', () => {
      render(
        <MainLayout>
          <div data-testid="minimal-content">Just content</div>
        </MainLayout>
      );

      expect(screen.getByTestId('minimal-content')).toBeInTheDocument();
      expect(screen.queryByTestId('header-area')).not.toBeInTheDocument();
      expect(screen.queryByTestId('left-sidebar-area')).not.toBeInTheDocument();
    });
  });

  describe('Dark Theme Integration', () => {
    it('should apply dark theme classes', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const layout = screen.getByTestId('main-layout');
      expect(layout).toHaveClass('bg-background', 'text-foreground');
    });

    it('should support theme transitions', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const layout = screen.getByTestId('main-layout');
      expect(layout).toHaveClass('transition-colors');
    });
  });

  describe('Scrolling Behavior', () => {
    it('should manage scroll containers properly', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const contentArea = screen.getByTestId('main-content-area');
      expect(contentArea).toHaveClass('overflow-hidden');

      // The actual scrolling element is the inner content container
      const contentContainer = contentArea.querySelector('.flex-1.overflow-auto');
      expect(contentContainer).toBeInTheDocument();
    });

    it('should prevent body scroll when needed', () => {
      render(
        <MainLayout>
          <div>Content</div>
        </MainLayout>
      );

      const layout = screen.getByTestId('main-layout');
      expect(layout).toHaveClass('overflow-hidden');
    });
  });

  describe('Z-Index Management', () =>
    it('should apply proper z-index hierarchy', () => {
      render(
        <MainLayout header={<div data-testid="header">Header</div>} leftSidebar={<div data-testid="left">Left</div>}>
          <div>Content</div>
        </MainLayout>
      );

      const headerArea = screen.getByTestId('header-area');
      const sidebarArea = screen.getByTestId('left-sidebar-area');

      // Header should have higher z-index than sidebars
      expect(headerArea).toHaveClass('z-50');
      expect(sidebarArea).toHaveClass('z-40');
    }));

  describe('Performance Considerations', () => {
    it('should optimize rendering with proper structure', () => {
      render(
        <MainLayout>
          <div data-testid="content">Content</div>
        </MainLayout>
      );

      // Should have efficient DOM structure
      const layout = screen.getByTestId('main-layout');
      expect(layout.tagName).toBe('DIV');
      expect(layout).toHaveClass('flex');
    });

    it('should handle content updates efficiently', () => {
      const {rerender} = render(
        <MainLayout>
          <div data-testid="content">Initial</div>
        </MainLayout>
      );

      rerender(
        <MainLayout>
          <div data-testid="content">Updated</div>
        </MainLayout>
      );

      expect(screen.getByTestId('content')).toHaveTextContent('Updated');
    });
  });
});
