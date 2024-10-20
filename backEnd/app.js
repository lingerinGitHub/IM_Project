const Koa = require('koa')
const app = new Koa()
//如果原来是用app.listen(3000);来启动服务，现在要改成用http来启动server
const httpServer = require('http').createServer(app.callback());
const { Server } = require("socket.io");
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
// const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const testRouter = require('./routes/testRouter')
const friend = require('./routes/friend')
const resource = require('./routes/resource')
const crosConfig = require('./config/crosConfig.js')
const cors = require('koa2-cors')
const { koaBody } = require('koa-body')
const koajwt = require('koa-jwt')
const unless = require('koa-unless')//指定条件跳过某中间件
const sessionHandler = require('./middlewares/sessionHandler.js') //引入session处理
const time = require('./utils/time.js')//生成时间戳
const socketHandler = require('./middlewares/socketHandler.js')
const { passKey } = require('./common/password.js')
const login = require('./routes/login.js');
const { error } = require('console');
const static = require('koa-static');
const path = require('path');
const register = require('./routes/register.js')

//socjet.io跨域配置
const corsOptions = {
  origin: ["http://localhost:5173"],
  // credentials: true
};
//socket.io
const io = new Server(httpServer, {
  // path: '/ws',
  pingTimeout: 30000,
  cors: corsOptions
});
// ----- app.js -----
// Regular middleware
// Note it's app.ws.use and not app.use

// 静态文件根目录
const staticPath = './public';


//首先处理跨域请求
app.use(
  cors(crosConfig)
);

//拦截401token解析异常中间件
// Custom 401 handling if you don't want to expose koa-jwt errors to users
app.use(async function (ctx, next) {
  return next().catch((err) => {
    switch (err.status) {
      case 401:
        console.log('捕获401token异常')
        ctx.status = 401;
        ctx.body = 'Protected resource, use Authorization header to get access\n';
        break;
      default: throw err;
    }
  });
});
//注册sessionHanlder中间件,匹配接口检查是否需要进行session操作，如登录、登出、注册等不需要，其他需要
sessionHandler(app, ['linger']);

socketHandler(io)



// error handler
onerror(app)

// middlewares

app.use(koaBody());
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger记录日志
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

//验证sessionid，token的中间件放这里，如果验证不通过，则返回错误信息,对某些接口放行



//routers
// 登录注销用中间件，不需要验证身份


// app.ws.use(basic.routes(), basic.allowedMethods())
// app.ws.use(chat.routes(), chat.allowedMethods())


// 以下路由需要验证身份
// 路由中间件
// app.use(koajwt({ secret: 'secretkey' }).unless({ path: [ '/token','/static', '/getHistory','/login', '/test', '/get', '/koa', '/', '/ws','/sessionTest', '/getFriendList'] }));
app.use(login.routes(), login.allowedMethods())
app.use(resource.routes(), resource.allowedMethods())
app.use(testRouter.routes(), testRouter.allowedMethods())
app.use(register.routes(), register.allowedMethods())
//接下来的路由检查cookie是否含有内容
app.use(async (ctx,next)=>{
  console.log('中间件:检测cookie内容')
  console.log(ctx.session.id)
  await next()
})

app.use(friend.routes(), friend.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = httpServer
