import { createContext } from 'react';
import { io, type Socket } from 'socket.io-client';

import config from '../config';

export const socket = io(config.wsUrl, {
  autoConnect: true,
  transports: ['websocket'],
});

socket.on('connect', () => {
  console.log('WebSocket connected!');
});

socket.on('connect_error', (error) => {
  console.error('WebSocket connection error:', error);
});

export const WebsocketContext = createContext<Socket>(socket);
export const WebsocketProvider = WebsocketContext.Provider;
