export default () => {
  const {
    DATABASE_HOST,
    DATABASE_PORT,
    DATABASE_NAME,
    DATABASE_USER,
    DATABASE_PWD,
  } = process.env;

  return {
    database: {
      host: DATABASE_HOST,
      port: Number.parseInt(DATABASE_PORT, 10),
      name: DATABASE_NAME,
      username: DATABASE_USER,
      password: DATABASE_PWD,
    },
  };
};
