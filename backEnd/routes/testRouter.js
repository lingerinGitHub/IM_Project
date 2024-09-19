const router = require('koa-router')()
const koajwt = require('koa-jwt')


router.get('sessionTest', async (ctx, next)=>{
  console.log(ctx.session.count)
  console.log(ctx.session.id)
  ctx.body(ctx.session.count)
})

router.get('/get', async (ctx, next) => {
  var response = {
    'timestamp': ctx.session.time,
    'count': ctx.session.count
  }
  ctx.type = 'json';
  ctx.body = JSON.stringify(response)
  console.log(ctx.sessionId)
})


router.get('/token', async (ctx, next) => {
  console.log(ctx.state)
  console.log(ctx.state.user.iat)
  console.log(Date.now())
})

router.get('/string', async (ctx, next) => {
  ctx.body = ctx.session.count
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
