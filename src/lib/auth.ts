import type {AuthError, User} from '@supabase/supabase-js';

import {supabase} from './supabase';

/**
 * Authentication utility functions for the FFXI Progress Tracker
 *
 * This module provides:
 * - Type-safe authentication operations
 * - Comprehensive error handling
 * - OAuth provider support
 * - Session management utilities
 *
 * All functions include proper error handling and return consistent
 * result objects for easy consumption in React components.
 */

// Authentication result types for consistent error handling
export type AuthResult<T = User> = {
  data: T | null;
  error: string | null;
  success: boolean;
};

export type AuthProvider = 'discord' | 'google' | 'apple';

/**
 * Sign up a new user with email and password
 *
 * @param email - User's email address
 * @param password - User's password (minimum 6 characters)
 * @returns Promise with user data or error message
 *
 * @example
 * ```typescript
 * const result = await signUp('user@example.com', 'password123');
 * if (result.success) {
 *   console.log('User created:', result.data?.email);
 * } else {
 *   console.error('Signup failed:', result.error);
 * }
 * ```
 */
export const signUp = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const {data, error} = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      return {
        data: null,
        error: getAuthErrorMessage(error),
        success: false,
      };
    }

    return {
      data: data.user,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected signup error:', err);
    return {
      data: null,
      error: 'An unexpected error occurred during signup',
      success: false,
    };
  }
};

/**
 * Sign in an existing user with email and password
 *
 * @param email - User's email address
 * @param password - User's password
 * @returns Promise with user data or error message
 *
 * @example
 * ```typescript
 * const result = await signIn('user@example.com', 'password123');
 * if (result.success) {
 *   console.log('User signed in:', result.data?.email);
 * } else {
 *   console.error('Login failed:', result.error);
 * }
 * ```
 */
export const signIn = async (
  email: string,
  password: string
): Promise<AuthResult> => {
  try {
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        data: null,
        error: getAuthErrorMessage(error),
        success: false,
      };
    }

    return {
      data: data.user,
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected login error:', err);
    return {
      data: null,
      error: 'An unexpected error occurred during login',
      success: false,
    };
  }
};

/**
 * Sign in with OAuth provider (Discord, Google, Apple)
 *
 * @param provider - OAuth provider to use
 * @returns Promise with success status or error message
 *
 * @example
 * ```typescript
 * const result = await signInWithOAuth('discord');
 * if (!result.success) {
 *   console.error('OAuth failed:', result.error);
 * }
 * // If successful, user will be redirected to provider
 * ```
 */
export const signInWithOAuth = async (
  provider: AuthProvider
): Promise<Omit<AuthResult, 'data'>> => {
  try {
    const {error} = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        error: getAuthErrorMessage(error),
        success: false,
      };
    }

    return {
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected OAuth error:', err);
    return {
      error: 'An unexpected error occurred during OAuth login',
      success: false,
    };
  }
};

/**
 * Send password reset email to user
 *
 * @param email - User's email address
 * @returns Promise with success status or error message
 *
 * @example
 * ```typescript
 * const result = await resetPassword('user@example.com');
 * if (result.success) {
 *   console.log('Reset email sent successfully');
 * } else {
 *   console.error('Reset failed:', result.error);
 * }
 * ```
 */
export const resetPassword = async (
  email: string
): Promise<Omit<AuthResult, 'data'>> => {
  try {
    const {error} = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      return {
        error: getAuthErrorMessage(error),
        success: false,
      };
    }

    return {
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected password reset error:', err);
    return {
      error: 'An unexpected error occurred while sending reset email',
      success: false,
    };
  }
};

/**
 * Update user password (requires current session)
 *
 * @param newPassword - New password for the user
 * @returns Promise with success status or error message
 *
 * @example
 * ```typescript
 * const result = await updatePassword('newPassword123');
 * if (result.success) {
 *   console.log('Password updated successfully');
 * } else {
 *   console.error('Password update failed:', result.error);
 * }
 * ```
 */
export const updatePassword = async (
  newPassword: string
): Promise<Omit<AuthResult, 'data'>> => {
  try {
    const {error} = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return {
        error: getAuthErrorMessage(error),
        success: false,
      };
    }

    return {
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected password update error:', err);
    return {
      error: 'An unexpected error occurred while updating password',
      success: false,
    };
  }
};

/**
 * Sign out the current user
 *
 * @returns Promise with success status or error message
 *
 * @example
 * ```typescript
 * const result = await signOut();
 * if (result.success) {
 *   console.log('User signed out successfully');
 * } else {
 *   console.error('Signout failed:', result.error);
 * }
 * ```
 */
export const signOut = async (): Promise<Omit<AuthResult, 'data'>> => {
  try {
    const {error} = await supabase.auth.signOut();

    if (error) {
      return {
        error: getAuthErrorMessage(error),
        success: false,
      };
    }

    return {
      error: null,
      success: true,
    };
  } catch (err) {
    console.error('Unexpected signout error:', err);
    return {
      error: 'An unexpected error occurred during signout',
      success: false,
    };
  }
};

/**
 * Get the current user session
 *
 * @returns Promise with current user or null
 *
 * @example
 * ```typescript
 * const user = await getCurrentUser();
 * if (user) {
 *   console.log('Current user:', user.email);
 * } else {
 *   console.log('No user signed in');
 * }
 * ```
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const {
      data: {user},
    } = await supabase.auth.getUser();
    return user;
  } catch (err) {
    console.error('Error getting current user:', err);
    return null;
  }
};

/**
 * Convert Supabase AuthError to user-friendly message
 * Provides specific messages for common authentication errors
 *
 * @param error - Supabase AuthError object
 * @returns User-friendly error message
 */
const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.message) {
    case 'Invalid login credentials':
    case 'Email not confirmed':
      return 'Invalid email or password. Please check your credentials.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.';
    case 'Email rate limit exceeded':
      return 'Too many email requests. Please wait a few minutes before trying again.';
    case 'Token has expired or is invalid':
      return 'Your session has expired. Please sign in again.';
    default:
      // Log the original error for debugging while showing generic message
      console.error('Auth error:', error);
      return 'Authentication failed. Please try again.';
  }
};

/**
 * Validate email format
 * Simple email validation for client-side feedback
 *
 * @param email - Email address to validate
 * @returns True if email format appears valid
 *
 * @example
 * ```typescript
 * if (!isValidEmail(email)) {
 *   setError('Please enter a valid email address');
 * }
 * ```
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Checks minimum requirements for password security
 *
 * @param password - Password to validate
 * @returns Object with validation result and requirements
 *
 * @example
 * ```typescript
 * const validation = validatePassword(password);
 * if (!validation.isValid) {
 *   setError(validation.requirements.join(', '));
 * }
 * ```
 */
export const validatePassword = (password: string) => {
  const requirements: string[] = [];

  if (password.length < 6) {
    requirements.push('at least 6 characters');
  }

  if (!/[A-Z]/.test(password)) {
    requirements.push('one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    requirements.push('one lowercase letter');
  }

  if (!/\d/.test(password)) {
    requirements.push('one number');
  }

  return {
    isValid: requirements.length === 0,
    requirements,
    strength: getPasswordStrength(password),
  };
};

/**
 * Calculate password strength score
 * Returns a score from 0-4 based on password complexity
 *
 * @param password - Password to analyze
 * @returns Strength score (0=very weak, 4=very strong)
 */
const getPasswordStrength = (password: string): number => {
  let score = 0;

  // Length bonus
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety bonus
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return Math.min(score, 4);
};
