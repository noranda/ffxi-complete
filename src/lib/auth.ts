import type {AuthError, Session, User} from '@supabase/supabase-js';

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

export type AuthProvider = 'discord' | 'google';

// Authentication result types for consistent error handling
export type AuthResult<T = User> = {
  data: null | T;
  error: null | string;
  success: boolean;
};

export type AuthResultNoData = {
  error: null | string;
  success: boolean;
};

export type SessionInfoResult = {
  error: null | string;
  expiresAt: null | number;
  expiresIn: null | number;
  isExpired: boolean;
  needsRefresh: boolean;
  session: null | Session;
};

export type SessionRefreshResult = {
  error: null | string;
  session: null | Session;
  success: boolean;
};

export type SessionValidationResult = {
  error: null | string;
  isValid: boolean;
  session: null | Session;
};

/**
 * Sign up a new user with email and password
 */
export const signUp = async (email: string, password: string): Promise => {
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
export const signIn = async (email: string, password: string): Promise => {
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
export const signInWithOAuth = async (provider: AuthProvider): Promise => {
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
export const resetPassword = async (email: string): Promise => {
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
export const updatePassword = async (newPassword: string): Promise => {
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
export const updateProfile = async (profileData: {display_name?: string; full_name?: string}): Promise => {
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
export const signOut = async (): Promise => {
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
export const getCurrentUser = async (): Promise => {
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

/**
 * Validates the current session and checks if it's still valid
 *
 * This function checks if the current session exists and is not expired.
 * It can be used to validate sessions before making authenticated requests.
 */
export const validateSession = async (): Promise => {
  try {
    const {
      data: {session},
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return {
        error: error.message,
        isValid: false,
        session: null,
      };
    }

    if (!session) {
      return {
        error: null,
        isValid: false,
        session: null,
      };
    }

    // Check if session is expired
    const now = Date.now();
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;

    if (expiresAt > 0 && now >= expiresAt) {
      return {
        error: 'Session expired',
        isValid: false,
        session,
      };
    }

    return {
      error: null,
      isValid: true,
      session,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error validating session',
      isValid: false,
      session: null,
    };
  }
};

/**
 * Manually refresh the current session
 *
 * This function attempts to refresh the current session using the refresh token.
 * It's useful for proactive session refresh or recovering from expired sessions.
 */
export const refreshSession = async (): Promise => {
  try {
    const {data, error} = await supabase.auth.refreshSession();

    if (error) {
      return {
        error: error.message,
        session: null,
        success: false,
      };
    }

    return {
      error: null,
      session: data.session,
      success: true,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error refreshing session',
      session: null,
      success: false,
    };
  }
};

/**
 * Get session information including expiry details
 *
 * This function provides detailed session information including
 * time until expiry and whether the session needs refresh.
 */
export const getSessionInfo = async (): Promise => {
  try {
    const {
      data: {session},
      error,
    } = await supabase.auth.getSession();

    if (error) {
      return {
        error: error.message,
        expiresAt: null,
        expiresIn: null,
        isExpired: false,
        needsRefresh: false,
        session: null,
      };
    }

    if (!session) {
      return {
        error: null,
        expiresAt: null,
        expiresIn: null,
        isExpired: false,
        needsRefresh: false,
        session: null,
      };
    }

    const now = Date.now();
    const expiresAt = session.expires_at ? session.expires_at * 1000 : 0;
    const expiresIn = expiresAt > 0 ? Math.max(0, expiresAt - now) : null;
    const isExpired = expiresAt > 0 && now >= expiresAt;
    const needsRefresh = expiresAt > 0 && expiresIn !== null && expiresIn < 5 * 60 * 1000; // Refresh if < 5 minutes

    return {
      error: null,
      expiresAt: expiresAt > 0 ? expiresAt : null,
      expiresIn,
      isExpired,
      needsRefresh,
      session,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : 'Unknown error getting session info',
      expiresAt: null,
      expiresIn: null,
      isExpired: false,
      needsRefresh: false,
      session: null,
    };
  }
};
