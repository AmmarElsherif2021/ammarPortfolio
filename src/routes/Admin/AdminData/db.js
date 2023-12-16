import mysql from 'mysql2/promise';
require('dotenv').config();
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'portfolio',
});

export default pool;

