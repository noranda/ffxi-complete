/**
 * Dialog Component
 *
 * Accessible modal dialog component built on Radix UI Dialog primitive.
 * Provides proper focus management, keyboard navigation, and ARIA attributes.
 * Supports various dialog types with customizable content and styling.
 */

import {faTimes} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import {tv, type VariantProps} from 'tailwind-variants';

import {cn} from '@/lib/utils';

/**
 * Dialog content variants using tailwind-variants
 * Provides consistent styling for different dialog sizes and positions
 */
const dialogContentVariants = tv({
  base: [
    'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed z-50 grid w-full translate-x-[-50%] rounded-lg border shadow-lg duration-200',
    'max-w-[calc(100%-2rem)]',
  ],
  defaultVariants: {
    position: 'center',
    size: 'default',
    variant: 'default',
  },
  variants: {
    position: {
      center: 'top-[50%] left-[50%] translate-y-[-50%]',
      top: 'top-[20%] left-[50%]',
    },
    size: {
      default: 'gap-4 p-6 sm:max-w-lg',
      lg: 'gap-6 p-8 sm:max-w-2xl',
      sm: 'gap-3 p-4 sm:max-w-md',
      xl: 'gap-8 p-10 sm:max-w-4xl',
    },
    variant: {
      default: '',
      destructive: 'border-destructive/20',
    },
  },
});

/**
 * Dialog title variants for size-based typography
 */
const dialogTitleVariants = tv({
  base: 'leading-none font-semibold',
  variants: {
    size: {
      default: 'text-lg',
      lg: 'text-xl',
      sm: 'text-base',
      xl: 'text-2xl',
    },
  },
});

/**
 * Dialog spacing variants for sub-components
 */
const dialogSpacingVariants = tv({
  variants: {
    size: {
      default: 'gap-2',
      lg: 'gap-3',
      sm: 'gap-1.5',
      xl: 'gap-4',
    },
  },
});

/**
 * Dialog close button variants for positioning based on size
 */
const dialogCloseVariants = tv({
  base: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  variants: {
    size: {
      default: 'top-4 right-4',
      lg: 'top-6 right-6',
      sm: 'top-3 right-3',
      xl: 'top-6 right-6',
    },
  },
});

/**
 * Dialog overlay variants for backdrop styling
 */
const dialogOverlayVariants = tv({
  base: 'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
});

/**
 * Dialog header variants for layout and alignment
 */
const dialogHeaderVariants = tv({
  base: 'flex flex-col text-center sm:text-left',
});

/**
 * Dialog footer variants for button layout
 */
const dialogFooterVariants = tv({
  base: 'flex flex-col-reverse sm:flex-row sm:justify-end',
});

/**
 * Dialog description variants for text styling
 */
const dialogDescriptionVariants = tv({
  base: 'text-muted-foreground text-sm',
});

/**
 * Dialog close component props
 */
type DialogCloseProps = React.ComponentProps;

/**
 * Dialog content component props
 */
type DialogContentProps = React.ComponentProps &
  VariantProps & {
    showCloseButton?: boolean;
  };

/**
 * Dialog description component props
 */
type DialogDescriptionProps = React.ComponentProps;

/**
 * Dialog footer component props
 */
type DialogFooterProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm' | 'xl';
};

/**
 * Dialog header component props
 */
type DialogHeaderProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm' | 'xl';
};

/**
 * Dialog overlay component props
 */
type DialogOverlayProps = React.ComponentProps;

/**
 * Dialog portal component props
 */
type DialogPortalProps = React.ComponentProps;

/**
 * Root dialog component props
 */
type DialogRootProps = React.ComponentProps;

/**
 * Dialog title component props
 */
type DialogTitleProps = React.ComponentProps & {
  size?: 'default' | 'lg' | 'sm' | 'xl';
};

/**
 * Dialog trigger component props
 */
type DialogTriggerProps = React.ComponentProps;

/**
 * Root dialog component that manages open/closed state
 */
const DialogRoot: React.FC = ({...props}) => <DialogPrimitive.Root data-slot="dialog" {...props} />;

/**
 * Trigger component that opens the dialog when activated
 */
const DialogTrigger: React.FC = ({...props}) => <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;

/**
 * Portal component that renders dialog content in a portal
 */
const DialogPortal: React.FC = ({...props}) => <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;

/**
 * Close component that closes the dialog when activated
 */
const DialogClose: React.FC = ({...props}) => <DialogPrimitive.Close data-slot="dialog-close" {...props} />;

/**
 * Overlay component that provides the backdrop behind the dialog
 */
const DialogOverlay: React.FC = ({className, ...props}) => (
  <DialogPrimitive.Overlay className={cn(dialogOverlayVariants(), className)} data-slot="dialog-overlay" {...props} />
);

/**
 * Content component that contains the main dialog content with variant support
 */
const DialogContent: React.FC = ({children, className, position, showCloseButton = true, size, variant, ...props}) => (
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay />

    <DialogPrimitive.Content
      className={cn(dialogContentVariants({className, position, size, variant}))}
      data-slot="dialog-content"
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close className={cn(dialogCloseVariants({size}))} data-slot="dialog-close">
          <FontAwesomeIcon icon={faTimes} />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      )}
    </DialogPrimitive.Content>
  </DialogPortal>
);

/**
 * Header component for dialog title and description
 */
const DialogHeader: React.FC = ({className, size = 'default', ...props}) => (
  <div
    className={cn(dialogHeaderVariants(), dialogSpacingVariants({size}), className)}
    data-slot="dialog-header"
    {...props}
  />
);

/**
 * Footer component for dialog actions and buttons
 */
const DialogFooter: React.FC = ({className, size = 'default', ...props}) => (
  <div
    className={cn(dialogFooterVariants(), dialogSpacingVariants({size}), className)}
    data-slot="dialog-footer"
    {...props}
  />
);

/**
 * Title component for dialog heading with size-based typography
 */
const DialogTitle: React.FC = ({className, size = 'default', ...props}) => (
  <DialogPrimitive.Title className={cn(dialogTitleVariants({size}), className)} data-slot="dialog-title" {...props} />
);

/**
 * Description component for dialog subtitle or additional information
 */
const DialogDescription: React.FC = ({className, ...props}) => (
  <DialogPrimitive.Description
    className={cn(dialogDescriptionVariants(), className)}
    data-slot="dialog-description"
    {...props}
  />
);

/**
 * Compound Dialog component with dot notation access to sub-components
 */
const Dialog = Object.assign(DialogRoot, {
  Close: DialogClose,
  Content: DialogContent,
  Description: DialogDescription,
  Footer: DialogFooter,
  Header: DialogHeader,
  Overlay: DialogOverlay,
  Portal: DialogPortal,
  Title: DialogTitle,
  Trigger: DialogTrigger,
});

/**
 * Dialog component types for TypeScript support
 */
type DialogTypes = {
  Close: DialogCloseProps;
  Content: DialogContentProps;
  Description: DialogDescriptionProps;
  Footer: DialogFooterProps;
  Header: DialogHeaderProps;
  Overlay: DialogOverlayProps;
  Portal: DialogPortalProps;
  Root: DialogRootProps;
  Title: DialogTitleProps;
  Trigger: DialogTriggerProps;
};

export {Dialog, type DialogTypes};
