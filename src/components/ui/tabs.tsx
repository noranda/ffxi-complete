import * as TabsPrimitive from '@radix-ui/react-tabs';

import {cn} from '@/lib/utils';

/**
 * Tabs content component props extending Radix Tabs.Content
 */
type TabsContentProps = React.ComponentProps<typeof TabsPrimitive.Content>;

/**
 * Tabs list component props extending Radix Tabs.List
 */
type TabsListProps = React.ComponentProps<typeof TabsPrimitive.List>;

/**
 * Tabs root component props extending Radix Tabs.Root
 */
type TabsProps = React.ComponentProps<typeof TabsPrimitive.Root>;

/**
 * Tabs trigger component props extending Radix Tabs.Trigger
 */
type TabsTriggerProps = React.ComponentProps<typeof TabsPrimitive.Trigger>;

/**
 * Tabs root container component built on Radix UI
 * Provides accessible tab navigation with keyboard support
 * @param root0
 * @param root0.className
 * @example
 * ```tsx
 * <Tabs defaultValue="tab1">
 *   <TabsList>
 *     <TabsTrigger value="tab1">Tab 1</TabsTrigger>
 *     <TabsTrigger value="tab2">Tab 2</TabsTrigger>
 *   </TabsList>
 *
 *   <TabsContent value="tab1">Content 1</TabsContent>
 *   <TabsContent value="tab2">Content 2</TabsContent>
 * </Tabs>
 * ```
 */
const TabsRoot: React.FC<TabsProps> = ({className, ...props}) => (
  <TabsPrimitive.Root
    className={cn('flex flex-col gap-2', className)}
    data-slot="tabs"
    {...props}
  />
);
/**
 * Tabs list container for tab triggers
 * Provides a styled background for the tab navigation
 * @param root0
 * @param root0.className
 */
const TabsList: React.FC<TabsListProps> = ({className, ...props}) => (
  <TabsPrimitive.List
    className={cn(
      `bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]`,
      className
    )}
    data-slot="tabs-list"
    {...props}
  />
);
/**
 * Individual tab trigger button
 * Shows active state styling and handles tab switching
 * @param root0
 * @param root0.className
 */
const TabsTrigger: React.FC<TabsTriggerProps> = ({className, ...props}) => (
  <TabsPrimitive.Trigger
    className={cn(
      // Base styles with active state handling
      `text-foreground data-[state=active]:bg-background dark:data-[state=active]:text-foreground dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 dark:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4`,
      className
    )}
    data-slot="tabs-trigger"
    {...props}
  />
);
/**
 * Tab content panel
 * Contains the content associated with each tab
 * @param root0
 * @param root0.className
 */
const TabsContent: React.FC<TabsContentProps> = ({className, ...props}) => (
  <TabsPrimitive.Content
    className={cn('flex-1 outline-none', className)}
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
