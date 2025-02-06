module.exports = {
  development: {
    username: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    dialect: process.env.DIALECT
  },
  test: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    dialect: process.env.DIALECT
  },
  production: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.DBHOST,
    dialect: process.env.DIALECT
  }
};