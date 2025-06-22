import {Drawer as DrawerPrimitive} from 'vaul';

import {cn} from '@/lib/utils';

/**
 * Drawer close component props extending Vaul Drawer.Close
 */
type DrawerCloseProps = React.ComponentProps<typeof DrawerPrimitive.Close>;

/**
 * Drawer content component props extending Vaul Drawer.Content
 */
type DrawerContentProps = React.ComponentProps<typeof DrawerPrimitive.Content>;

/**
 * Drawer description component props extending Vaul Drawer.Description
 */
type DrawerDescriptionProps = React.ComponentProps<
  typeof DrawerPrimitive.Description
>;

/**
 * Drawer footer component props extending HTML div attributes
 */
type DrawerFooterProps = React.ComponentProps<'div'>;

/**
 * Drawer header component props extending HTML div attributes
 */
type DrawerHeaderProps = React.ComponentProps<'div'>;

/**
 * Drawer overlay component props extending Vaul Drawer.Overlay
 */
type DrawerOverlayProps = React.ComponentProps<typeof DrawerPrimitive.Overlay>;

/**
 * Drawer portal component props extending Vaul Drawer.Portal
 */
type DrawerPortalProps = React.ComponentProps<typeof DrawerPrimitive.Portal>;

/**
 * Drawer root component props extending Vaul Drawer.Root
 */
type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>;

/**
 * Drawer title component props extending Vaul Drawer.Title
 */
type DrawerTitleProps = React.ComponentProps<typeof DrawerPrimitive.Title>;

/**
 * Drawer trigger component props extending Vaul Drawer.Trigger
 */
type DrawerTriggerProps = React.ComponentProps<typeof DrawerPrimitive.Trigger>;

/**
 * Drawer root component built on Vaul.
 * Provides accessible drawer/modal functionality with gesture support.
 */
const DrawerRoot: React.FC<DrawerProps> = ({...props}) => (
  <DrawerPrimitive.Root data-slot="drawer" {...props} />
);
/**
 * Drawer trigger button component.
 * Use with asChild prop to render as any element.
 */
const DrawerTrigger: React.FC<DrawerTriggerProps> = ({...props}) => (
  <DrawerPrimitive.Trigger data-slot="drawer-trigger" {...props} />
);
/**
 * Drawer portal component for rendering outside normal DOM tree.
 * Automatically used by DrawerContent.
 */
const DrawerPortal: React.FC<DrawerPortalProps> = ({...props}) => (
  <DrawerPrimitive.Portal data-slot="drawer-portal" {...props} />
);
/**
 * Drawer close trigger component.
 * Can be placed anywhere within drawer content.
 */
const DrawerClose: React.FC<DrawerCloseProps> = ({...props}) => (
  <DrawerPrimitive.Close data-slot="drawer-close" {...props} />
);
/**
 * Drawer overlay component with backdrop blur.
 * Provides the dark overlay behind drawer content.
 */
const DrawerOverlay: React.FC<DrawerOverlayProps> = ({className, ...props}) => (
  <DrawerPrimitive.Overlay
    className={cn(
      // Fade in/out animations with backdrop
      `data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 fixed inset-0 z-50 bg-black/50`,
      className
    )}
    data-slot="drawer-overlay"
    {...props}
  />
);
/**
 * Main drawer content container with directional support.
 * Supports bottom, top, left, and right drawer directions.
 * Includes automatic overlay and portal rendering.
 */
const DrawerContent: React.FC<DrawerContentProps> = ({
  children,
  className,
  ...props
}) => (
  <DrawerPortal data-slot="drawer-portal">
    <DrawerOverlay />

    <DrawerPrimitive.Content
      className={cn(
        'group/drawer-content bg-background fixed z-50 flex h-auto flex-col',
        // Top drawer positioning and styling
        `data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b`,
        // Bottom drawer positioning and styling
        `data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t`,
        // Right drawer positioning and styling
        `data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm`,
        // Left drawer positioning and styling
        `data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm`,
        className
      )}
      data-slot="drawer-content"
      {...props}
    >
      {/* Drag handle for bottom drawers */}
      <div className="bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block" />

      {children}
    </DrawerPrimitive.Content>
  </DrawerPortal>
);
/**
 * Drawer header component with responsive text alignment.
 * Container for title, description, and other header content.
 */
const DrawerHeader: React.FC<DrawerHeaderProps> = ({className, ...props}) => (
  <div
    className={cn(
      // Responsive text alignment based on drawer direction
      `flex flex-col gap-0.5 p-4 group-data-[vaul-drawer-direction=bottom]/drawer-content:text-center group-data-[vaul-drawer-direction=top]/drawer-content:text-center md:gap-1.5 md:text-left`,
      className
    )}
    data-slot="drawer-header"
    {...props}
  />
);
/**
 * Drawer footer component with automatic margin.
 * Positioned at the bottom of drawer content.
 */
const DrawerFooter: React.FC<DrawerFooterProps> = ({className, ...props}) => (
  <div
    className={cn('mt-auto flex flex-col gap-2 p-4', className)}
    data-slot="drawer-footer"
    {...props}
  />
);
/**
 * Drawer title component for accessibility.
 * Should be used for the main drawer heading.
 */
const DrawerTitle: React.FC<DrawerTitleProps> = ({className, ...props}) => (
  <DrawerPrimitive.Title
    className={cn('text-foreground font-semibold', className)}
    data-slot="drawer-title"
    {...props}
  />
);
/**
 * Drawer description component for accessibility.
 * Provides additional context about the drawer content.
 */
const DrawerDescription: React.FC<DrawerDescriptionProps> = ({
  className,
  ...props
}) => (
  <DrawerPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
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
