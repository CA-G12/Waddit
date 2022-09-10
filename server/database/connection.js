require('dotenv').config();
const { Pool } = require('pg');

const { NODE_ENV, DATABASE_URL, DEV_DB_URL, TEST_DB_URL } = process.env;

let connectionString = "";
let ssl = false;
console.log(NODE_ENV);
switch (NODE_ENV) {
  case "production":
    connectionString = DATABASE_URL;
    ssl = {
      rejectUnauthorized: false,
    };
    break;
  case "development":
    connectionString = DEV_DB_URL;
    break;

  case "test":
    connectionString = TEST_DB_URL;
    break;

  default:
    throw new Error("invalid db url");
}

const connection = new Pool({
  connectionString,
  ssl,
});

module.exports = connection;
