module.exports = {
  server: "azurestaticappdb.database.windows.net",
  authentication: {
    type: "default",
    options: {
      userName: "useradmin",
      password: "Staticwebapp@123",
    },
  },
  options: {
    database: "testDB",
    encrypt: true,
  },
};
