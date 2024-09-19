// const crosConfig = require('koa2-cors'); //跨域处理



const crosConfig = {
    origin: function(ctx) { //设置允许来自指定域名请求
        if (ctx.url === '/test') {
            return '*'; // 允许来自所有域名请求
        }
        // return 'http://localhost:5173'; //只允许http://localhost:8080这个域名的请求
        const origin = ctx.header.origin;
        let matchResult = null==origin ? null:origin.match(/localhost/i); // 注意 i 修饰符,允许localhost和无源请求访问系统
        if (matchResult == null) {
            return '*';
        }
        return `${origin}`;
    },
    maxAge: 5, //指定本次预检请求的有效期，单位为秒。
    credentials: true, //是否允许发送Cookie
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
}

// function cros(ctx){
//     cors({
//         origin: function(ctx) { //设置允许来自指定域名请求
//             if (ctx.url === '/test') {
//                 return '*'; // 允许来自所有域名请求
//             }
//             return 'http://localhost:5173'; //只允许http://localhost:8080这个域名的请求
//         },
//         maxAge: 5, //指定本次预检请求的有效期，单位为秒。
//         credentials: true, //是否允许发送Cookie
//         allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
//         allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
//         exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
//     })
// }

module.exports = crosConfig;