"use strict";

var mysql = require('mysql');

var pool = mysql.createPool({
  connectionLimit: 5,
  host: '127.0.0.1',
  user: 'root',
  password: '1991820lgb',
  database: 'naza'
});


require("./init")(pool);

module.exports = pool;
