// sessionHandler.js  
const session = require('koa-generic-session');
const clients = require('../utils/redis_connect.js');
// const { name } = require('ejs');
const redisStore = require('koa-redis');
const time = require('../utils/time.js');


module.exports = function sessionHandler(app, keys) {
    app.keys = keys;

    // 配置 session 中间件,测试redis是否成功链接
    // clients.redis0.ping().then(() => {
    //     console.log(`test: Redis client connected successfully.`);
    // }).catch((err) => {
    //     console.error(`test: Redis client connection failed:`, err);
    // });

    app.use(session({
        store: new redisStore({ db: 1, }), // 将sessionData保存在redis0号库
        name: 'connect.sid',//用于存储会话ID的cookie的名称。默认为connect.sid。
        resave: false,//如果为true，则如果会话未修改，则不会发送cookie。默认为false。
        secret: 'secret', //用于对会话ID进行签名的密码。默认为nul
        saveUninitialized: false,//如果为true，则无论会话是否修改，都会发送cookie。默认为true。
        genid: function (req) { //用于生成新的会话ID的函数。默认为null。
            return (Math.random() * 10000000).toString(36).substr(0, 7);
        },
        cookie: {
            key: 'koa:sess', // cookie 的键名（name），默认为 koa:sess
            httpOnly: true,   // cookie 仅由服务器访问，默认为 true
            maxAge: 86400000 * 7, // 设置 cookie 的 'max-age' (1*7天), 默认为 null;
            rolling: true, // 强制在每次请求时设置 cookie，这重置 cookie 过期时间，默认为 false
            renew: true,     // 续签 session，重置 cookie 的过期时间（配合 rolling 使用）
            autoCommit: true, // 自动提交到响应头，默认为 true  
            overwrite: true,  // 可以重写 cookie, 默认为 true
            signed: true,     // 签名 cookie，默认为 true
            secure: false,    // cookie 只能通过 HTTPS 发送，默认为 false
            sameSite: null,   // 设置 cookie 的 SameSite 选项
        },
    }, app));

    // 中间件，限制访问次数，超过100次，1分钟内禁止访问
    app.use(async (ctx, next) => {
        try {
            //每次访问，count++
            await get(ctx);
            //获取访问的时间戳，对比如超过一分钟则重置时间戳，重置累加次数
            await compareTime(ctx)
            await next();
        } catch (error) {

            switch (ctx.status) {
                case 429: 
                    ctx.body = {'data':'访问次数过多，请稍后再试'};
                    break;
                default:
                    ctx.status = 500;
                    ctx.body = 'Internal Server Error';
                    console.error(error);
                    break;
            }
        }
    });

    // 记录访问次数
    async function get(ctx) {
        let count = ctx.session.count || 0;
        count++;
        ctx.session.count = count;
        // ctx.body = count;
    }

    // 退出登录，清除session
    async function remove(ctx) {
        ctx.session = null;
        ctx.body = 0;
    }

    // 生成新的session
    async function regenerate(ctx) {
        await get(ctx); // 先调用 get
        await ctx.regenerateSession(); // 再生成会话
        await get(ctx); // 再次调用 get 来显示新的会话计数
    }

    // 获取session时间比较看是否需要重置次数
    async function compareTime(ctx) {
        const now = time.getTimestamp();
        // 如session.time不存在则返回0
        console.log(`用户:"${ctx.session.id}" ip: ${getClientIpAddress(ctx)} 访问次数： ${ctx.session.count} + ${ctx.sessionId}`)
        if (!ctx.session.time) {
            ctx.session.time = time.getTimestamp();
            // 访问次数
        } else if ((ctx.session.count > 100) && now - ctx.session.time < 60) {
            ctx.status = 429;
            throw new Error("访问次数过多，请稍后再试");
        } else if (now - 60 > ctx.session.time) {
            //  过了一分钟，重置time和count
            ctx.session.time = now;
            ctx.session.count = 1;
        }
    }
};

// 获取客户端ip地址
const getClientIpAddress = (ctx) => {

    const headers = ctx.headers

    if (headers['x-forwarded-for']) {

        const ipList = headers['x-forwarded-for'].split(',')

        return ipList[0]

    }

    return '0.0.0.0'

}