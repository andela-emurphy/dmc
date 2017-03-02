require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DEV_DB_USERNAME,
    password: process.env.PASS,
    database: process.env.DEV_DB,
    host: process.env.DEV_DB_HOST,
    port: process.env.DEV_DB_PORT,
    dialect: process.env.DEV_DB_DIALECT
  },
  test: {
    username: process.env.TEST_DB_USERNAME,
    password: process.env.TEST_DB_PASS,
    database: process.env.TEST_DB,
    host: process.env.TEST_DB_HOST,
    port: process.env.TEST_DB_PORT,
    dialect: process.env.TEST_DB_DIALECT
  },
  production: {
    username: process.env.PRODUCTION_USERNAME,
    password: process.env.PRODUCTION_PASS,
    database: process.env.PRODUCTION_DB,
    host: process.env.PRODUCTION_HOST,
    port: process.env.PRODUCTION_PORT,
    dialect: process.env.PRODUCTION_DIALECT
  }
};
