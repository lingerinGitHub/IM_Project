const time = require('../utils/time.js')//生成时间戳
const { generateToken, verifyToken } = require('../utils/jwt_util.js')//生成token
const fs = require('fs');
const { redis0 } = require('../utils/redis_connect.js');
const { B2BchatidGernerator } = require('../utils/chatidGenerator.js');//生成聊天id
const path = require('path');
const { error } = require('console');


//保存在线用户信息,数组对象，保存用户id-socketid
// var onlineUserList = [];
var onlineUserList = new Map();


const B2BchatInsertLua = fs.readFileSync(path.join(__dirname, '..', 'lua', 'B2BchatInsert.lua'), 'utf-8');

// 将io实例传入进行处理(前端传入token，需要解析token获取用户名，保存用户id-socketid)
module.exports = function (io) {
    // console.log('进入ws升级处理')
    //监听前端请求
    io.on("connection", (socket) => {

        if (socket.recovered) {
            // 恢复成功：socket.id, socket.rooms 和 socket.data 被恢复
            console.log('回复连接：'+socket.recovered)
        } else {
            // 新的或无法恢复的会话
        }

        // 验证连接
        console.log('验证连接')
        verifyConnection(socket, io)

        // 保存socketid
        saveSocketId(socket, io)

        // B2B监听'message:to'事件
        socket.on('B2Bmessage:to', async (msg) => {
            // 验证本次请求的用户是否在服务器中
            if (!verifyAuthority(socket.handshake.query.id, io)) {
                // 登出事件
                io.to((socket.handshake.query.id.toString()).socketid).emit('logout', { status: 500, data: { message: '非法访问', timeStamp: time.getTimestamp() } });
                // 关闭连接
                socket.disconnect(true);
                return
            }

            //本次聊天信息
            const chatInfo = {
                from: msg.from,
                to: msg.to,
                message: msg.message
            }

            // console.log('收到消息：', msg);
            //发送消息202409131200,精确到秒
            dataStamp = time.getTimestamp();

            //保存聊天记录到服务器
            console.log(chatInfo)
            const chatId = B2BchatidGernerator(socket.handshake.query.id, msg.to)
            const luaresult = await redis0.eval(B2BchatInsertLua, 2, chatId, time.getTimestamp(), Date.now(), JSON.stringify(chatInfo));
            // console.log(`redis保存结果：${luaresult}`)

            //检测用户是否在线
            if (onlineUserList.get(msg.to.toString()) === undefined) {
                io.to(socket.id).emit('message:from', { status: 403, data: '对方不在线' });
                console.log('目标用户不在线')
                return
            }
            //发送聊天记录到目标服务器
            io.to(onlineUserList.get(msg.to.toString()).socketid).emit('B2Bmessage:from', { id: msg.from, chatInfo: { message: msg.message, dataStamp: dataStamp } });
            // console.log('发送消息：', msg.message)
            // console.log(B2BchatidGernerator(msg.from, msg.to))

        });


        // 监听用户断开连接事件
        socket.on('disconnect', (reason) => {
            console.log('socket断开原因：' + reason)


            //'client namespace disconnect'表示是服务器登出，浏览器被动登出
            //'transport close'表示浏览器主动登出

            //每个disconnect请求都先将socket关闭,节约资源
            socket.disconnect(true);

            console.log(`用户客户端${socket.handshake.query.id}已断开连接，socket进入销毁倒计时，服务器即将释放资源`);
            let tempOnlineUser = {};
            tempOnlineUser = onlineUserList.get(socket.handshake.query.id)

            if(tempOnlineUser == undefined) {
                return
            }

            tempOnlineUser.disconnect = true
            tempOnlineUser.timeStamp = Date.now()
            onlineUserList.set(socket.handshake.query.id.toString(), tempOnlineUser)
            setTimeout(() => {
                tempOnlineUser = onlineUserList.get(socket.handshake.query.id.toString())

                try {
                    // 断开后再次连接时间间隔超过10秒则销毁本次连接资源
                    if (tempOnlineUser?.disconnect == true || ((Date.now() - tempOnlineUser.timeStamp) >= 60000)) {
                        console.log(`用户:"${socket.handshake.query.id}"的会话已销毁`);
                        onlineUserList.delete(socket.handshake.query.id.toString());
                        console.log(onlineUserList)
                    } else {
                        tempOnlineUser = onlineUserList.get(socket.handshake.query.id)
                        tempOnlineUser.disconnect = false
                        onlineUserList.set(socket.handshake.query.id.toString(), tempOnlineUser)
                        console.log(`用户:"${socket.handshake.query.id}"的会话已重新连接`);
                        console.log(onlineUserList)
                    }

                } catch {
                    console.error('出现连接错误')
                }

                tempOnlineUser = null;

            }, 60000);//断开连接10秒后销毁


        });

        // 获取聊天记录
        socket.on('getHistory', async (data) => {
            // 验证本次请求的用户是否在服务器中
            if (!verifyAuthority(socket.handshake.query.id, io)) {
                // 登出事件
                io.to(onlineUserList.get(socket.handshake.query.id.toString()).socketid).emit('logout', { status: 500, data: { message: '非法访问', timeStamp: time.getTimestamp() } });
                // 关闭连接
                socket.disconnect(true);
                return
            }

            const B2BHistoryLuaOld = fs.readFileSync(path.join(__dirname, '..', 'lua', 'B2BHistoryOld.lua'), 'utf-8');
            const chatId = B2BchatidGernerator(socket.handshake.query.id, data.friendId)
            const luaresult = await redis0.eval(B2BHistoryLuaOld, 1, chatId, 0, 80, 0);
            // console.log(chatId)
            // console.log(luaresult)
            JSONlua = luaHostoryResultToJSON(data.friendId, socket.handshake.query.id, luaresult)
            // console.log(JSONlua)
            io.to(socket.id).emit('historyMessage', JSONlua)
        })


    });
}
//604800000

