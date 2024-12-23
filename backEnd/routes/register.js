const { isValidUsername, isValidEmail, isValidPassword } = require('../utils/stringVerify.js')
const knex = require('../config/knex_config.js');

const router = require('koa-router')()

// router.prefix('/')

//使用组件knex链式调用使用mysql

router.post('/users/register', async (ctx, next) => {

    const regUsername = ctx.request.body?.data?.username;
    const regEmail = ctx.request.body?.data?.email;
    const regPassword = ctx.request.body?.data?.password;

    console.log(regUsername)
    console.log(regEmail)
    console.log(regPassword)
    //判断请求体是否合法
    if (regUsername === undefined || regEmail === undefined || regPassword === undefined) {
        console.log('为空')
        ctx.status = 502
        return
    } else if (isValidUsername(regUsername) && isValidEmail(regEmail) && isValidPassword(regPassword)) {
        ctx.status = 502
        return
    } else {
        // 检查数据库中邮箱是否重复
        let result = await knex.table('users')
            .where('email', regEmail)
            .first()
            .then(function (row) { return row != undefined })    
        if(result){
            ctx.status = 502
            ctx.body = {data:'该邮箱已被注册',status:502}
            return
        }
    }

    //插入数据库
    let insertResult = await knex('users')
    .insert({username:regUsername, email:regEmail, password:regPassword})

    
    ctx.status = 200
    ctx.body= {data:'注册成功',status:200}
    return
})

module.exports = router
