import socket from 'socket.io-client';
import { defineStore } from 'pinia'
import { useloginUserInfoStore } from '../stores/loginUserInfoStore';
import { usechatInfoStore } from '../stores/chatInfoStore';
import { getTimestamp } from '../utils/time.ts';
import { chatInfo, Role } from '../class/chatInfoClass.ts';
import { logout } from '../api/login_api.ts';
import router from '../router/index.ts';
import { socketiopath } from '../config/serverPath.ts';


export const useSocket_api_store = defineStore('useSocket_api_store', {
    state: () => {
        return {
            socketID: '0' as string,
            status: 'disconnected' as unknown as string,
            reconnect: false,
            io: null as any,  // 保存socketio实例
            offsetNum: 0 as number,
            message: undefined as unknown as string,
            //store
            loginUserInfoStore: useloginUserInfoStore() as any,
            chatInfoStore: usechatInfoStore() as any,
        }
    },
    actions: {

        //连接后开始使用基础的监听路由
        wsConnection(id: Number, token: string) {

            // 已经连接或者为登录，不允许升级请求
            if (this.socketID != '0' || this.loginUserInfoStore.id == undefined) {
                console.log('this.socketID'+this.socketID)
                console.log('this.loginUserInfoStore.id'+this.loginUserInfoStore.id)
                return;

            };


            // socketio连接配置
            this.io = socket(`${socketiopath}`, {
                
                query: {
                    id: id,
                    token: token, //获取loginUserStore中token
                },
                reconnection: true, // 启用断线重连
                reconnectionAttempts: Infinity, // 最多尝试重连的次数，设置为Infinity表示无限次
                reconnectionDelay: 1000, // 重连间隔 1 秒
                reconnectionDelayMax: 50000, // 最大重连间隔时间
            });

            // B2B接收消息
            this.io.on("B2Bmessage:from", (data: any) => {
                // receive(data)
                this.offsetNum++;
                this.message = data.chatInfo.message;//将接收到的信息放进去
                //将接收到的消息放进pinia消息队列
                this.chatInfoStore.chatInfoInsert(Role.opposite, data.id, data.chatInfo)

            });

            this.io.on('tokenExtend', (data: any) => {
                //延长token有效期;
                localStorage.setItem('token', data);
            })

            //链接成功后服务器返回链接信息
            this.io.on("connected", (msg: any) => {

                this.socketID = msg.data.socketid;

                this.status = 'connected';

                this.loginUserInfoStore.wsConnectTimeStamp = msg.data.timeStamp;
            });


            //获取历史消息路由
            this.io.on("historyMessage", (chatInfoList: any) => {
                chatInfoList = JSON.parse(chatInfoList)
                if (chatInfoList.id != this.loginUserInfoStore.id) {
                    // logger.debug(Object.keys(chatInfoList))
                    // logger.debug(this.loginUserInfoStore.id)

                    return
                }
                this.chatInfoStore.HistoryChatInfoInsert(chatInfoList.friendId, chatInfoList.data, chatInfoList.ifMore)
            });

            this.io.on("logout", async () => {
                //断开之前先刷新时间戳
                this.io.disconnect()
                this.socketID = '0';
                this.status = 'disConnected';
                logout()
                router.go(0)
                router.push({ path: '/login' })
            })

            // this.io.on('reConnection', (data: any) => {
            //     console.log(data)
            //     console.log('接收到重新连接指令')
            //     this.socketID = '0';
            //     this.status = 'disConnected';
            //     this.reConnect()
            // })

            // this.io.on('disconnect', (reason: any) => {
            //     console.log('连接已经断开，原因：' + reason);
            //     // 尝试重新连接
            //     this.reConnect()
            // });
        },

        // async reConnect() {
        //     console.log('socket即将重新连接')
        //     this.socketID = '0';
        //     this.status = 'disConnected';
        //     // 重新进行socket连接
        //     this.wsConnection(this.loginUserInfoStore.id, this.loginUserInfoStore.token)
        // },

        async B2Bmessageto(toId: number, message: string) {

            console.log(this.status)

            if (this.socketID == '0' || this.status == 'disConnected') {
                this.wsConnection(this.loginUserInfoStore.id, this.loginUserInfoStore.token)
            }

            // B2B发送消息
            this.io.emit("B2Bmessage:to", {

                from: this.loginUserInfoStore.id,// 登录的账号id
                to: toId,
                message: message,
            });
            // 新的chatInfo
            const newChatInfo = new chatInfo(Role.user, getTimestamp(), message)
            // 保存发送消息在浏览器
            await this.chatInfoStore.chatInfoInsert(Role.user, toId, newChatInfo)
        },

        async B2BGetHistory(friendList: [{}] | any) {
            // 登录的时候获取历史信息
            for (let i = 0; i < friendList.length; i++) {

                await this.io.emit("getHistory", {
                    friendId: friendList[i].id
                })
            }
        },
    },
    // persist: true,

})