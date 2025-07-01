/**
 * Real-time subscription hooks for Supabase database changes
 * Provides automatic subscription management with cleanup
 */

import {type RealtimeChannel} from '@supabase/supabase-js';
import {useEffect, useRef} from 'react';

import {supabase} from '@/lib/supabase';

type RealtimePayload<T = Record<string, unknown>> = {
  errors: Error[] | null;
  eventType: SubscriptionEvent;
  new: null | T;
  old: null | T;
};

type SubscriptionCallback<T = Record<string, unknown>> = (payload: RealtimePayload<T>) => void;

type SubscriptionEvent = '*' | 'DELETE' | 'INSERT' | 'UPDATE';

type UseRealtimeSubscriptionOptions = {
  /** Whether the subscription is enabled */
  enabled?: boolean;
  /** Event types to listen for (default: '*' for all) */
  event?: SubscriptionEvent;
  /** Optional filter for the subscription */
  filter?: string;
  /** Database table to subscribe to */
  table: string;
};

/**
 * Hook for managing real-time subscriptions to Supabase tables
 * Automatically handles subscription lifecycle and cleanup
 */
export const useRealtimeSubscription = <_T = Record<string, unknown>>(
  options: UseRealtimeSubscriptionOptions,
  callback: SubscriptionCallback<_T>
) => {
  const {enabled = true, event = '*', filter, table} = options;
  const channelRef = useRef<null | RealtimeChannel>(null);
  const callbackRef = useRef(callback);

  // Keep callback reference current
  useEffect(() => void (callbackRef.current = callback), [callback]);

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
    (
      channel as RealtimeChannel & {
        on: (
          event: string,
          config: Record<string, unknown>,
          callback: (payload: RealtimePayload) => void
        ) => RealtimeChannel;
      }
    ).on(
      'postgres_changes',
      {
        event,
        filter,
        schema: 'public',
        table,
      },
      (payload: unknown) => callbackRef.current(payload as RealtimePayload<_T>)
    );

    // Subscribe to the channel
    channel.subscribe(status => {
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
        void supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [table, event, filter, enabled]);

  // Cleanup on unmount
  useEffect(
    () => () => {
      if (channelRef.current) {
        void supabase.removeChannel(channelRef.current);
      }
    },
    []
  );
};

/**
 * Hook for subscribing to character changes for a specific user
 * Convenience wrapper around useRealtimeSubscription
 */
export const useCharacterSubscription = (userId: null | string, callback: SubscriptionCallback) =>
  useRealtimeSubscription(
    {
      enabled: userId != null,
      filter: userId != null ? `user_id=eq.${userId}` : undefined,
      table: 'characters',
    },
    callback
  );

/**
 * Hook for subscribing to character progress changes for a specific character
 * Monitors job progress, skill progress, etc.
 */
export const useCharacterProgressSubscription = (characterId: null | string, callback: SubscriptionCallback) => {
  useRealtimeSubscription(
    {
      enabled: characterId != null,
      filter: characterId != null ? `character_id=eq.${characterId}` : undefined,
      table: 'character_job_progress',
    },
    callback
  );

  useRealtimeSubscription(
    {
      enabled: characterId != null,
      filter: characterId != null ? `character_id=eq.${characterId}` : undefined,
      table: 'character_skill_progress',
    },
    callback
  );
};
