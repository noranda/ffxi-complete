/**
 * Shared types for authentication components
 *
 * This file contains common types used across multiple auth components
 * to promote reusability and consistency.
 */

/**
 * Authentication callback function types
 * Standardized callbacks for auth component interactions
 */
export type AuthCallbacks = {
  /** Callback when user cancels the current action */
  onCancel?: () => void;
  /** Callback when user forgot their password */
  onForgotPassword?: () => void;
  /** Callback when authentication is successful */
  onSuccess?: () => void;
  /** Callback when user wants to switch to login */
  onSwitchToLogin?: () => void;
  /** Callback when user wants to reset password */
  onSwitchToPasswordReset?: () => void;
  /** Callback when user wants to switch to register */
  onSwitchToRegister?: () => void;
};

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
 * Registration form specific data
 */
export type RegisterFormData = {
  confirmPassword: string;
  email: string;
  password: string;
};
