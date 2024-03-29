module.exports = {
  server: "sql_server.database.windows.net",
  authentication: {
    type: "default",
    options: {
      userName: "username",
      password: "password",
    },
  },
  options: {
    database: "database_name",
    encrypt: true,
  },
};
