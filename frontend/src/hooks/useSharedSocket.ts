import { useState, useEffect, useRef, useCallback } from 'react';
import config from '../config';

type EventCallback = (data: any) => void;
type CleanupFunction = () => void;

interface SocketListeners {
  [event: string]: EventCallback[];
}

export function useSharedSocket() {
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [socketId, setSocketId] = useState<string | null>(null);
  const workerRef = useRef<SharedWorker | null>(null);
  const listenersRef = useRef<SocketListeners>({});

  useEffect(() => {
    try {
      workerRef.current = new SharedWorker('/src/workers/socketWorker.ts', { type: 'module' });

      workerRef.current.port.postMessage({
        type: 'init',
        wsUrl: config.wsUrl,
      });

      workerRef.current.port.onmessage = (event) => {
        const { type, data, id, error } = event.data;

        if (type === 'connect') {
          setIsConnected(true);
          setSocketId(id);
        } else if (type === 'connect_error') {
          setIsConnected(false);
          console.error('Socket connection error:', error);
        } else if (type === 'assistantResponse' && listenersRef.current?.assistantResponse) {
          for (const callback of listenersRef.current.assistantResponse) {
            callback(data);
          }
        }
      };

      workerRef.current.port.start();

      return () => {
        workerRef.current?.port.close();
      };
    } catch (err) {
      console.error('SharedWorker not supported or error:', err);
    }
  }, []);

  const on = useCallback((event: string, callback: EventCallback): CleanupFunction => {
    if (!listenersRef.current[event]) {
      listenersRef.current[event] = [];
    }
    listenersRef.current[event].push(callback);

    return () => {
      listenersRef.current[event] = listenersRef.current[event].filter((cb) => cb !== callback);
    };
  }, []);

  const emit = useCallback((event: string, payload?: any): void => {
    if (workerRef.current) {
      workerRef.current.port.postMessage({
        type: 'emit',
        event,
        payload,
      });
    }
  }, []);

  const off = useCallback((event: string): void => {
    if (listenersRef.current[event]) {
      delete listenersRef.current[event];
    }
  }, []);

  return {
    on,
    off,
    emit,
    isConnected,
    socketId,
  };
}
