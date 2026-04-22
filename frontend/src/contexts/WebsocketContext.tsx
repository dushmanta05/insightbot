import { createContext, useContext, type ReactNode } from 'react';
import { useSharedSocket } from '../hooks/useSharedSocket';

interface SocketContextValue {
  on: (event: string, callback: (data: unknown) => void) => () => void;
  off: (event: string) => void;
  emit: (event: string, payload?: unknown) => void;
  isConnected: boolean;
  socketId: string | null;
}

const WebsocketContext = createContext<SocketContextValue | null>(null);

interface WebsocketProviderProps {
  children: ReactNode;
}

export function WebsocketProvider({ children }: WebsocketProviderProps) {
  const socket = useSharedSocket();

  return <WebsocketContext.Provider value={socket}>{children}</WebsocketContext.Provider>;
}

export function useSocket(): SocketContextValue {
  const context = useContext(WebsocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a WebsocketProvider');
  }
  return context;
}
