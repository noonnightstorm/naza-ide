"use strict";

var SQL = require("./sql");

function init(pool) {
  //先清除数据
  deleteData(pool);
  //生成用户表格
  // createUserTable(pool);
  //生成文件表格
  // createFileTable(pool);
  //生成用户－文件的表格
  // createLinkTable(pool);
}

function deleteData(pool) {
  pool.getConnection(function(err, connection) {
    connection.query(SQL.DeleteData[0], function(err, rows) {
      if (err) {
        console.log(err);
      }
      connection.release();
    });
  });
  pool.getConnection(function(err, connection) {
    connection.query(SQL.DeleteData[1], function(err, rows) {
      if (err) {
        console.log(err);
      }
      connection.release();
    });
  });
  pool.getConnection(function(err, connection) {
    connection.query(SQL.DeleteData[2], function(err, rows) {
      if (err) {
        console.log(err);
      }
      connection.release();
    });
  });
}

function createUserTable(pool) {

  pool.getConnection(function(err, connection) {
    connection.query(SQL.CreateUser, function(err, rows) {
      if (err) {
        console.log(err);
      }
      connection.release();
    });
  });

}

function createFileTable(pool) {

  pool.getConnection(function(err, connection) {
    connection.query(SQL.CreateFileList, function(err, rows) {
      if (err) {
        console.log(err);
      }
      connection.release();
    });
  });

}

function createLinkTable(pool) {

  pool.getConnection(function(err, connection) {
    connection.query(SQL.CreateUserFileLink, function(err, rows) {
      if (err) {
        console.log(err);
      }
      connection.release();
    });
  });

}

module.exports = init;
