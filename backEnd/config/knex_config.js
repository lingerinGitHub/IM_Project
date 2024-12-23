//测试的数据库连接
const knex_config = require('knex')({
  client: 'mysql2',
  connection: {
    host: '127.0.0.1',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'imchat'
  }
});


// 服务器的数据库连接
// const knex_config = require('knex')({
//   client: 'mysql2',
//   connection: {
//     host: '127.0.0.1',
//     port: 3306,
//     user: 'linger_root',
//     password: '123456',
//     database: 'imchat'
//   }
// });

module.exports = knex_config;
