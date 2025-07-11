/**
 * Layout components following XIV-Complete design patterns
 *
 * This module contains:
 * - MainLayout - Root layout component orchestrating all areas ✅ COMPLETE (Task 4.1)
 * - AppBar - Sticky app bar with branding and user controls ✅ COMPLETE (Task 4.2)
 * - LeftSidebar - Desktop character sidebar with scroll behavior ✅ COMPLETE (Task 4.3)
 * - BottomNavigation - Mobile navigation replacement for sidebar ✅ COMPLETE (Task 4.4)
 * - TabNavigation - Sticky tab navigation with progress indicators ✅ COMPLETE (Task 4.5)
 *
 * Planned components:
 * - RightDrawer - Collection visibility settings drawer (Task 4.6)
 */

/**
 * Layout Components
 *
 * Exports all layout-related components for the FFXI Complete application.
 * These components handle the overall application structure and responsive design.
 */

export {AppBar, type AppBarProps, type User} from './AppBar';
export {BottomNavigation, type BottomNavigationProps} from './BottomNavigation';
export {LeftSidebar, type LeftSidebarProps} from './LeftSidebar';
export {MainLayout, type MainLayoutProps} from './MainLayout';
export {TabNavigation, type TabNavigationProps} from './TabNavigation';
