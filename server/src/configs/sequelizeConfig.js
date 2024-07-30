const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
require("dotenv").config();

const createDatabaseIfNotExists = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
  await connection.end();
};

const initializeSequelize = async () => {
  await createDatabaseIfNotExists();

  const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: "mysql",
      dialectOptions: {
        connectTimeout: 120000,
      },
    }
  );

  return sequelize;
};

module.exports = initializeSequelize();
