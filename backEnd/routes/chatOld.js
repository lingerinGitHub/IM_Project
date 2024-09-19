const mysql = require('../utils/mysql_connect.js');
const knex = require('../config/knex_config.js');
const { redis0 } = require('../utils/redis_connect.js');
const sessionHandler = require('../middlewares/sessionHandler.js')
const time = require('../utils/time.js')
const fs = require('fs');


const router = require('koa-router')()

router.prefix('/chat')

//使用组件knex链式调用使用mysql
router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
  knex.select('*').from('user').where('user_name', "张三")
    .then(res => {
      console.log(res)
    })
    .catch(err => {
      console.log(err)
    })
})

router.get('/getChatTest', async function (ctx, next) {
  const luascript = await fs.readFileSync(__dirname + '\\..\\lua\\B2BchatGetByPage.lua', 'utf-8');
  const luaresult = await redis0.eval(luascript, 1 ,'chat1', '1', '3');
  console.log(luaresult)
  ctx.body = luaresult
  // return luaresult
})

router.get('/setChatTest', async function (ctx, next) {
  const luascript = await fs.readFileSync(__dirname + '\\..\\lua\\B2BchatInsert.lua', 'utf-8');
  const luaresult = await redis0.eval(luascript, 2 , 'chat1', time.getTimestamp(), Date.now(), '更改时间戳之后的聊天记录7');
  console.log(luaresult)
  ctx.body = luaresult
  // return luaresult
})

router.get('/getChatByGapTest', async function (ctx, next) {
  const luascript = await fs.readFileSync(__dirname + '\\..\\lua\\chatGetByDateGap.lua', 'utf-8');
  const luaresult = await redis0.eval(luascript, 1 ,'chat1', '20240813173416', '20240813163306');
  console.log(luaresult)
  ctx.body = luaresult
  // return luaresult
})


router.get('/test', async function (ctx, next) {
  try {
    // 等待 set 操作完成
    await  redis0.set('name', 'zhangsan')
    // 读取 Lua 脚本  
    const luaScript = await fs.readFileSync(__dirname + '\\..\\lua\\B2BchatGet.lua', 'utf-8');
    // 执行 Lua 脚本
    const pagenum = 0;
    const pagesize = 4;
    const key = 'chat1';
    const res = await redis0.eval(luaScript, 3, key, pagenum, pagesize);//严格遵循数据结构，需要是字符串
    // const res = await redis0.get('name');
    // const res = await redis0.eval("return redis.call('keys','*')",0)
    console.log(res.length)
    ctx.body = res
  } catch {
    ctx.body = 'error'
  }
})

module.exports = router
