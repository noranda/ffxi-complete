/**
 * Centralized export file for all custom React hooks
 * Provides convenient single import location for hook consumers
 */

// Authentication hooks - exported from AuthContext
export {useAuth, useIsAuthenticated} from '@/contexts/AuthContext';

// Real-time subscription hooks
export {
  useCharacterProgressSubscription,
  useCharacterSubscription,
  useRealtimeSubscription,
} from './useRealtimeSubscription';
