"user strict";

var pool = require("../../db/pool");
var SQL = require("../../db/sql");
var _ = require("lodash");
var JWT = require('../user/jwt');


//登陆
function login(param) {
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      var _sql = SQL.Login
        .replace("{account}", param.account)
        .replace("{password}", param.password);
      connection.query(_sql, function(err, rows) {
        if (err) {
          resolve({
            code: "10000",
            errMsg: "登陆失败"
          });
        } else {
          if (rows.length === 0) {
            resolve({
              code: 10000,
              errMsg: "登陆失败"
            });
          } else {
            resolve({
              code: 200,
              data: {
                uid: rows[0].id,
                name: rows[0].name,
                cache: rows[0].cache,
                token: JWT.encode(rows[0].id)
              }
            });
          }
        }
        connection.release();
      });
    });
  });
}

//注册
function signUp(params) {
  //先检查用户是否存在
  return _checkUserHasExits(params.account).then(function(isExists) {
    if (isExists) {
      return {
        code: 10001,
        errMsg: "用户已存在"
      }
    } else {
      return new Promise(function(resolve, reject) {
        var _sql = SQL.SignUp
          .replace("{account}", params.account)
          .replace("{password}", params.password)
          .replace("{name}", params.name);
        pool.getConnection(function(err, connection) {
          connection.query(_sql, function(err, rows) {
            resolve({
              code: 200,
              data: {
                uid: rows.insertId,
                name: params.name,
                cache: "",
                token: JWT.encode(rows.insertId)
              }
            });
            connection.release();
          });
        });
      })
    }
  });
}

function _checkUserHasExits(account) {
  var _sql = SQL.CheckUserHasExits.replace("{account}", account);
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(_sql, function(err, rows) {
        if (err || rows.length !== 0) {
          resolve(true);
        } else {
          resolve(false);
        }
        connection.release();
      });
    });
  });
}


function updateUserCache(params) {
  var _sql = SQL.updateUserCache
    .replace("{uid}", params.uid)
    .replace("{cache}", params.cache);
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(_sql, function(err, rows) {
        if (err) {
          resolve({
            code: 10003,
            errMsg: "更新cache失败"
          });
        } else {
          resolve({
            code: 200
          });
        }
        connection.release();
      });
    });
  });
}


module.exports = {
  login: login,
  signUp: signUp,
  updateUserCache: updateUserCache
};
