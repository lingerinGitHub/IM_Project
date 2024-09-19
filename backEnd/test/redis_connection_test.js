// 后端项目启动前，先测试redis服务是否能链接成功

const redisUtils = require('ioredis');  
const { redis0Config, redis1Config, redis2Config, redis3Config } = require('../config/redis_config.js');  
  
const Redisclients = [  
    new redisUtils(redis0Config),  
    new redisUtils(redis1Config),  
    new redisUtils(redis2Config),  
    new redisUtils(redis3Config)  
];  
  
Redisclients.forEach((client, index) => {  
    client.on('error', (err) => {  
        console.error(`test: Redis client ${index} error:`, err);  
    });  
  
    client.ping().then(() => {  
        console.log(`test: Redis client ${index} connected successfully.`);  
    }).catch((err) => {  
        console.error(`test: Redis client ${index} connection failed:`, err);  
    });  
});  
  
module.exports = Redisclients;