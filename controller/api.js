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
                content: item.content,
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

}

function delFile(id) {

}

function getFile(id) {

}

function updateFile(id) {

}

//登陆
function login(param) {

}

//注册
function signUp(param) {

}




module.exports = {
  getFileList: getFileList
};
