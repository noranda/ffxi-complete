import * as TabsPrimitive from '@radix-ui/react-tabs';
import {tv, type VariantProps} from 'tailwind-variants';

import {cn} from '@/lib/utils';

/**
 * Tabs list variants using tailwind-variants
 * Provides consistent styling for different tab list sizes and styles
 */
const tabsListVariants = tv({
  base: 'bg-muted text-muted-foreground inline-flex w-fit items-center justify-center rounded-lg',
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
  variants: {
    size: {
      default: 'h-9 p-[3px]',
      lg: 'h-10 p-1',
      sm: 'h-8 p-[2px]',
    },
    variant: {
      default: '',
      outline: 'border bg-transparent',
      underline: 'rounded-none border-b bg-transparent',
    },
  },
});

/**
 * Tabs trigger variants using tailwind-variants
 * Provides consistent styling for different tab trigger sizes and styles
 */
const tabsTriggerVariants = tv({
  base: [
    'text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex flex-1 items-center justify-center gap-1.5 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50',
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    'dark:text-muted-foreground',
  ],
  defaultVariants: {
    size: 'default',
    variant: 'default',
  },
  variants: {
    size: {
      default: 'h-[calc(100%-1px)] rounded-md px-2 py-1 text-sm',
      lg: 'h-[calc(100%-2px)] rounded-md px-3 py-1.5 text-sm',
      sm: 'h-[calc(100%-1px)] rounded-sm px-1.5 py-0.5 text-xs',
    },
    variant: {
      default: [
        'data-[state=active]:bg-background border border-transparent data-[state=active]:shadow-sm',
        'dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30',
      ],
      outline: [
        'data-[state=active]:border-border data-[state=active]:bg-background border border-transparent data-[state=active]:shadow-sm',
      ],
      underline: [
        'data-[state=active]:border-primary rounded-none border-b-2 border-transparent data-[state=active]:bg-transparent',
      ],
    },
  },
});

/**
 * Tabs root spacing variants
 * Provides consistent spacing based on tab size
 */
const tabsRootVariants = tv({
  base: 'flex flex-col',
  variants: {
    size: {
      default: 'gap-2',
      lg: 'gap-3',
      sm: 'gap-1.5',
    },
  },
});

/**
 * Tabs content variants for optional styling
 */
const tabsContentVariants = tv({
  base: 'flex-1 outline-none',
  variants: {
    padding: {
      false: '',
      true: 'pt-4',
    },
  },
});

/**
 * Tabs content component props extending Radix Tabs.Content
 */
type TabsContentProps = React.ComponentProps & {
  padding?: boolean;
};

/**
 * Tabs list component props extending Radix Tabs.List
 */
type TabsListProps = React.ComponentProps & VariantProps;

/**
 * Tabs root component props extending Radix Tabs.Root
 */
type TabsProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm';
};

/**
 * Tabs trigger component props extending Radix Tabs.Trigger
 */
type TabsTriggerProps = React.ComponentProps & VariantProps;

/**
 * Tabs root container component built on Radix UI.
 * Provides accessible tab navigation with keyboard support and size variants.
 */
const TabsRoot: React.FC = ({className, size = 'default', ...props}) => (
  <TabsPrimitive.Root className={cn(tabsRootVariants({size}), className)} data-slot="tabs" {...props} />
);

/**
 * Tabs list container for tab triggers with size and style variants.
 * Provides a styled background for the tab navigation.
 */
const TabsList: React.FC = ({className, size, variant, ...props}) => (
  <TabsPrimitive.List className={cn(tabsListVariants({size, variant}), className)} data-slot="tabs-list" {...props} />
);

/**
 * Individual tab trigger button with size and style variants.
 * Shows active state styling and handles tab switching.
 */
const TabsTrigger: React.FC = ({className, size, variant, ...props}) => (
  <TabsPrimitive.Trigger
    className={cn(tabsTriggerVariants({size, variant}), className)}
    data-slot="tabs-trigger"
    {...props}
  />
);

/**
 * Tab content panel with optional padding.
 * Contains the content associated with each tab.
 */
const TabsContent: React.FC = ({className, padding, ...props}) => (
  <TabsPrimitive.Content
    className={cn(tabsContentVariants({padding}), className)}
    data-slot="tabs-content"
    {...props}
  />
);

/**
 * Compound Tabs component with sub-components as properties
 * Provides accessible tab navigation with shared state management
 */
const Tabs = Object.assign(TabsRoot, {
  Content: TabsContent,
  List: TabsList,
  Trigger: TabsTrigger,
});

/**
 * Namespaced types for Tabs compound component
 * Access as TabsTypes.Props, TabsTypes.ContentProps, etc.
 */
type TabsTypes = {
  ContentProps: TabsContentProps;
  ListProps: TabsListProps;
  Props: TabsProps;
  TriggerProps: TabsTriggerProps;
};

export {Tabs, type TabsTypes};
