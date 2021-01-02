const mysql = require("mysql");

var pool = mysql.createPool({
  connectionLimit: 10,
  host: "localhost",
  user: "root",
  password: "root",
  database: "cms",
});

exports.query = function (sqlStr) {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        return reject(err);
      }
      connection.query(sqlStr, (err, ...args) => {
        connection.release();
        if (err) {
          return reject(err);
        }
        resolve(...args);
      });
    });
  });
};
