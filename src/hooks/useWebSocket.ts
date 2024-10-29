import { useEffect, useCallback } from 'react';
import { websocketService } from '../services/websocketService';

export function useWebSocket<T>(type: string, handler: (data: T) => void) {
  useEffect(() => {
    const unsubscribe = websocketService.subscribe(type, handler);
    return () => unsubscribe();
  }, [type, handler]);

  const send = useCallback((data: any) => {
    websocketService.send(type, data);
  }, [type]);

  return { send };
}