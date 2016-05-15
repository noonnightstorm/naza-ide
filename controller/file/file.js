"user strict";

var pool = require("../../db/pool");
var SQL = require("../../db/sql");
var _ = require("lodash");
var JWT = require('../user/jwt');
var Tool = require("../tool/tool");

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

function addFile(params) {
  //add file table first
  return new Promise(function(resolve, reject) {
    var _sql = SQL.addFile
      .replace("{name}", params.name)
      .replace("{content}", params.content || "")
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
    //add link table next
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

function delFile(params) {
  // get file first
  return getFileList(params).then(function(list) {
    var ids = list.data.map(function(item) {
      return item.id;
    });
    ids.push(params.fileId);
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

    return Promise.all(queue).then(function() {
      return {
        code: 200
      }
    })
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
    var file = _.extend({}, data.data, params);
    var _updateFileSql = SQL.updateFile
      .replace("{name}", file.name)
      .replace("{content}", Tool.encodeCode(file.content || ""))
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

module.exports = {
  getFileList: getFileList,
  getFile: getFile,
  addFile: addFile,
  delFile: delFile,
  updateFile: updateFile
};
