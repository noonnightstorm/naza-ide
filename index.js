var koa = require('koa');
const app = new koa();

app.use(function*() {
  this.body = 'Hello World';
});

app.listen(process.env.PORT || 5000);
