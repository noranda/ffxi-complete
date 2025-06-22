import type {AuthError, User} from '@supabase/supabase-js';

import {supabase} from './supabase';

/**
 * Authentication utility functions for FFXI Complete
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

export type AuthProvider = 'apple' | 'discord' | 'google';

// Authentication result types for consistent error handling
export type AuthResult<T = User> = {
  data: null | T;
  error: null | string;
  success: boolean;
};

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, password: string): Promise<AuthResult> => {
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
 */
export const signIn = async (email: string, password: string): Promise<AuthResult> => {
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
 */
export const signInWithOAuth = async (provider: AuthProvider): Promise<Omit<AuthResult, 'data'>> => {
  try {
    const {error} = await supabase.auth.signInWithOAuth({
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
      provider,
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
 */
export const resetPassword = async (email: string): Promise<Omit<AuthResult, 'data'>> => {
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
 */
export const updatePassword = async (newPassword: string): Promise<Omit<AuthResult, 'data'>> => {
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
 * Update user profile metadata (requires current session)
 */
export const updateProfile = async (profileData: {
  display_name?: string;
  full_name?: string;
}): Promise<Omit<AuthResult, 'data'>> => {
  try {
    const {error} = await supabase.auth.updateUser({
      data: profileData,
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
    console.error('Unexpected profile update error:', err);
    return {
      error: 'An unexpected error occurred while updating profile',
      success: false,
    };
  }
};

/**
 * Sign out the current user
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
 */
export const getCurrentUser = async (): Promise<null | User> => {
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
 */
const getAuthErrorMessage = (error: AuthError): string => {
  switch (error.message) {
    case 'Email not confirmed':
    case 'Invalid login credentials':
      return 'Invalid email or password. Please check your credentials.';
    case 'Email rate limit exceeded':
      return 'Too many email requests. Please wait a few minutes before trying again.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'Token has expired or is invalid':
      return 'Your session has expired. Please sign in again.';
    case 'Unable to validate email address: invalid format':
      return 'Please enter a valid email address.';
    case 'User already registered':
      return 'An account with this email already exists. Please sign in instead.';
    default:
      // Log the original error for debugging while showing generic message
      console.error('Auth error:', error);
      return 'Authentication failed. Please try again.';
  }
};

/**
 * Validate email format
 * Simple email validation for client-side feedback
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * Checks minimum requirements for password security
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
