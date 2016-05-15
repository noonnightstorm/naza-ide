var pool = require("../db/pool");
var SQL = require("../db/sql");

// 文件列表的获取
function getFileList(id) {
  return new Promise(function(resolve, reject) {
    var _sql = SQL.GetFileList.replace("{id}", id);
    pool.getConnection(function(err, connection) {
      connection.query(_sql, function(err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve({
            data: rows.map(function(item) {
              return {
                id: item.id,
                parentId: item.parent_id,
                name: item.name,
                type: item.type
              }
            })
          });
        }
        connection.release();
      });
    });
  });
}

// 文件的增删查改
function addFile(params) {
  //先添加进file表
  return new Promise(function(resolve, reject) {
    var _sql = SQL.addFile
      .replace("{name}", params.name)
      .replace("{content}", params.content)
      .replace("{type}", params.type);
    pool.getConnection(function(err, connection) {
      connection.query(_sql, function(err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve({
            fileId: rows.insertId
          });
        }
        connection.release();
      });
    });
  }).then(function(data) {
    return new Promise(function(resolve, reject) {
      var _sql = SQL.addFileLink
        .replace("{uid}", params.uid)
        .replace("{fileId}", data.fileId)
        .replace("{parentId}", params.parentId);
      pool.getConnection(function(err, connection) {
        connection.query(_sql, function(err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve({
              fileId: data.fileId
            });
          }
          connection.release();
        });
      });

    });
  });
}

function delFile(id) {
  //先查询子目录
  getFileList(id).then(function(list) {
    console.log(list);
  });
}

function getFile(id) {

}

function updateFile(id) {

}

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
              code: "10000",
              errMsg: "登陆失败"
            });
          } else {
            resolve({
              uid: rows[0].id,
              name: rows[0].name
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
              uid: rows.insertId,
              name: params.name
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




module.exports = {
  getFileList: getFileList,
  addFile: addFile,
  delFile: delFile,
  login: login,
  signUp: signUp
};
