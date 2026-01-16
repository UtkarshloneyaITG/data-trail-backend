const { Sequelize } = require('@sequelize/core');
const { PostgresDialect } = require('@sequelize/postgres');
require('dotenv').config();

const sequelize = new Sequelize({
  dialect: PostgresDialect,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USERNAME,     // <-- MUST be `user`
  password: process.env.DB_PASSWORD,
  ssl: process.env.DB_SSL === 'true'
    ? { require: true, rejectUnauthorized: false }
    : false,

  clientMinMessages: 'notice',
  logging: false,
});

module.exports = sequelize;
