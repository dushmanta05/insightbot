export default () => {
  const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PWD,
    API_URL,
    API_TOKEN,
    MODEL_NAME,
  } = process.env;

  return {
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
  };
};
