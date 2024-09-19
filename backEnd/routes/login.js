const router = require('koa-router')()
const { tokenSecret } = require('../common/password.js')
const { generateToken } = require('../utils/jwt_util.js')
const knex = require('../config/knex_config.js');

const fs = require('fs');
const { redis0 } = require('../utils/redis_connect.js');
const { error } = require('console');
const { B2BchatidGernerator } = require('../utils/chatidGenerator.js');

router.post('/login', async (ctx, next) => {
    //判断请求体是否正确，字段是否存在
    if (ctx.request.body?.data?.account == undefined || ctx.request.body?.data?.password == undefined) {
        ctx.status = 500;
        ctx.body = '非法访问/login！';
        console.log('非法访问/login！')
        return
    }
    const res = await knex.select().from('users').where({
        'account': ctx.request.body.data.account,
        'password': ctx.request.body.data.password,
        'is_delete': 0
    })
        .then(res => {
            if (res == '') {
                console.log('账号密码不匹配')
                ctx.status = 401;
            }
            return res;
        })
        .catch(err => {
            console.log(err)
        })
    if (ctx.status == 401) {
        ctx.body = JSON.stringify({ 'data': '账号密码不正确' });
        return
    }
    ctx.set("Content-Type", "application/json");
    ctx.type = 'json'
    const token = generateToken(res[0].id)
    var response = {
        'id': res[0].id,
        'account': res[0].account,
        'province': res[0].province,
        'city': res[0].city,
        'photo': res[0].photo,
        'created_at': res[0].created_at,
        'updated_at': res[0].updated_at,
        'token': token
    }
    // 使用ctx.session来保存用户id
    ctx.session.id = res[0].id
    ctx.body = JSON.stringify({
        'status': 200,
        'data': response,
    });
})

router.post('/getFriendList', async function (ctx, next) {
    //检查请求体是否合法
    if (ctx.request?.body?.data?.id === undefined || ctx.request?.data?.body?.id === null) {
        ctx.body = '想非法访问？'
        return
    }
    // 第一个查询部分
    const query1 = knex('friendships as f')
        .select('f.friend_id as friend_user_id')
        .where('f.user_id', ctx.request.body.data.id);

    // 第二个查询部分
    const query2 = knex('friendships as f')
        .select('f.user_id')
        .where({
            'f.friend_id': ctx.request.body.data.id,
            'f.status': 'accepted'
        });

    // 使用union将两个查询合并,联合查询
    const friendInfos = await knex.union(knex.raw(query1.toString()), knex.raw(query2.toString()))
        .then(async results => {
            // 处理结果
            const friendInfosPromises = results.map(async results => {
                const friendInfoPromise = await knex.select(
                    'id', 'username', 'province', 'city', 'photo', 'updated_at'
                ).from('users').where({
                    'id': results.friend_user_id
                })
                return friendInfoPromise
            });

            try {
                const friendInfos = await Promise.all(friendInfosPromises);
                return friendInfos.flat(2);
            } catch (err) {
                console.error(err);
            }
        })
        .catch(err => {
            // 处理错误
            console.error(err);
        });
    ctx.body = JSON.stringify({
        'status': 200,
        'data': { 'friendList': friendInfos },
    });
})


router.get('/getHistory', async function (ctx, next) {
    const B2BHistoryLuaOld = fs.readFileSync(__dirname + '\\..\\lua\\B2BHistoryOld.lua', 'utf-8');
    const luaresult = await redis0.eval(B2BHistoryLuaOld, 1, '1_2', 0, 80, 1726217021);
    ctx.body = luaHostoryResultToJSON(luaresult)

})
module.exports = router

function luaHostoryResultToJSON(luaresult) {
    let ifMore = true
    let JSONlua = []

    for (let i = 0; i < luaresult.length; i++) {
        let tempObject = {}
        let JSONluaItem = {
            from: '',
            to: '',
            message: '',
            timeStamp: '',
        }

        if (luaresult[i] == 'nomore') {
            ifMore = false
            break;
        }
        try {
            tempObject = JSON.parse(luaresult[i])
            if (Object.keys(tempObject).length == 3) {
                JSONluaItem.from = tempObject.from;
                JSONluaItem.to = tempObject.to;
                JSONluaItem.message = tempObject.message;
                // timeStamp
                i++;
                JSONluaItem.timeStamp = luaresult[i];
            }
        } catch {
            console.log(`login.js: ${error}`)
        }

        if( JSONluaItem.from == undefined || JSONluaItem.to == undefined || JSONluaItem.message == undefined || JSONluaItem.timeStamp == undefined ){
            continue;
        } else {
            console.log(JSONluaItem)
            JSONlua.push(JSONluaItem);
        }
    }
    JSONlua = JSONlua.reverse()
    return JSON.stringify({ data: JSONlua, ifMore: ifMore })
}
