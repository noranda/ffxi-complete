import {tv, type VariantProps} from 'tailwind-variants';
import {Drawer as DrawerPrimitive} from 'vaul';

import {cn} from '@/lib/utils';

/**
 * Drawer content variants using tailwind-variants
 * Provides consistent styling for different drawer sizes
 */
const drawerContentVariants = tv({
  base: 'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
  defaultVariants: {
    size: 'default',
  },
  variants: {
    size: {
      default: [
        // Bottom drawer
        'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
        // Top drawer
        'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
        // Right drawer
        'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
        // Left drawer
        'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
      ],
      lg: [
        // Bottom drawer - larger
        'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-16 data-[vaul-drawer-direction=bottom]:max-h-[90vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
        // Top drawer - larger
        'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-16 data-[vaul-drawer-direction=top]:max-h-[90vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
        // Right drawer - wider
        'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-4/5 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-lg',
        // Left drawer - wider
        'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-4/5 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-lg',
      ],
      sm: [
        // Bottom drawer - smaller
        'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-32 data-[vaul-drawer-direction=bottom]:max-h-[60vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
        // Top drawer - smaller
        'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-32 data-[vaul-drawer-direction=top]:max-h-[60vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
        // Right drawer - narrower
        'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-2/3 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-xs',
        // Left drawer - narrower
        'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-2/3 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-xs',
      ],
    },
  },
});

/**
 * Drawer spacing variants for sub-components
 * Provides consistent padding based on drawer size
 */
const drawerSpacingVariants = tv({
  variants: {
    size: {
      default: 'p-4',
      lg: 'p-6',
      sm: 'p-3',
    },
  },
});

/**
 * Drawer title variants for size-based typography
 */
const drawerTitleVariants = tv({
  base: 'text-foreground font-semibold',
  variants: {
    size: {
      default: 'text-lg',
      lg: 'text-xl',
      sm: 'text-base',
    },
  },
});

/**
 * Drawer gap variants for headers and footers
 */
const drawerGapVariants = tv({
  variants: {
    size: {
      default: 'gap-0.5 md:gap-1.5',
      lg: 'gap-1 md:gap-2',
      sm: 'gap-0.5 md:gap-1',
    },
  },
});

/**
 * Drawer drag handle variants for size-based styling
 */
const drawerDragHandleVariants = tv({
  base: 'bg-muted mx-auto hidden shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block',
  variants: {
    size: {
      default: 'mt-4 h-2 w-[100px]',
      lg: 'mt-5 h-2.5 w-[120px]',
      sm: 'mt-3 h-1.5 w-[80px]',
    },
  },
});

/**
 * Drawer overlay variants for backdrop styling
 */
const drawerOverlayVariants = tv({
  base: 'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-black/50',
});

/**
 * Drawer footer variants for layout styling
 */
const drawerFooterVariants = tv({
  base: 'mt-auto flex flex-col gap-2',
});

/**
 * Drawer description variants for text styling
 */
const drawerDescriptionVariants = tv({
  base: 'text-muted-foreground text-sm',
});

/**
 * Drawer close component props extending Vaul Drawer.Close
 */
type DrawerCloseProps = React.ComponentProps;

/**
 * Drawer content component props extending Vaul Drawer.Content
 */
type DrawerContentProps = React.ComponentProps & VariantProps;

/**
 * Drawer description component props extending Vaul Drawer.Description
 */
type DrawerDescriptionProps = React.ComponentProps;

/**
 * Drawer footer component props extending HTML div attributes
 */
type DrawerFooterProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm';
};

/**
 * Drawer header component props extending HTML div attributes
 */
type DrawerHeaderProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm';
};

/**
 * Drawer overlay component props extending Vaul Drawer.Overlay
 */
type DrawerOverlayProps = React.ComponentProps;

/**
 * Drawer portal component props extending Vaul Drawer.Portal
 */
type DrawerPortalProps = React.ComponentProps;

/**
 * Drawer root component props extending Vaul Drawer.Root
 */
type DrawerProps = React.ComponentProps;

/**
 * Drawer title component props extending Vaul Drawer.Title
 */
type DrawerTitleProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm';
};

/**
 * Drawer trigger component props extending Vaul Drawer.Trigger
 */
type DrawerTriggerProps = React.ComponentProps;

