/**
 * Layout components following XIV-Complete design patterns
 *
 * This module contains:
 * - MainLayout - Root layout component orchestrating all areas ✅ COMPLETE (Task 4.1)
 * - AppBar - Sticky app bar with branding and user controls ✅ COMPLETE (Task 4.2)
 *
 * Planned components:
 * - LeftSidebar - Desktop character sidebar with scroll behavior (Task 4.3)
 * - BottomNavigation - Mobile navigation replacement for sidebar (Task 4.4)
 * - TabNavigation - Sticky tab navigation with progress indicators (Task 4.5)
 * - RightDrawer - Collection visibility settings drawer (Task 4.6)
 */

/**
 * Layout Components
 *
 * Exports all layout-related components for the FFXI Complete application.
 * These components handle the overall application structure and responsive design.
 */

export {AppBar, type AppBarProps, type User} from './AppBar';
export {MainLayout, type MainLayoutProps} from './MainLayout';
