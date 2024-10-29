import { useState, useEffect, useCallback } from 'react';
import { SessionState } from '../types/api';
import { useWebSocket } from './useWebSocket';
import { SessionService } from '../services/sessionService';

export function useSession(sessionId: string) {
  const [session, setSession] = useState<SessionState | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const handleSessionUpdate = useCallback((updatedSession: SessionState) => {
    setSession(updatedSession);
  }, []);

  const { send } = useWebSocket<SessionState>('session_update', handleSessionUpdate);

  useEffect(() => {
    const unsubscribe = SessionService.subscribeToSession(sessionId, (session) => {
      setSession(session);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [sessionId]);

  const updateSession = useCallback((update: Partial<SessionState>) => {
    send({ sessionId, update });
  }, [sessionId, send]);

  return {
    session,
    loading,
    error,
    updateSession
  };
}