/**
 * Drawer root component built on Vaul.
 * Provides accessible drawer/modal functionality with gesture support.
 */
const DrawerRoot: React.FC = ({...props}) => <DrawerPrimitive.Root data-slot="drawer" {...props} />;

/**
 * Drawer trigger button component.
 * Use with asChild prop to render as any element.
 */
const DrawerTrigger: React.FC = ({...props}) => <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />;

/**
 * Drawer portal component for rendering outside normal DOM tree.
 * Automatically used by DrawerContent.
 */
const DrawerPortal: React.FC = ({...props}) => <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />;

/**
 * Drawer close trigger component.
 * Can be placed anywhere within drawer content.
 */
const DrawerClose: React.FC = ({...props}) => <DrawerPrimitive.Close data-slot="drawer-close" {...props} />;

/**
 * Drawer overlay component with backdrop blur.
 * Provides the dark overlay behind drawer content.
 */
const DrawerOverlay: React.FC = ({className, ...props}) => (
  <DrawerPrimitive.Overlay className={cn(drawerOverlayVariants(), className)} data-slot="drawer-overlay" {...props} />
);

/**
 * Main drawer content container with directional and size support.
 * Supports bottom, top, left, and right drawer directions with size variants.
 * Includes automatic overlay and portal rendering.
 */
const DrawerContent: React.FC = ({children, className, size, ...props}) => (
  <DrawerPortal data-slot="drawer-portal">
    <DrawerOverlay />

    <DrawerPrimitive.Content
      className={cn(drawerContentVariants({className, size}))}
      data-slot="drawer-content"
      {...props}
    >
      {/* Drag handle for bottom drawers - size responsive */}
      <div className={cn(drawerDragHandleVariants({size}))} />

      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
);

/**
 * Drawer header component with responsive text alignment and size variants.
 * Container for title, description, and other header content.
 */
const DrawerHeader: React.FC = ({className, size = 'default', ...props}) => (
  <div
    className={cn(
      'flex flex-col group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:text-left',
      drawerSpacingVariants({size}),
      drawerGapVariants({size}),
      className
    )}
    data-slot="drawer-header"
    {...props}
  />
);

/**
 * Drawer footer component with automatic margin and size variants.
 * Positioned at the bottom of drawer content.
 */
const DrawerFooter: React.FC = ({className, size = 'default', ...props}) => (
  <div
    className={cn(drawerFooterVariants(), drawerSpacingVariants({size}), className)}
    data-slot="drawer-footer"
    {...props}
  />
);

/**
 * Drawer title component for accessibility with size variants.
 * Should be used for the main drawer heading.
 */
const DrawerTitle: React.FC = ({className, size = 'default', ...props}) => (
  <DrawerPrimitive.Title className={cn(drawerTitleVariants({size}), className)} data-slot="drawer-title" {...props} />
);

/**
 * Drawer description component for accessibility.
 * Provides additional context about the drawer content.
 */
const DrawerDescription: React.FC = ({className, ...props}) => (
  <DrawerPrimitive.Description
    className={cn(drawerDescriptionVariants(), className)}
    data-slot="drawer-description"
    {...props}
  />
);

/**
 * Compound Drawer component with sub-components as properties
 * Provides accessible drawer/modal functionality with shared state management
 */
const Drawer = Object.assign(DrawerRoot, {
  Close: DrawerClose,
  Content: DrawerContent,
  Description: DrawerDescription,
  Footer: DrawerFooter,
  Header: DrawerHeader,
  Overlay: DrawerOverlay,
  Portal: DrawerPortal,
  Title: DrawerTitle,
  Trigger: DrawerTrigger,
});

/**
 * Namespaced types for Drawer compound component
 * Access as DrawerTypes.Props, DrawerTypes.ContentProps, etc.
 */
type DrawerTypes = {
  CloseProps: DrawerCloseProps;
  ContentProps: DrawerContentProps;
  DescriptionProps: DrawerDescriptionProps;
  FooterProps: DrawerFooterProps;
  HeaderProps: DrawerHeaderProps;
  OverlayProps: DrawerOverlayProps;
  PortalProps: DrawerPortalProps;
  Props: DrawerProps;
  TitleProps: DrawerTitleProps;
  TriggerProps: DrawerTriggerProps;
};

export {Drawer, type DrawerTypes};
