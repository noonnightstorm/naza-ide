"use strict";

var mysql = require('mysql');

var pool = null;

var argv = process.argv.splice(2);
if (argv.length !== 0 && argv[0] === "dev") {
  pool = mysql.createPool({
    connectionLimit: 5,
    host: '127.0.0.1',
    user: 'root',
    password: '1991820lgb',
    database: 'naza'
  });
} else {
  pool = mysql.createPool({
    connectionLimit: 5,
    host: 'us-cdbr-iron-east-04.cleardb.net',
    user: 'b4a98c891b2116',
    password: '26679e13',
    database: 'heroku_08458ec7cefc249'
  });
}


require("./init")(pool);

module.exports = pool;
