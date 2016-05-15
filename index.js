var app = require('koa')();
var path = require("path");
var cors = require('koa-cors');
var body = require('koa-better-body');
var bearerToken = require('koa-bearer-token');

//允许跨域 todo 只允许部分域
app.use(cors());

//body param
app.use(body());
app.use(bearerToken());

app.use(function*(next) {

  if (/\/api\/*/.test(this.request.path)) {
    var exceptUrl = [
      "/api/login",
      "/api/signUp"
    ];
    var isExcept = false;
    for (var i = 0; i < exceptUrl.length; i++) {
      if (this.request.path.indexOf(exceptUrl[i]) !== -1) {
        isExcept = true;
        break;
      }
    }
    if (!this.request.token && !isExcept) {
      this.body = {
        code: 10000,
        errMsg: "登录失效"
      }
    } else {
      yield next;
    }

  } else {
    yield next;
  }
});

//路由设置
var router = require("./router");
app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(process.env.PORT || 5000);
