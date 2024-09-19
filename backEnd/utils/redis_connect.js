// 引入 ioredis 包
const redisUtils = require('ioredis')
// 引入配置文件 需要传入给实例对象
const  { redis0Config, redis1Config, redis2Config, redis3Config}  = require('../config/redis_config.js')

// 引入 koa-redis 包
// const Redis = require('koa-redis');
// const koaRedis0 = Redis.createClient(redis0Config);


// 创建实例 连接NoSQL服务器
const redis0 = new redisUtils(redis0Config) // 保存sessionData
const redis1 = new redisUtils(redis1Config) // 保存聊天信息
const redis2 = new redisUtils(redis2Config) // 暂定
const redis3 = new redisUtils(redis3Config) // 暂定

// 导出实例对象
module.exports = {
    redis0,
    redis1,
    redis2,
    redis3,
    // koaRedis0
}