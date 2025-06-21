/**
 * Authentication components
 *
 * This module contains:
 * - RegisterForm - Registration form with validation and comprehensive error handling ✅
 * - OAuthButtons - Reusable OAuth provider buttons with consistent styling ✅
 * - SuccessMessage - Success notification component for auth flows ✅
 * - LoginForm - Login form with email/password and OAuth (coming next)
 * - PasswordResetForm - Password reset flow component (coming next)
 * - UserMenu - User profile dropdown in app bar (coming next)
 * - ProtectedRoute - Route guard for authenticated areas (coming next)
 */

export {OAuthButtons} from './OAuthButtons';
export {PasswordFieldWithStrength} from './PasswordFieldWithStrength';
export {RegisterForm} from './RegisterForm';
export {SuccessMessage} from './SuccessMessage';

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
