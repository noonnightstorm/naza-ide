"use strict";

var SQL = require("./sql");

function init(pool) {
  //先清除数据
  // deleteData(pool);
  //生成用户表格
  var userPromise = createUserTable(pool);
  //生成文件表格
  var filePromise = createFileTable(pool);
  //生成用户－文件的表格
  var linkPromise = createLinkTable(pool);

}

function deleteData(pool) {
  var userPromise = new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(SQL.DeleteData[0], function(err, rows) {
        if (err) {
          console.log(err);
        }
        connection.release();
        resolve();
      });
    });
  });
  var filePromise = new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(SQL.DeleteData[1], function(err, rows) {
        if (err) {
          console.log(err);
        }
        connection.release();
      });
    });
  });
  var linkPromise = new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(SQL.DeleteData[2], function(err, rows) {
        if (err) {
          console.log(err);
        }
        connection.release();
      });
    });
  });

  return Promise.all([userPromise, filePromise, linkPromise]);
}

function createUserTable(pool) {
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(SQL.CreateUser, function(err, rows) {
        if (err) {
          console.log(err);
        }
        resolve();
        connection.release();
      });
    });
  });
}

function createFileTable(pool) {
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(SQL.CreateFileList, function(err, rows) {
        if (err) {
          console.log(err);
        }
        resolve();
        connection.release();
      });
    });
  });
}

function createLinkTable(pool) {
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(SQL.CreateUserFileLink, function(err, rows) {
        if (err) {
          console.log(err);
        }
        resolve();
        connection.release();
      });
    });
  });
}



module.exports = init;
