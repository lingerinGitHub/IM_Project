const knex_config = require('knex')({
    client:'mysql',
    connection: {
      host:'127.0.0.1',
      port:3306,
      user:'root',
      password:'123456',
      database:'imchat'
    }
  });

module.exports = knex_config;
