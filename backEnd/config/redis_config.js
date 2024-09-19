
let redisConfig = {}


//保存sessionData
const redis0Config = {
    port: 6379, // 端口号
    host: 'localhost', // ip
    // password: '123456', // 密码 同上文
    db: 0,
}

//保存聊天信息
const redis1Config = {
    port: 6379, // 端口号
    host: 'localhost', // ip
    // password: '123456', // 密码 同上文
    db: 1,
}


//暂定
const redis2Config = {
    port: 6379, // 端口号
    host: 'localhost', // ip
    // password: '123456', // 密码 同上文
    db: 2,
}


//暂定
const redis3Config = {
    port: 6379, // 端口号
    host: 'localhost', // ip
    // password: '123456', // 密码 同上文
    db: 3,
}


module.exports = {
    redis0Config,
    redis1Config,
    redis2Config,
    redis3Config
}

