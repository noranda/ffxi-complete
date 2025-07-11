/**
 * Tab Navigation Component
 *
 * Sticky tab navigation system for collection switching with progress indicators.
 * Provides horizontal scrolling on mobile and keyboard navigation support.
 * Fixed at top of content area below the AppBar with proper z-index management.
 */

import {useState} from 'react';

import {Button} from '@/components/ui';
import {FFXIIcon} from '@/icons';
import {cn} from '@/lib/utils';

/**
 * Props for the TabNavigation component
 */
export type TabNavigationProps = {
  activeTab: string;
  className?: string;
  collections: Collection[];
  onTabChange: (tabId: string) => void;
  progressData?: ProgressData;
};

/**
 * Collection definition type
 */
type Collection = {
  readonly icon?: string;
  readonly id: string;
  readonly label: string;
};

/**
 * Progress data type for collections
 */
type ProgressData = {
  readonly [key: string]: {
    readonly completed: number;
    readonly total: number;
  };
};

/**
 * Keyboard navigation keys
 */
const KEYBOARD_KEYS = {
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
} as const;

/**
 * Default progress values
 */
const DEFAULT_PROGRESS = {
  completed: 0,
  total: 0,
} as const;

/**
 * Calculate completion percentage from progress data
 */
const calculatePercentage = (completed: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Get progress data for a specific collection
 */
const getProgressForCollection = (collectionId: string, progressData?: ProgressData) => {
  if (!progressData || !progressData[collectionId]) {
    return DEFAULT_PROGRESS;
  }
  return progressData[collectionId];
};

/**
 * Handle keyboard navigation between tabs
 */
const handleKeyboardNavigation = (
  event: React.KeyboardEvent,
  currentIndex: number,
  collections: Collection[],
  onTabChange: (tabId: string) => void
) => {
  const {key} = event;

  if (key === KEYBOARD_KEYS.ARROW_RIGHT) {
    event.preventDefault();
    const nextIndex = (currentIndex + 1) % collections.length;
    onTabChange(collections[nextIndex].id);
  } else if (key === KEYBOARD_KEYS.ARROW_LEFT) {
    event.preventDefault();
    const prevIndex = (currentIndex - 1 + collections.length) % collections.length;
    onTabChange(collections[prevIndex].id);
  }
};

/**
 * Circular Progress Component
 * Shows circular progress indicator for collection completion
 */
type CircularProgressProps = {
  collectionId: string;
  isHovered: boolean;
  progress: {completed: number; total: number};
  size?: number;
};

const CircularProgress: React.FC<CircularProgressProps> = ({collectionId, isHovered, progress, size = 95}) => {
  const percentage = calculatePercentage(progress.completed, progress.total);
  const radius = (size - 14) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{height: size, width: size}}>
      {/* Background Circle */}
      <svg className="absolute size-24 -rotate-90 transform" height={size} style={{zIndex: 1}} width={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          style={{
            fill: 'none',
            stroke: '#6B7280',
            strokeWidth: '4px',
          }}
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          fill="none"
          r={radius}
          style={{
            fill: 'none',
            stroke: '#22D3EE',
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashoffset,
            strokeLinecap: 'round',
            strokeWidth: '4px',
            transition: 'stroke-dashoffset 0.3s ease',
          }}
        />
      </svg>

      {/* Progress Text - Shows percentage on hover, absolute numbers otherwise */}
      <div className="absolute flex flex-col items-center" style={{zIndex: 2}}>
        {isHovered ? (
          <>
            <div className="text-2xl font-semibold text-teal-400" data-testid={`progress-${collectionId}`}>
              {percentage}%
            </div>
            <div className="text-xs text-gray-300">complete</div>
          </>
        ) : (
          <>
            <div className="text-2xl font-semibold text-teal-400" data-testid={`progress-${collectionId}`}>
              {progress.completed}
            </div>
            <div className="text-xs text-gray-300">of {progress.total}</div>
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Tab Component
 * Individual tab with circular progress, and icon next to label at bottom
 */
type TabProps = {
  collection: Collection;
  isActive: boolean;
  onKeyDown: (event: React.KeyboardEvent) => void;
  onTabChange: (tabId: string) => void;
  progress?: {completed: number; total: number};
};

const Tab: React.FC<TabProps> = ({collection, isActive, onKeyDown, onTabChange, progress}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      aria-selected={isActive}
      className={cn('h-36 w-36 flex-col gap-2 rounded-none p-3', isActive ? 'bg-cyan-950' : 'hover:bg-gray-700/30')}
      data-testid={`tab-${collection.id}`}
      onClick={() => onTabChange(collection.id)}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="tab"
      size="sm"
      variant="ghost"
    >
      {/* Circular Progress */}
      {progress && <CircularProgress collectionId={collection.id} isHovered={isHovered} progress={progress} />}

      {/* Icon and Label side by side at bottom */}
      <div className="flex items-center gap-1">
        {collection.id === 'mounts' && <FFXIIcon category="magic" name="219" size="md" />}

        <div className="text-xs text-gray-100">{collection.label}</div>
      </div>
    </Button>
  );
};

/**
 * Sticky tab navigation component for collection switching
 *
 * Features:
 * - Sticky positioning below AppBar with proper z-index
 * - Circular progress indicators showing completion status
 * - Horizontal scrolling support for many collections
 * - Keyboard navigation (Arrow Left/Right)
 * - Square tabs with consistent dimensions
 * - Full accessibility support with ARIA attributes
 * - Integration with MainLayout system
 */
export const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  className,
  collections,
  onTabChange,
  progressData,
}) => (
  <nav
    aria-label="Collection navigation"
    className={cn('bg-background sticky top-0 z-40 h-36 w-full overflow-x-auto', className)}
    data-testid="tab-navigation"
    role="navigation"
  >
    {/* Tab List Container */}
    <div className="flex h-full bg-[#282c34]" role="tablist">
      {collections.map((collection, index) => {
        const progress = getProgressForCollection(collection.id, progressData);

        return (
          <Tab
            collection={collection}
            isActive={collection.id === activeTab}
            key={collection.id}
            onKeyDown={event => handleKeyboardNavigation(event, index, collections, onTabChange)}
            onTabChange={onTabChange}
            progress={progress}
          />
        );
      })}
    </div>
  </nav>
);
