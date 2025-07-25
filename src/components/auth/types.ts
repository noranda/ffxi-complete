/**
 * Shared types for authentication components
 *
 * This file contains common types used across multiple auth components
 * to promote reusability and consistency.
 */

/**
 * Auth form validation state
 */
export type AuthFormState = {
  errors: FormErrors;
  isSubmitting: boolean;
  submitSuccess: boolean;
  touched: Record<string, boolean>;
};

/**
 * Common auth form props
 * Base props that most auth forms will need
 */
export type BaseAuthFormProps = {
  /** Additional CSS classes */
  className?: string;
  /** Whether the form is disabled */
  disabled?: boolean;
  /** Whether the form is in a loading state */
  loading?: boolean;
};

/**
 * Common form validation errors structure
 * Used across login, register, password reset forms
 */
export type FormErrors = {
  confirmPassword?: string;
  email?: string;
  general?: string;
  password?: string;
};

/**
 * Login form specific data
 */
export type LoginFormData = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

/**
 * OAuth provider types
 */
export type OAuthProvider = 'apple' | 'discord' | 'google';

/**
 * Password reset form data
 */
export type PasswordResetFormData = {
  email: string;
};

/**
 * Password update form data
 */
export type PasswordUpdateFormData = {
  confirmNewPassword: string;
  currentPassword: string;
  newPassword: string;
};

/**
 * Protected route authentication state
 * Passed to function children for auth-aware rendering
 */
export type ProtectedRouteAuthState = {
  isAuthenticated: boolean;
  loading: boolean;
};

/**
 * Registration form specific data
 */
export type RegisterFormData = {
  confirmPassword: string;
  email: string;
  password: string;
};
