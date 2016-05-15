"use strict";

var _ = require("lodash");

var User = require("./user/user");
var File = require("./file/file");
var generator = require("./generator");

function signUpWithHelloWorld(params) {
  return generator.helloworld(params);
}

function signUpWithFolder(params) {
  return generator.folder(params);
}


module.exports = _.extend({}, User, File, {
  // signUp: signUpWithHelloWorld
  signUp: signUpWithFolder
});
