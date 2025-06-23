import {faCircle} from '@fortawesome/free-regular-svg-icons';
import {faCheck, faChevronRight} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import {cn} from '@/lib/utils';

/**
 * Dropdown menu checkbox item component props extending Radix DropdownMenu.CheckboxItem
 */
type DropdownMenuCheckboxItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>;

/**
 * Dropdown menu content component props extending Radix DropdownMenu.Content
 */
type DropdownMenuContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.Content>;

/**
 * Dropdown menu group component props extending Radix DropdownMenu.Group
 */
type DropdownMenuGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.Group>;

/**
 * Dropdown menu item component props extending Radix DropdownMenu.Item
 */
type DropdownMenuItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
  /** Adds left padding for nested items */
  inset?: boolean;
  /** Visual variant for different item types */
  variant?: 'default' | 'destructive';
};

/**
 * Dropdown menu label component props extending Radix DropdownMenu.Label
 */
type DropdownMenuLabelProps = React.ComponentProps<typeof DropdownMenuPrimitive.Label> & {
  /** Adds left padding for nested labels */
  inset?: boolean;
};

/**
 * Dropdown menu portal component props extending Radix DropdownMenu.Portal
 */
type DropdownMenuPortalProps = React.ComponentProps<typeof DropdownMenuPrimitive.Portal>;

/**
 * Dropdown menu root component props extending Radix DropdownMenu.Root
 */
type DropdownMenuProps = React.ComponentProps<typeof DropdownMenuPrimitive.Root>;

/**
 * Dropdown menu radio group component props extending Radix DropdownMenu.RadioGroup
 */
type DropdownMenuRadioGroupProps = React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>;

/**
 * Dropdown menu radio item component props extending Radix DropdownMenu.RadioItem
 */
type DropdownMenuRadioItemProps = React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>;

/**
 * Dropdown menu separator component props extending Radix DropdownMenu.Separator
 */
type DropdownMenuSeparatorProps = React.ComponentProps<typeof DropdownMenuPrimitive.Separator>;

/**
 * Dropdown menu shortcut component props extending HTML span attributes
 */
type DropdownMenuShortcutProps = React.ComponentProps<'span'>;

/**
 * Dropdown menu sub content component props extending Radix DropdownMenu.SubContent
 */
type DropdownMenuSubContentProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>;

/**
 * Dropdown menu sub component props extending Radix DropdownMenu.Sub
 */
type DropdownMenuSubProps = React.ComponentProps<typeof DropdownMenuPrimitive.Sub>;

/**
 * Dropdown menu sub trigger component props extending Radix DropdownMenu.SubTrigger
 */
type DropdownMenuSubTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> & {
  /** Adds left padding for nested triggers */
  inset?: boolean;
};

/**
 * Dropdown menu trigger component props extending Radix DropdownMenu.Trigger
 */
type DropdownMenuTriggerProps = React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>;

/**
 * Root dropdown menu component built on Radix UI.
 * Provides accessible dropdown functionality with keyboard navigation.
 */
const DropdownMenuRoot: React.FC<DropdownMenuProps> = ({...props}) => (
  <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
);

/**
 * Dropdown menu trigger button component.
 * Use with asChild prop to render as any element.
 */
const DropdownMenuTrigger: React.FC<DropdownMenuTriggerProps> = ({...props}) => (
  <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />
);

/**
 * Dropdown menu portal component for rendering outside normal DOM tree.
 * Automatically used by DropdownMenuContent.
 */
const DropdownMenuPortal: React.FC<DropdownMenuPortalProps> = ({...props}) => (
  <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
);

/**
 * Main dropdown menu content container with animations and positioning.
 * Includes automatic portal rendering and responsive positioning.
 */
const DropdownMenuContent: React.FC<DropdownMenuContentProps> = ({className, sideOffset = 4, ...props}) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      className={cn(
        'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md',
        className
      )}
      data-slot="dropdown-menu-content"
      sideOffset={sideOffset}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
);

/**
 * Dropdown menu group container for organizing related menu items.
 * Provides semantic grouping without visual styling.
 */
const DropdownMenuGroup: React.FC<DropdownMenuGroupProps> = ({...props}) => (
  <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
);

/**
 * Individual dropdown menu item with hover and focus states.
 * Supports destructive variant for dangerous actions and inset padding.
 */
