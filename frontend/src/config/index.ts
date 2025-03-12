const { VITE_API_URL, VITE_WS_URL, VITE_SESSION_ID } = import.meta.env;

const config = {
  apiUrl: VITE_API_URL,
  wsUrl: VITE_WS_URL,
  sessionId: VITE_SESSION_ID,
};

export default config;
