import {cn} from '@/lib/utils';

/**
 * Card component props extending HTML div attributes
 */
type CardProps = React.ComponentProps<'div'>;

/**
 * Card header component props extending HTML div attributes
 */
type CardHeaderProps = React.ComponentProps<'div'>;

/**
 * Card title component props extending HTML div attributes
 */
type CardTitleProps = React.ComponentProps<'div'>;

/**
 * Card description component props extending HTML div attributes
 */
type CardDescriptionProps = React.ComponentProps<'div'>;

/**
 * Card action component props extending HTML div attributes
 */
type CardActionProps = React.ComponentProps<'div'>;

/**
 * Card content component props extending HTML div attributes
 */
type CardContentProps = React.ComponentProps<'div'>;

/**
 * Card footer component props extending HTML div attributes
 */
type CardFooterProps = React.ComponentProps<'div'>;

/**
 * Main card container component with elevation and rounded styling
 * Provides a flexible foundation for content cards
 *
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Optional description</CardDescription>
 *   </CardHeader>
 *
 *   <CardContent>
 *     Main content goes here
 *   </CardContent>
 * </Card>
 * ```
 */
const Card: React.FC<CardProps> = ({className, ...props}) => (
  <div
    className={cn(
      'bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm',
      className
    )}
    data-slot="card"
    {...props}
  />
);

/**
 * Card header component with grid layout for title and action areas
 * Automatically handles layout when action components are present
 */
const CardHeader: React.FC<CardHeaderProps> = ({className, ...props}) => (
  <div
    className={cn(
      '@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6',
      className
    )}
    data-slot="card-header"
    {...props}
  />
);

/**
 * Card title component with consistent typography
 * Should be used within CardHeader for proper layout
 */
const CardTitle: React.FC<CardTitleProps> = ({className, ...props}) => (
  <div
    className={cn('leading-none font-semibold', className)}
    data-slot="card-title"
    {...props}
  />
);

/**
 * Card description component with muted text styling
 * Provides secondary information below the title
 */
const CardDescription: React.FC<CardDescriptionProps> = ({
  className,
  ...props
}) => (
  <div
    className={cn('text-muted-foreground text-sm', className)}
    data-slot="card-description"
    {...props}
  />
);

/**
 * Card action component positioned in the top-right of the header
 * Used for buttons, icons, or other interactive elements
 */
const CardAction: React.FC<CardActionProps> = ({className, ...props}) => (
  <div
    className={cn(
      'col-start-2 row-span-2 row-start-1 self-start justify-self-end',
      className
    )}
    data-slot="card-action"
    {...props}
  />
);

/**
 * Card content area with consistent padding
 * Contains the main body content of the card
 */
const CardContent: React.FC<CardContentProps> = ({className, ...props}) => (
  <div className={cn('px-6', className)} data-slot="card-content" {...props} />
);

/**
 * Card footer component with horizontal layout
 * Typically used for actions or additional information
 */
const CardFooter: React.FC<CardFooterProps> = ({className, ...props}) => (
  <div
    className={cn('flex items-center px-6 [.border-t]:pt-6', className)}
    data-slot="card-footer"
    {...props}
  />
);

export {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
};
export type {
  CardActionProps,
  CardContentProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardProps,
  CardTitleProps,
};
