"use strict";

var User = require("./user/user");
var File = require("./file/file");
var Tool = require("./tool/tool");

function helloworld(params) {
  return User.signUp(params).then(function(data) {
    //新建文件夹
    return File.addFile({
      uid: data.data.uid,
      name: "helloworld",
      parentId: -1,
      type: 0,
      content: ""
    }).then(function(folder) {
      var jsPromise = File.addFile({
        uid: data.data.uid,
        name: "index.js",
        parentId: folder.data.fileId,
        type: 1,
        content: ""
      });
      var htmlPromise = File.addFile({
        uid: data.data.uid,
        name: "index.html",
        parentId: folder.data.fileId,
        type: 2,
        content: ""
      });
      var cssPromise = File.addFile({
        uid: data.data.uid,
        name: "index.css",
        parentId: folder.data.fileId,
        type: 3,
        content: ""
      });
      return Promise.all([jsPromise, htmlPromise, cssPromise]);
    }).then(function() {
      return data;
    });
  });
}

var Fs = require("fs");
var Path = require("path");
var Url = require("url");

var TYPE = {
  JS: ["ts", "js"],
  CSS: ["css", "scss"],
  HTML: ["html"]
}

function folder(params) {
  return User.signUp(params).then(function(data) {
    if (data.code === 200) {
      _create(Path.resolve(__dirname, "../folderTest/nz-editor"), data.data.uid, -1);
    }
    return data;
  });
}

function _create(path, uid, parentId) {
  var fileList = Fs.readdirSync(path);
  var queue = [];
  //录入数据库
  for (var i = 0; i < fileList.length; i++) {
    var tmpPath = Path.resolve(path, fileList[i]);
    var tmpStat = Fs.lstatSync(tmpPath);
    var isFolder = tmpStat.isDirectory();
    isFolder ? 0 : _genType(fileList[i]);
    isFolder ? "" : _readFile(tmpPath);
    var _promise = File.addFile({
      uid: uid,
      name: fileList[i],
      parentId: parentId,
      type: isFolder ? 0 : _genType(fileList[i]),
      content: isFolder ? "" : _readFile(tmpPath)
    });
    queue.push({
      isFolder: isFolder,
      path: tmpPath,
      uid: uid,
      promise: _promise
    });
  }
  queue.forEach(function(item) {
    item.promise.then(function(data) {
      if (item.isFolder) {
        _create(item.path, item.uid, data.data.fileId);
      }
    }).catch(function(e) {
      console.log(e);
    })
  });
}

function _genType(filename) {
  var extname = Path.extname(filename).replace(".", "");
  if (TYPE.JS.indexOf(extname) !== -1) {
    return 1;
  } else if (TYPE.CSS.indexOf(extname) !== -1) {
    return 3;
  } else if (TYPE.HTML.indexOf(extname) !== -1) {
    return 2;
  } else {
    return 0;
  }
}

function _readFile(path) {
  var content = "";
  try {
    content = Fs.readFileSync(path, 'utf-8');
    content = Tool.encodeCode(content);
  } catch (e) {
    console.log(e);
  }
  return content;
}

module.exports = {
  helloworld: helloworld,
  folder: folder
}
