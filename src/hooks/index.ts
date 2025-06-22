/**
 * Centralized export file for all custom React hooks
 * Provides convenient single import location for hook consumers
 */

// Real-time subscription hooks
export {
  useCharacterProgressSubscription,
  useCharacterSubscription,
  useRealtimeSubscription,
} from './useRealtimeSubscription';

// Authentication hooks - exported from AuthContext
export {useAuth, useIsAuthenticated} from '@/contexts/AuthContext';
