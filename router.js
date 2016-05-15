var router = require('koa-router')();
var API = require("./controller/api");
var _ = require("lodash");
var JWT = require("./controller/user/jwt")

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
  if (_.get(user, "code") === 200) {
    this.cookies.set('uid', _.get(user, "data.uid"), {
      domain: "30.9.165.122",
      httpOnly: true
    });
  }
  this.body = user;
});

router.post("/api/signUp", function*(next) {
  var user = yield API.signUp({
    name: this.body.name,
    account: this.body.account,
    password: this.body.password
  });
  if (_.get(user, "code") === 200) {
    this.cookies.set('uid', _.get(user, "data.uid"), {
      httpOnly: true
    });
  }
  this.body = user;
});

router.put("/api/updateUserCache", function*(next) {
  var uid = parseInt(JWT.decode(this.request.token));
  this.body = yield API.updateUserCache({
    uid: uid,
    cache: this.body.cache
  });
});

router.get('/api/getFileList', function*(next) {
  var uid = parseInt(JWT.decode(this.request.token));
  var fileId = parseInt(_.get(this.request.query, "id") || -1);
  this.body = yield API.getFileList({
    uid: uid,
    fileId: fileId
  });
});

router.get('/api/getFile', function*(next) {
  var fileId = _.get(this.request.query, "id");
  this.body = yield API.getFile(fileId);
});

router.delete('/api/delFile/:id', function*(next) {
  var fileId = this.params.id;
  API.delFile(fileId);
  this.body = "ok";
});

router.post('/api/addFile', function*(next) {
  this.body = yield API.addFile({
    uid: JWT.decode(this.request.token),
    parentId: this.body.parentId || -1,
    name: this.body.name,
    type: this.body.type
  });
});

router.put('/api/updateFile', function*(next) {
  this.body = yield API.updateFile({
    id: this.body.id,
    name: this.body.name,
    content: this.body.content
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
