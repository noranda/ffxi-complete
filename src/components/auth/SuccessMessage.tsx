/**
 * Props for the SuccessMessage component
 */
type SuccessMessageProps = {
  /** Success message content */
  message?: string;
  /** Whether to show the success message */
  show: boolean;
  /** Success message title */
  title?: string;
};

/**
 * Success notification component for authentication flows
 *
 * Features:
 * - Green-themed success styling
 * - Customizable title and message content
 * - Conditional display based on show prop
 * - Accessible notification structure
 *
 * @example
 * ```tsx
 * <SuccessMessage
 *   message="Please check your email to confirm your account before signing in."
 *   show={submitSuccess}
 *   title="Registration successful!"
 * />
 * ```
 */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({
  message = 'Operation completed successfully.',
  show,
  title = 'Success!',
}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="rounded-md bg-green-50 border border-green-200 p-4 text-green-800">
      <div className="font-medium">{title}</div>
      <div className="text-sm mt-1">{message}</div>
    </div>
  );
};
