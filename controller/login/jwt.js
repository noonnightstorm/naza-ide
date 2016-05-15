"use strict";

var jwt = require('jsonwebtoken');
var secret = 'I am very handsome!';


function encode(key) {
  return jwt.sign(key, secret);
}

function decode(token) {
  return jwt.verify(token, secret);
}

module.exports = {
  encode: encode,
  decode: decode
}
