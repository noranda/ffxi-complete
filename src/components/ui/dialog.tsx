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

import {cn} from '@/lib/utils';

/**
 * Dialog close component props
 */
type DialogCloseProps = React.ComponentProps<typeof DialogPrimitive.Close> & {};

/**
 * Dialog content component props
 */
type DialogContentProps = React.ComponentProps<typeof DialogPrimitive.Content> & {
  showCloseButton?: boolean;
};

/**
 * Dialog description component props
 */
type DialogDescriptionProps = React.ComponentProps<typeof DialogPrimitive.Description> & {};

/**
 * Dialog footer component props
 */
type DialogFooterProps = React.ComponentProps<'div'> & {};

/**
 * Dialog header component props
 */
type DialogHeaderProps = React.ComponentProps<'div'> & {};

/**
 * Dialog overlay component props
 */
type DialogOverlayProps = React.ComponentProps<typeof DialogPrimitive.Overlay> & {};

/**
 * Dialog portal component props
 */
type DialogPortalProps = React.ComponentProps<typeof DialogPrimitive.Portal> & {};

/**
 * Root dialog component props
 */
type DialogRootProps = React.ComponentProps<typeof DialogPrimitive.Root> & {};

/**
 * Dialog title component props
 */
type DialogTitleProps = React.ComponentProps<typeof DialogPrimitive.Title> & {};

/**
 * Dialog trigger component props
 */
type DialogTriggerProps = React.ComponentProps<typeof DialogPrimitive.Trigger> & {};

/**
 * Root dialog component that manages open/closed state
 */
const DialogRoot: React.FC<DialogRootProps> = ({...props}) => <DialogPrimitive.Root data-slot="dialog" {...props} />;

/**
 * Trigger component that opens the dialog when activated
 */
const DialogTrigger: React.FC<DialogTriggerProps> = ({...props}) => (
  <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />
);

/**
 * Portal component that renders dialog content in a portal
 */
const DialogPortal: React.FC<DialogPortalProps> = ({...props}) => (
  <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />
);

/**
 * Close component that closes the dialog when activated
 */
const DialogClose: React.FC<DialogCloseProps> = ({...props}) => (
  <DialogPrimitive.Close data-slot="dialog-close" {...props} />
);

/**
 * Overlay component that provides the backdrop behind the dialog
 */
const DialogOverlay: React.FC<DialogOverlayProps> = ({className, ...props}) => (
  <DialogPrimitive.Overlay
    className={cn(
      'data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50',
      className
    )}
    data-slot="dialog-overlay"
    {...props}
  />
);

/**
 * Content component that contains the main dialog content
 */
const DialogContent: React.FC<DialogContentProps> = ({children, className, showCloseButton = true, ...props}) => (
  <DialogPortal data-slot="dialog-portal">
    <DialogOverlay />

    <DialogPrimitive.Content
      className={cn(
        'bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg',
        className
      )}
      data-slot="dialog-content"
      {...props}
    >
      {children}
      {showCloseButton && (
        <DialogPrimitive.Close
          className="ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"
          data-slot="dialog-close"
        >
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
const DialogHeader: React.FC<DialogHeaderProps> = ({className, ...props}) => (
  <div className={cn('flex flex-col gap-2 text-center sm:text-left', className)} data-slot="dialog-header" {...props} />
);

/**
 * Footer component for dialog actions and buttons
 */
const DialogFooter: React.FC<DialogFooterProps> = ({className, ...props}) => (
  <div
    className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    data-slot="dialog-footer"
    {...props}
  />
);

/**
 * Title component for dialog heading
 */
const DialogTitle: React.FC<DialogTitleProps> = ({className, ...props}) => (
  <DialogPrimitive.Title
    className={cn('text-lg leading-none font-semibold', className)}
    data-slot="dialog-title"
    {...props}
  />
);

/**
 * Description component for dialog subtitle or additional information
 */
const DialogDescription: React.FC<DialogDescriptionProps> = ({className, ...props}) => (
  <DialogPrimitive.Description
    className={cn('text-muted-foreground text-sm', className)}
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
