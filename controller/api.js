var pool = require("../db/pool");
var SQL = require("../db/sql");
var _ = require("lodash");
var JWT = require('./login/jwt');

// 文件列表的获取
function getFileList(params) {
  return new Promise(function(resolve, reject) {
    var _sql = SQL.GetFileList
      .replace("{fileId}", params.fileId)
      .replace("{uid}", params.uid);
    pool.getConnection(function(err, connection) {
      connection.query(_sql, function(err, rows) {
        if (err) {
          reject(err);
        } else {
          resolve({
            code: 200,
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
            code: 200,
            data: {
              fileId: rows.insertId
            }
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
              code: 200,
              data: {
                fileId: data.fileId
              }
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
  return getFileList(id).then(function(list) {
    var ids = list.data.map(function(item) {
      return item.id;
    });
    ids.push(id);
    return ids;
  }).then(function(ids) {
    var queue = [];
    ids.forEach(function(id) {
      // del link first
      var _delLinkPromise = new Promise(function(resolve, reject) {
        var _delLinkSql = SQL.delLink.replace("{fileId}", id);
        pool.getConnection(function(err, connection) {
          connection.query(_delLinkSql, function(err, rows) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
            connection.release();
          });
        });
      });
      // del file next
      var _delFilePromise = new Promise(function(resolve, reject) {
        var _delFileSql = SQL.delFile.replace("{fileId}", id);
        pool.getConnection(function(err, connection) {
          connection.query(_delFileSql, function(err, rows) {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
            connection.release();
          });
        });
      });

      queue.push(_delLinkPromise);
      queue.push(_delFilePromise);
    });

    return Promise.all(queue);
  });
}

function getFile(id) {
  if (!id) {
    return Promise.resolve({
      code: 11000,
      errMsg: "请输入查询文件的id"
    });
  }
  id = parseInt(id);
  var _getFileSql = SQL.getFile.replace("{fileId}", id);
  return new Promise(function(resolve, reject) {
    pool.getConnection(function(err, connection) {
      connection.query(_getFileSql, function(err, rows) {
        if (err || rows.length === 0) {
          reject(err);
        } else {
          resolve({
            code: 200,
            data: rows[0]
          });
        }
        connection.release();
      });
    });
  });
}

function updateFile(params) {
  return getFile(params.id).then(function(data) {
    var file = _.extend({}, data, params);
    var _updateFileSql = SQL.updateFile
      .replace("{name}", file.name)
      .replace("{content}", file.content)
      .replace("{fileId}", file.id);
    return new Promise(function(resolve, reject) {
      pool.getConnection(function(err, connection) {
        connection.query(_updateFileSql, function(err, rows) {
          if (err) {
            reject(err);
          } else {
            resolve({
              code: 200,
              data: file
            });
          }
          connection.release();
        });
      });
    });
  });
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
              code: 10000,
              errMsg: "登陆失败"
            });
          } else {
            resolve({
              code: 200,
              data: {
                uid: rows[0].id,
                name: rows[0].name,
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




module.exports = {
  getFileList: getFileList,
  getFile: getFile,
  addFile: addFile,
  delFile: delFile,
  updateFile: updateFile,
  login: login,
  signUp: signUp
};
