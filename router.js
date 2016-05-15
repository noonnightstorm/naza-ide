var router = require('koa-router')();
var API = require("./controller/api");
var _ = require("lodash");

router.get('/', function*(next) {
  this.body = yield readFileThunk(__dirname + '/assets/index.html');
});

router.get("/login", function*(next) {
  this.body = yield readFileThunk(__dirname + '/assets/login.html');
});

router.post("/api/login", function*(next) {
  var user = yield API.login({
    account: this.body.account,
    password: this.body.password
  });
  this.cookies.set('uid', user.uid, {
    httpOnly: true
  });
  this.body = user;
});

router.post("/api/signUp", function*(next) {
  var user = yield API.signUp({
    name: this.body.name,
    account: this.body.account,
    password: this.body.password
  });
  this.cookies.set('uid', user.uid, {
    httpOnly: true
  });
  this.body = user;
});

router.get('/api/getFileList', function*(next) {
  var fileId = parseInt(_.get(this.request.query, "id") || -1);
  this.body = yield API.getFileList(fileId);
});

router.delete('/api/delFile/:id', function*(next) {
  var fileId = this.params.id;
  API.delFile(fileId);
  this.body = "ok";
});

router.post('/api/addFile', function*(next) {
  this.body = yield API.addFile({
    uid: this.cookies.get("uid"),
    parentId: this.body.parentId || -1,
    name: this.body.name,
    type: this.body.type
  });
});

module.exports = router;


//直接读取静态文件
var fs = require('fs');
var readFileThunk = function(src) {
  return new Promise(function(resolve, reject) {
    fs.readFile(src, { 'encoding': 'utf8' }, function(err, data) {
      if (err) return reject(err);
      resolve(data);
    });
  });
}