function verifyConnection(socket, io) {
    // 防止参数不完整的非法访问
    if (!verifyToken(socket?.handshake?.query?.token) || socket?.handshake?.query?.id == undefined || socket?.handshake?.query?.id == null || socket?.handshake?.query?.id == '' || socket?.handshake?.query?.token == undefined || socket?.handshake?.query?.token == null || socket?.handshake?.query?.token == '') {
        console.log('非法访问！')
        io.to(socket.id).emit('message:from', { status: 403, data: '非法访问！' });
        socket.disconnect()//关闭链接
        return
    }
    return
}

function saveSocketId(socket, io) {
    //保存用户id-socketid至onlineUserList

    // 如果id已经存在，则停止这一次连接[socket.handshake.query.id]
    if (onlineUserList.get(socket.handshake.query.id.toString()) != undefined) {
        console.log(`"${socket.handshake.query.id}"用户已连接ws服务器，重置上一次socket连接`)

        // 将已登录客户端登出
        io.to(onlineUserList.get(socket.handshake.query.id.toString()).socketid).emit('logout', { status: 200, data: { message: '账号已在异地登录', timeStamp: time.getTimestamp() } });

    }
    // 保存本次新的连接至服务器
    onlineUserList.set(socket.handshake.query.id.toString(), {
        socketid: socket.id,
        timeStamp: Date.now(),
        disconnect: false
    })

    //当前在线人数
    console.log(onlineUserList)

    //连接成功路由返回连接信息
    io.to(socket.id).emit('connected', { status: 200, data: { message: '登陆成功', timeStamp: time.getTimestamp(), socketid: onlineUserList.get(socket.handshake.query.id.toString()).socketid } });//首次链接返回时间戳
    console.log(`用户id:"${socket.handshake.query.id}"连接成功`)
}


// 每次转发消息前需要验证用户是否已经存在于服务器,如果不存在则下线处理
function verifyAuthority(id) {
    if (onlineUserList.get(id.toString()) == undefined) {
        return false
    } else {
        return true
    }
}

// 对redis中返回的聊天记录进行处理
function luaHostoryResultToJSON(friendId, id, luaresult) {
    let ifMore = true
    let JSONlua = []

    for (let i = 0; i < luaresult.length; i++) {
        let tempObject = {}
        let JSONluaItem = {
            from: '',
            to: '',
            message: '',
            timeStamp: '',
        }

        if (luaresult[i] == 'nomore') {
            ifMore = false
            break;
        }
        try {
            tempObject = JSON.parse(luaresult[i])
            if (Object.keys(tempObject).length == 3) {
                JSONluaItem.from = tempObject.from;
                JSONluaItem.to = tempObject.to;
                JSONluaItem.message = tempObject.message;
                // timeStamp
                i++;
                JSONluaItem.timeStamp = luaresult[i];
            }
        } catch {
            console.log(`login.js: ${error}`)
        }

        if (JSONluaItem.from == undefined || JSONluaItem.to == undefined || JSONluaItem.message == undefined || JSONluaItem.timeStamp == undefined) {
            continue;
        } else {
            // console.log(JSONluaItem)
            JSONlua.push(JSONluaItem);
        }
    }
    JSONlua = JSONlua.reverse()
    return JSON.stringify({ friendId: friendId, id: Number(id), data: JSONlua, ifMore: ifMore })
}