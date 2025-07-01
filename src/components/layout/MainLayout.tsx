/**
 * Main Layout Component
 *
 * Root layout component that orchestrates all UI areas including header,
 * sidebars, main content, and footer. Provides responsive design and
 * proper viewport height management for the FFXI Complete application.
 */

import {cn} from '@/lib/utils';

/**
 * Props for the MainLayout component
 */
export type MainLayoutProps = {
  children?: React.ReactNode;
  className?: string;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  leftSidebar?: React.ReactNode;
  rightSidebar?: React.ReactNode;
};

/**
 * Main layout component that provides the foundational structure for the application
 *
 * Features:
 * - Responsive design with mobile-first approach
 * - Proper viewport height management including dynamic viewport height
 * - Flexible layout areas (header, sidebars, content, footer)
 * - Dark theme integration with smooth transitions
 * - Optimized scrolling behavior and z-index management
 * - Accessibility support with proper ARIA attributes
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  className,
  footer,
  header,
  leftSidebar,
  rightSidebar,
}) => (
  <div
    aria-label="Main application layout"
    className={cn(
      // Viewport height management
      'min-h-dvh md:min-h-screen',
      // Layout structure - always column for proper header/content/footer stacking
      'flex flex-col',
      // Overflow management
      'overflow-hidden',
      // Theme integration
      'bg-background text-foreground transition-colors',
      className
    )}
    data-testid="main-layout"
    role="main"
  >
    {/* Header Area */}
    {header && (
      <div className="z-50 w-full" data-testid="header-area">
        {header}
      </div>
    )}

    {/* Main Content and Sidebars Container */}
    <div
      className={cn(
        'flex flex-1 flex-col overflow-hidden md:flex-row',
        // Add top padding when header is present to account for fixed positioning
        header && 'pt-16'
      )}
    >
      {/* Left Sidebar Area */}
      {leftSidebar && (
        <div className="z-40 w-full md:w-auto" data-testid="left-sidebar-area">
          {leftSidebar}
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-auto" data-testid="main-content-area">
        {children}
      </div>

      {/* Right Sidebar Area */}
      {rightSidebar && (
        <div className="z-40 w-full md:w-auto" data-testid="right-sidebar-area">
          {rightSidebar}
        </div>
      )}
    </div>

    {/* Footer Area */}
    {footer && (
      <div className="z-30 w-full" data-testid="footer-area">
        {footer}
      </div>
    )}
  </div>
);
