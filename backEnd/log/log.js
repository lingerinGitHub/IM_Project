const log4js = require('log4js')

log4js.configure({

    pm2: true,

    appenders: {

        everything: {

            type: 'dateFile',

            filename: __dirname + '/logFile/all-the-logs.log',

            maxLogSize: '10M',

            backups: 20

        }

    },

    categories: {

        default: { appenders: ['everything'], level: 'debug' }

    }

})

const logger = log4js.getLogger()

const loggerMiddleware = async (ctx, next) => {

    // 请求开始时间

    const start = new Date()

    await next()

    // 结束时间

    const ms = Number(new Date()) - Number(start)

    // 打印出请求相关参数

    const remoteAddress = getClientIpAddress(ctx)

    let logText = `${ctx.method} ${ctx.status} ${ctx.url} 请求参数： ${JSON.stringify(

        ctx.request.body

    )} 响应参数： ${expceptStaticResource(ctx)} - ${remoteAddress} - ${ms}ms`

    logger.info(logText)

}

function expceptStaticResource(ctx) {
    if(JSON.stringify(ctx.body.type === "Buffer")){
        return 'staticResource'
    } else if(JSON.stringify(ctx.body) === undefined) {
        return null
    } else {
        return JSON.stringify(ctx.body)
    }
}


/*获取当前ip地址*/
// 获取客户端ip地址
const getClientIpAddress = (ctx) => {

    const headers = ctx.headers

    if (headers['x-forwarded-for']) {

        const ipList = headers['x-forwarded-for'].split(',')

        return ipList[0]

    }

    return '0.0.0.0'

}

module.exports = {
    logger,
    loggerMiddleware
}