/**
 * Real-time subscription hooks for Supabase database changes
 * Provides automatic subscription management with cleanup
 */

import {useEffect, useRef} from 'react';
import {RealtimeChannel} from '@supabase/supabase-js';

import {supabase} from '@/lib/supabase';

type SubscriptionEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

type RealtimePayload<T = Record<string, unknown>> = {
  eventType: SubscriptionEvent;
  new: T | null;
  old: T | null;
  errors: Error[] | null;
};

type SubscriptionCallback<T = Record<string, unknown>> = (payload: RealtimePayload<T>) => void;

type UseRealtimeSubscriptionOptions = {
  /** Database table to subscribe to */
  table: string;
  /** Event types to listen for (default: '*' for all) */
  event?: SubscriptionEvent;
  /** Optional filter for the subscription */
  filter?: string;
  /** Whether the subscription is enabled */
  enabled?: boolean;
};

/**
 * Hook for managing real-time subscriptions to Supabase tables
 * Automatically handles subscription lifecycle and cleanup
 * 
 * @example
 * ```tsx
 * useRealtimeSubscription({
 *   table: 'characters',
 *   filter: `user_id=eq.${userId}`,
 *   enabled: !!userId
 * }, (payload) => {
 *   console.log('Character updated:', payload.new);
 *   // Invalidate queries or update state
 * });
 * ```
 */
export const useRealtimeSubscription = <T = Record<string, unknown>>(
  options: UseRealtimeSubscriptionOptions,
  callback: SubscriptionCallback<T>
) => {
  const {table, event = '*', filter, enabled = true} = options;
  const channelRef = useRef<RealtimeChannel | null>(null);
  const callbackRef = useRef(callback);

  // Keep callback reference current
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    // Create unique channel name
    const channelName = `${table}_${filter ?? 'all'}_${event}`;
    
    // Create subscription channel following documented pattern
    const channel = supabase.channel(channelName);
    
    // Add postgres_changes listener
    // Using type assertion to bypass TypeScript overload issues
    (channel as RealtimeChannel & {
      on: (event: string, config: Record<string, unknown>, callback: (payload: RealtimePayload<T>) => void) => RealtimeChannel;
    }).on(
      'postgres_changes',
      {
        event,
        schema: 'public',
        table,
        filter,
      },
      (payload: RealtimePayload<T>) => {
        callbackRef.current(payload);
      }
    );

    // Subscribe to the channel
    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED') {
        console.log(`🔄 Subscribed to ${table} changes`);
      } else if (status === 'CHANNEL_ERROR') {
        console.error(`❌ Subscription error for ${table}:`, status);
      }
    });

    channelRef.current = channel;

    // Cleanup subscription on unmount or dependency change
    return () => {
      if (channelRef.current) {
        console.log(`🔄 Unsubscribing from ${table} changes`);
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, event, filter, enabled]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, []);
};

/**
 * Hook for subscribing to character changes for a specific user
 * Convenience wrapper around useRealtimeSubscription
 */
export const useCharacterSubscription = (
  userId: string | null,
  callback: SubscriptionCallback
) => {
  useRealtimeSubscription(
    {
      table: 'characters',
      filter: userId ? `user_id=eq.${userId}` : undefined,
      enabled: !!userId,
    },
    callback
  );
};

/**
 * Hook for subscribing to character progress changes for a specific character
 * Monitors job progress, skill progress, etc.
 */
export const useCharacterProgressSubscription = (
  characterId: string | null,
  callback: SubscriptionCallback
) => {
  useRealtimeSubscription(
    {
      table: 'character_job_progress',
      filter: characterId ? `character_id=eq.${characterId}` : undefined,
      enabled: !!characterId,
    },
    callback
  );

  useRealtimeSubscription(
    {
      table: 'character_skill_progress',
      filter: characterId ? `character_id=eq.${characterId}` : undefined,
      enabled: !!characterId,
    },
    callback
  );
}; 