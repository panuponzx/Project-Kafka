const util = require('util');
const mysql = require('mysql2');
require('dotenv').config();
const {DB_Database,DB_host,DB_pass,DB_user} = process.env
//database  connection
const DBconfig = {
  host : DB_host,
  user : DB_user,
  password : DB_pass,
  database : DB_Database,
};
//database checks connection
const pool = mysql.createConnection(DBconfig);
// Convert the "query" method to a promise-based method
pool.query = util.promisify(pool.query);

// Handle connection errors
pool.connect((err) => {
  if (err) {
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('Database connection was closed');
    }
    if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('Database has too many connections');
    }
    if (err.code === 'ECONNREFUSED') {
      console.error('Database connection was refused');
    }
  } else {
    console.log('Database connection');
  }
});
//exports
module.exports = pool;