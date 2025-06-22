/**
 * Authentication components
 *
 * This module contains:
 * - RegisterForm - Registration form with validation and comprehensive error handling ✅
 * - OAuthButtons - Reusable OAuth provider buttons with consistent styling ✅
 * - SuccessMessage - Success notification component for auth flows ✅
 * - LoginForm - Login form with email/password and OAuth authentication ✅
 * - PasswordResetForm - Password reset flow component ✅
 * - ProtectedRoute - Route guard for authenticated areas ✅
 * - UserMenu - User profile dropdown in app bar (coming next)
 */

export {LoginForm} from './LoginForm';
export {OAuthButtons} from './OAuthButtons';
export {PasswordFieldWithStrength} from './PasswordFieldWithStrength';
export {PasswordResetForm} from './PasswordResetForm';
export {ProtectedRoute} from './ProtectedRoute';
// Export types
export type {ProtectedRouteProps} from './ProtectedRoute';
export {RegisterForm} from './RegisterForm';

export {SuccessMessage} from './SuccessMessage';
export type * from './types';

// Export shared types for use by other components
export type {
  AuthCallbacks,
  AuthFormState,
  BaseAuthFormProps,
  FormErrors,
  LoginFormData,
  OAuthProvider,
  PasswordResetFormData,
  PasswordUpdateFormData,
  RegisterFormData,
} from './types';
