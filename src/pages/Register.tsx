/**
 * Registration page component
 *
 * Features:
 * - Centered registration form with responsive layout
 * - Navigation callbacks for routing (to be connected to router in Phase 4)
 * - Redirect handling via callback props
 * - Full viewport height layout with proper centering
 */

import {RegisterForm} from '@/components/auth/RegisterForm';
import {useAuth} from '@/contexts/AuthContext';

/**
 * Props for the Register page component
 */
type RegisterProps = {
  /** Callback when user successfully registers */
  onRegistrationSuccess?: () => void;
  /** Callback when user wants to switch to login */
  onSwitchToLogin?: () => void;
};

/**
 * Registration page component
 *
 * Provides a full-page layout for user registration with navigation callbacks.
 * In Phase 4, this will be connected to the router for automatic navigation.
 *
 * @example
 * ```tsx
 * <Register
 *   onRegistrationSuccess={() => window.location.href = '/dashboard'}
 *   onSwitchToLogin={() => window.location.href = '/login'}
 * />
 * ```
 */
export const Register: React.FC<RegisterProps> = ({
  onRegistrationSuccess,
  onSwitchToLogin,
}) => {
  const {isAuthenticated} = useAuth();

  // In Phase 4, this will use react-router for navigation
  if (isAuthenticated && onRegistrationSuccess) {
    onRegistrationSuccess();
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <RegisterForm
          onSuccess={onRegistrationSuccess}
          onSwitchToLogin={onSwitchToLogin}
        />
      </div>
    </div>
  );
};
