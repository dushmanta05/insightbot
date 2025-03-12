import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import App from './App.tsx';
import { socket, WebsocketProvider } from './contexts/WebsocketContext.tsx';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <WebsocketProvider value={socket}>
        <App />
      </WebsocketProvider>
    </StrictMode>
  );
} else {
  console.error('Root element not found');
}
