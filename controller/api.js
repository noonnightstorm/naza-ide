"use strict";

var _ = require("lodash");

var User = require("./user/user");
var File = require("./file/file");

module.exports = _.extend({}, User, File);
