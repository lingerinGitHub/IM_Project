// import mysql from 'mysql2/promise';
// import mysql from 'mysql';
const mysql = require('mysql');
// import { mysqlConfig } from '@/config/config.js'
const mysqlConfig = require('../config/mysql_config.js');

//创建连接池
var pool = mysql.createPool({
    host: mysqlConfig.host,
    user: mysqlConfig.user,
    password: mysqlConfig.password,
    database: mysqlConfig.database,
    port: mysqlConfig.port
});

//传入查询语句和值进行查询
function query(sql,value){
    return new Promise((resolve,reject)=>{
        pool.getConnection(function(err,connection){
            if(err){
                console.log("本次查询数据库连接失败")
                console.log(err)
                reject(err)
            }else{
                console.log("本次查询数据库连接成功")
                connection.query(sql,value,(err,row)=>{
                    if(err){
                        reject(err)
                    }else{
                        resolve(row)//返回查询结果
                    }
                    connection.release()//释放数据库链接
                })
            }
        })
    })
}

module.exports = {
    query
}
