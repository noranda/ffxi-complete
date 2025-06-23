/**
 * Authentication components
 *
 * This module contains:
 * - AuthErrorBoundary - Error boundary for authentication flows with retry functionality ✅
 * - RegisterForm - Registration form with validation and comprehensive error handling ✅
 * - OAuthButtons - OAuth provider buttons with individual loading states and error handling ✅
 * - SuccessMessage - Success notification component for auth flows ✅
 * - LoginForm - Login form with email/password and OAuth authentication ✅
 * - PasswordResetForm - Password reset flow component ✅
 * - ProtectedRoute - Route guard for authenticated areas ✅
 * - UserMenu - User profile dropdown in app bar ✅
 * - UserProfile - User profile management with settings and account preferences ✅
 */

export {AuthErrorBoundary} from './AuthErrorBoundary';
export {LoginForm} from './LoginForm';
export {OAuthButtons} from './OAuthButtons';
export {PasswordChangeForm} from './PasswordChangeForm';
export {PasswordFieldWithStrength} from './PasswordFieldWithStrength';
export {PasswordResetForm} from './PasswordResetForm';
export {ProfileForm} from './ProfileForm';
export {ProtectedRoute, type ProtectedRouteProps} from './ProtectedRoute';
// Export types

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

export {UserMenu} from './UserMenu';
export {UserProfile} from './UserProfile';
