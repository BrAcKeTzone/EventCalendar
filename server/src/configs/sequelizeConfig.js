const { Sequelize } = require("sequelize");
const mysql = require("mysql2/promise");
require("dotenv").config();

const createDatabaseIfNotExists = async () => {
  const { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  
  try {
    // Connect to MySQL server
    const connection = await mysql.createConnection({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
    });

    // Check if database exists, create if not
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
    console.log(`Database ${DB_NAME} checked/created successfully.`);

    // Close the connection
    await connection.end();
  } catch (error) {
    console.error("Error creating database:", error);
    throw error; // Re-throw the error to handle it in the calling code
  }
};

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

module.exports = { sequelize, createDatabaseIfNotExists };
