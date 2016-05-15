"use strict";

var _ = require("lodash");

var User = require("./user/user");
var File = require("./file/file");

function signUpWithHelloWorld(params) {
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

    return data;
  });
}

module.exports = _.extend({}, User, File, {
  signUp: signUpWithHelloWorld
});
