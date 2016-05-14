var app = require('koa')();
var path = require("path");
var cors = require('koa-cors');

//允许跨域 todo 只允许部分域
app.use(cors());

//路由设置
var router = require("./router");
app
  .use(router.routes())
  .use(router.allowedMethods());


app.listen(process.env.PORT || 5000);