const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({className, inset, variant = 'default', ...props}) => (
  <DropdownMenuPrimitive.Item
    className={cn(
      "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    data-inset={inset}
    data-slot="dropdown-menu-item"
    data-variant={variant}
    {...props}
  />
);

/**
 * Dropdown menu label for section headers and descriptions.
 * Provides semantic labeling with consistent typography.
 */
const DropdownMenuLabel: React.FC<DropdownMenuLabelProps> = ({className, inset, ...props}) => (
  <DropdownMenuPrimitive.Label
    className={cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', className)}
    data-inset={inset}
    data-slot="dropdown-menu-label"
    {...props}
  />
);

/**
 * Dropdown menu separator for visual division between sections.
 * Provides subtle horizontal line with consistent spacing.
 */
const DropdownMenuSeparator: React.FC<DropdownMenuSeparatorProps> = ({className, ...props}) => (
  <DropdownMenuPrimitive.Separator
    className={cn('bg-border -mx-1 my-1 h-px', className)}
    data-slot="dropdown-menu-separator"
    {...props}
  />
);

/**
 * Dropdown menu keyboard shortcut display component.
 * Shows keyboard shortcuts with muted styling and proper spacing.
 */
const DropdownMenuShortcut: React.FC<DropdownMenuShortcutProps> = ({className, ...props}) => (
  <span
    className={cn('text-muted-foreground ml-auto text-xs tracking-widest', className)}
    data-slot="dropdown-menu-shortcut"
    {...props}
  />
);

/**
 * Dropdown menu checkbox item with indicator and checked state.
 * Provides accessible checkbox functionality within menu context.
 */
const DropdownMenuCheckboxItem: React.FC<DropdownMenuCheckboxItemProps> = ({
  checked,
  children,
  className,
  ...props
}) => (
  <DropdownMenuPrimitive.CheckboxItem
    checked={checked}
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    data-slot="dropdown-menu-checkbox-item"
    {...props}
  >
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <FontAwesomeIcon className="size-4" icon={faCheck} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>

    {children}
  </DropdownMenuPrimitive.CheckboxItem>
);

/**
 * Dropdown menu radio group container for mutually exclusive options.
 * Manages radio button state and accessibility within menu context.
 */
const DropdownMenuRadioGroup: React.FC<DropdownMenuRadioGroupProps> = ({...props}) => (
  <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />
);

/**
 * Dropdown menu radio item with indicator and selection state.
 * Provides accessible radio button functionality within menu context.
 */
const DropdownMenuRadioItem: React.FC<DropdownMenuRadioItemProps> = ({children, className, ...props}) => (
  <DropdownMenuPrimitive.RadioItem
    className={cn(
      "focus:bg-accent focus:text-accent-foreground relative flex cursor-default items-center gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
      className
    )}
    data-slot="dropdown-menu-radio-item"
    {...props}
  >
    <span className="pointer-events-none absolute left-2 flex size-3.5 items-center justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <FontAwesomeIcon className="size-2 fill-current" icon={faCircle} />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>

    {children}
  </DropdownMenuPrimitive.RadioItem>
);

/**
 * Dropdown menu sub-menu container for nested menu structures.
 * Provides hierarchical menu organization with proper state management.
 */
const DropdownMenuSub: React.FC<DropdownMenuSubProps> = ({...props}) => (
  <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
);

/**
 * Dropdown menu sub-menu trigger with chevron indicator.
 * Opens nested sub-menu on hover or keyboard interaction.
 */
const DropdownMenuSubTrigger: React.FC<DropdownMenuSubTriggerProps> = ({children, className, inset, ...props}) => (
  <DropdownMenuPrimitive.SubTrigger
    className={cn(
      'focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[inset]:pl-8',
      className
    )}
    data-inset={inset}
    data-slot="dropdown-menu-sub-trigger"
    {...props}
  >
    {children}

    <FontAwesomeIcon className="ml-auto size-4" icon={faChevronRight} />
  </DropdownMenuPrimitive.SubTrigger>
);

/**
 * Dropdown menu sub-menu content container with animations.
 * Provides nested menu content with consistent styling and positioning.
 */
const DropdownMenuSubContent: React.FC<DropdownMenuSubContentProps> = ({className, ...props}) => (
  <DropdownMenuPrimitive.SubContent
    className={cn(
      'bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-lg',
      className
    )}
    data-slot="dropdown-menu-sub-content"
    {...props}
  />
);

/**
 * Compound DropdownMenu component with sub-components as properties.
 * Provides accessible dropdown menu functionality with shared state management.
 */
const DropdownMenu = Object.assign(DropdownMenuRoot, {
  CheckboxItem: DropdownMenuCheckboxItem,
  Content: DropdownMenuContent,
  Group: DropdownMenuGroup,
  Item: DropdownMenuItem,
  Label: DropdownMenuLabel,
  Portal: DropdownMenuPortal,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  Separator: DropdownMenuSeparator,
  Shortcut: DropdownMenuShortcut,
  Sub: DropdownMenuSub,
  SubContent: DropdownMenuSubContent,
  SubTrigger: DropdownMenuSubTrigger,
  Trigger: DropdownMenuTrigger,
});

/**
 * Namespaced types for DropdownMenu compound component.
 * Access as DropdownMenuTypes.Props, DropdownMenuTypes.ItemProps, etc.
 */
type DropdownMenuTypes = {
  CheckboxItemProps: DropdownMenuCheckboxItemProps;
  ContentProps: DropdownMenuContentProps;
  GroupProps: DropdownMenuGroupProps;
  ItemProps: DropdownMenuItemProps;
  LabelProps: DropdownMenuLabelProps;
  PortalProps: DropdownMenuPortalProps;
  Props: DropdownMenuProps;
  RadioGroupProps: DropdownMenuRadioGroupProps;
  RadioItemProps: DropdownMenuRadioItemProps;
  SeparatorProps: DropdownMenuSeparatorProps;
  ShortcutProps: DropdownMenuShortcutProps;
  SubContentProps: DropdownMenuSubContentProps;
  SubProps: DropdownMenuSubProps;
  SubTriggerProps: DropdownMenuSubTriggerProps;
  TriggerProps: DropdownMenuTriggerProps;
};

export {DropdownMenu, type DropdownMenuTypes};
