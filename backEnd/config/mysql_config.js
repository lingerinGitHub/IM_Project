const mysqlConfig = {
    database:'imchat',
    user:'root',
    password:'123456',
    host:'localhost',
    port:'3306'
}

// const mysqlConfig = {
//     database:'imchat',
//     user:'linger_root',
//     password:'123456',
//     host:'localhost',
//     port:'3306'
// }


//commentJs只支持这种暴露方法，不支持直接暴露对象
module.exports = mysqlConfig;
