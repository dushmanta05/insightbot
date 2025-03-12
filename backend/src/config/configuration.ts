export default () => {
  const {
    APP_PORT,
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PWD,
    API_URL,
    API_TOKEN,
    MODEL_NAME,
    FRONTEND_ALLOWED_ORIGINS,
    WEBSOCKET_ALLOWED_ORIGINS,
  } = process.env;

  return {
    app: {
      port: Number.parseInt(APP_PORT, 10),
    },
    database: {
      host: DATABASE_HOST,
      port: Number.parseInt(DATABASE_PORT, 10),
      name: DATABASE_NAME,
      username: DATABASE_USER,
      password: DATABASE_PWD,
    },
    modelConfig: {
      url: API_URL,
      token: API_TOKEN,
      model: MODEL_NAME,
    },
    allowedOrigins: {
      frontend: FRONTEND_ALLOWED_ORIGINS
        ? JSON.parse(FRONTEND_ALLOWED_ORIGINS)
        : [],
      websocket: WEBSOCKET_ALLOWED_ORIGINS
        ? JSON.parse(WEBSOCKET_ALLOWED_ORIGINS)
        : [],
    },
  };
};
