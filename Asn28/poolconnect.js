const mysql = require("mysql2");
//we are creating connection to mysql
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "westsidenode",
  password: "Conscious@555",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = pool;
