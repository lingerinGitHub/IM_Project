const time = require('../utils/time.js')//生成时间戳
const { generateToken, verifyToken } = require('../utils/jwt_util.js')//生成token
const fs = require('fs');
const { redis0 } = require('../utils/redis_connect.js');
const { B2BchatidGernerator } = require('../utils/chatidGenerator.js')//生成聊天id


//保存在线用户信息,数组对象，保存用户id-socketid
// var onlineUserList = [];
const onlineUserList = new Map();

const B2BchatInsertLua = fs.readFileSync(__dirname + '\\..\\lua\\B2BchatInsert.lua', 'utf-8');

// 将io实例传入进行处理(前端传入token，需要解析token获取用户名，保存用户id-socketid)
module.exports = function (io) {
    // console.log('进入ws升级处理')
    //监听前端请求
    io.on("connection", (socket) => {
        // 防止参数不完整的非法访问
        if (socket?.handshake?.query?.id == undefined || socket?.handshake?.query?.id == null || socket?.handshake?.query?.id == '' || socket?.handshake?.query?.token == undefined || socket?.handshake?.query?.token == null || socket?.handshake?.query?.token == '') {
            console.log('非法访问！')
            io.to(socket.id).emit('message:from', { status: 403, data: '非法访问！' });
            socket.disconnect()//关闭链接
            return
        }
        //保存用户id-socketid至onlineUserList
        if (verifyToken(socket.handshake.query.token)) {
            // 如果id已经存在，则停止这一次连接[socket.handshake.query.id]
            if (onlineUserList.get(socket.handshake.query.id.toString()) != undefined) {
                console.log(`"${socket.handshake.query.id}"用户已连接ws服务器，重置上一次socket连接`)
                io.to(onlineUserList.get(socket.handshake.query.id.toString()).socketid).emit('logout', { status: 200, data: { message: '账号已在异地登录', timeStamp: time.getTimestamp() } });
            }
            // 保存本次新的连接至服务器
            onlineUserList.set(socket.handshake.query.id.toString(), {
                socketid: socket.id,
                timeStamp: Date.now()
            })
            //连接成功路由返回连接信息
            io.to(socket.id).emit('connected', { status: 200, data: { message: '登陆成功', timeStamp: time.getTimestamp(), socketid: onlineUserList.get(socket.handshake.query.id.toString()).socketid } });//首次链接返回时间戳
            console.log(`用户:"${socket.handshake.query.id}"连接成功`)
        } else {
            console.log('error')
            io.to(socket.id).emit('message:from', { status: 403, data: '登陆过期，请重新登录' });
            socket.disconnect()//关闭链接
            return
        }

        // B2B监听'message:to'事件
        socket.on('B2Bmessage:to', async (msg) => {

            //本次聊天信息
            const chatInfo = {
                from: msg.from,
                to: msg.to,
                message: msg.message
            }

            console.log('收到消息：', msg);
            //发送消息202409131200,精确到秒
            dataStamp = time.getTimestamp();

            //保存聊天记录到服务器
            console.log(chatInfo)
            const chatId = B2BchatidGernerator(socket.handshake.query.id, msg.to)
            const luaresult = await redis0.eval(B2BchatInsertLua, 2, chatId, time.getTimestamp(), Date.now(), JSON.stringify(chatInfo));
            console.log(`redis保存结果：${luaresult}`)

            //检测用户是否在线
            if (onlineUserList.get(msg.to.toString()) === undefined) {
                io.to(socket.id).emit('message:from', { status: 403, data: '对方不在线' });
                console.log('目标用户不在线')
                return
            }
            //发送聊天记录到目标服务器
            io.to(onlineUserList.get(msg.to.toString()).socketid).emit('B2Bmessage:from', { id: msg.from, chatInfo: { message: msg.message, dataStamp: dataStamp } });
            console.log('发送消息：', msg.message)
            console.log(B2BchatidGernerator(msg.from, msg.to))
        });

        // B2B保存聊天记录，并转发
        socket.on('B2Bmessage:to11111', async function (msg) {
            const luascript = fs.readFileSync(__dirname + '\\..\\lua\\B2BchatInsert.lua', 'utf-8');
            const luaresult = await redis0.eval(luascript, 2, '123456', time.getTimestamp(), Date.now(), msg.message);
            console.log(luaresult)
            // return luaresult
        })

        // test 用户id，好友聊天id数组,pageNum,pageSize,浏览器最新时间戳，没有则默认服务器前7天
        socket.on('history:chatInfo', async (data) => {
            console.log(data)

            const update = await fs.readFileSync(__dirname + '\\..\\lua\\B2BchatGetByPage.lua', 'utf-8');
            const pageSize = 20;//每页20条
            var B2BchatId = null;
            //检测参数是否合法
            if (data?.chatList == null || data?.chatList == undefined) {
                io.to(socket.id).emit('server', { status: 403, data: '参数不完整' });
                socket.disconnect()
                return
            }

            data.timeStamp = data.timeStamp != undefined ? data.timeStamp : 0; //如果不存在则默认0
            var pageNum = data?.pageNum != undefined ? data.pageNum : 1;//如无页码则从1开始

            for (let i = 0; i < data.chatList.length; i++) {
                B2BchatId = B2BchatidGernerator(data.chatList[i], 123);
                console.log(B2BchatId)
                const res = await redis0.eval(update, 1, B2BchatId, pageNum, pageSize, data.offsetNum);
                console.log(res)
                io.to(socket.id).emit('server', { status: 200, data: res });
            }

        })



        // 监听用户断开连接事件
        socket.on('disconnect', (reason) => {
            setTimeout(() => {
                socket.disconnect(true);
                // 查找并删除  
                for (let [userId, item] of onlineUserList.entries()) {
                    console.log(userId)
                    console.log(item)
                    if (item.socketid === socket.id) {
                        // 找到匹配项，删除
                        onlineUserList.delete(userId);
                        break; // 匹配项已找到并删除，跳出循环
                    }
                }
                console.log(`socket.id=${socket.id}会话已销毁`);
            }, 180000);//断开连接3分钟后销毁
            console.log(`用户已断开连接，socket.id=${socket.id}`);
        });

        // 获取聊天记录
        socket.on('getHistory', async (data) => {
            // console.log(socket.handshake.query.id)
            // console.log(data)

            const B2BHistoryLuaOld = fs.readFileSync(__dirname + '\\..\\lua\\B2BHistoryOld.lua', 'utf-8');
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
            console.log(JSONluaItem)
            JSONlua.push(JSONluaItem);
        }
    }
    JSONlua = JSONlua.reverse()
    return JSON.stringify({ friendId: friendId, id: Number(id), data: JSONlua, ifMore: ifMore })
}