/**
 * Props for the SuccessMessage component
 */
export type SuccessMessageProps = {
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
 */
export const SuccessMessage: React.FC = ({message = 'Operation completed successfully.', show, title = 'Success!'}) => {
  if (!show) {
    return null;
  }

  return (
    <div className="rounded-md border border-green-200 bg-green-50 p-4 text-green-800">
      <div className="font-medium">{title}</div>
      <div className="mt-1 text-sm">{message}</div>
    </div>
  );
};
