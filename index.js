var app = require('koa')();
var path = require("path");

//路由设置
var router = require("./router");
app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(process.env.PORT || 5000);
