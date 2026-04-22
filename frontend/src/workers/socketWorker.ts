declare const self: SharedWorkerGlobalScope;
declare const io: unknown;

interface SocketMessage {
  type: string;
  event?: string;
  payload?: unknown;
  wsUrl?: string;
  data?: unknown;
  id?: string;
  error?: string;
}

let socket: unknown = null;
const ports: MessagePort[] = [];

function connectSocket(wsUrl: string): void {
  if (socket) return;

  importScripts('https://cdn.socket.io/4.5.4/socket.io.min.js');
  socket = io(wsUrl, {
    autoConnect: true,
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    broadcast({ type: 'connect', id: socket.id });
  });

  socket.on('connect_error', (error: Error) => {
    broadcast({ type: 'connect_error', error: error.message });
  });

  socket.on('assistantResponse', (data: unknown) => {
    broadcast({ type: 'assistantResponse', data });
  });
}

function broadcast(message: SocketMessage): void {
  for (const port of ports) {
    port.postMessage(message);
  }
}

self.onconnect = (e: MessageEvent): void => {
  const port = e.ports[0];
  ports.push(port);

  port.onmessage = (e: MessageEvent): void => {
    const data = e.data as SocketMessage;

    if (data.type === 'init') {
      connectSocket(data.wsUrl!);
      port.postMessage({ type: 'initialized' });
    } else if (data.type === 'emit' && data.event) {
      if (socket) {
        socket.emit(data.event, data.payload);
      }
    }
  };

  if (socket?.connected) {
    port.postMessage({ type: 'connect', id: socket.id });
  }

  port.start();
};
