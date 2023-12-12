import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '******', //Edit this
  database: 'portfolio',
});

export default pool;
