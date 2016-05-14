var router = require('koa-router')();
var API = require("./controller/api");
var _ = require("lodash");

router.get('/', function*(next) {
  this.body = yield readFileThunk(__dirname + '/assets/index.html');
});

router.get('/api/getFileList', function*(next) {
  var fileId = parseInt(_.get(this.request.query, "id") || -1);
  this.body = yield API.getFileList(fileId);
});

router.get('/api/addFile', function*(next) {
  var fileId = parseInt(_.get(this.request.query, "id") || -1);
  this.body = "ok";
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
