import socket from 'socket.io-client';
import { defineStore } from 'pinia';
import { Logger } from 'tslog';
import { useloginUserInfoStore } from '../stores/loginUserInfoStore';
import { usechatInfoStore } from '../stores/chatInfoStore';
import { getTimestamp } from '../utils/time.ts';
import { chatInfo, Role } from '../class/chatInfoClass.ts';
import { logout } from '../api/login_api.ts';
import router from '../router/index.ts';
import { serverpath } from '../config/serverPath.ts'

const logger = new Logger({ name: 'wsServer' })


export const useSocket_api_store = defineStore('useSocket_api_store', {
    state: () => {
        return {
            socketID: undefined as unknown as string,
            status: 'disconnected' as unknown as string,
            reconnect: false,
            io: null as any,  // 使用正确的类型
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

            // 已经连接，无需升级请求
            if (this.socketID != undefined) {
                logger.info('ws已连接，无需升级请求')
                return
            }

            console.log('wxConnection')

            this.io = socket(`ws://${serverpath}`, {
                reconnectionDelay: 10000,
                query: {
                    id: id,
                    token: token, //获取loginUserStore中token
                },
            });
            // B2B接收消息
            this.io.on("B2Bmessage:from", (data: any) => {
                // receive(data)
                this.offsetNum++;
                this.message = data.chatInfo.message;//将接收到的信息放进去
                //将接收到的消息放进pinia消息队列
                this.chatInfoStore.chatInfoInsert(Role.opposite, data.id, data.chatInfo)
                console.log(data);
            });
            this.io.on('server', (msg: JSON) => {
                console.log('server服务器传来消息')
                // console.log(msg)
            })
            this.io.on('tokenExtend', (data: any) => {
                //延长token有效期
                console.log(data)
                localStorage.setItem('token', data);
            })
            //链接成功后服务器返回链接信息
            this.io.on("connected", (msg: any) => {
                logger.info(`连接信息：${msg}`)
                this.socketID = msg.data.socketid;
                logger.info(this.socketID)
                this.status = 'connected';
                this.loginUserInfoStore.wsConnectTimeStamp = msg.data.timeStamp;
                logger.debug(this.loginUserInfoStore.wsConnectTimeStamp)
            });


            //获取历史消息路由
            this.io.on("historyMessage", (chatInfoList: any) => {
                chatInfoList = JSON.parse(chatInfoList)
                if (chatInfoList.id != this.loginUserInfoStore.id) {
                    // logger.debug(Object.keys(chatInfoList))
                    // logger.debug(this.loginUserInfoStore.id)
                    logger.error('bug问题！请联系管理员')
                    return
                }
                this.chatInfoStore.HistoryChatInfoInsert(chatInfoList.friendId, chatInfoList.data, chatInfoList.ifMore)
            });

            this.io.on("logout", async () => {
                //断开之前先刷新时间戳
                this.io.disconnect()
                logout()
                router.push({ path: '/login' })
            })
        },

        async B2Bmessageto(toId: number, message: string) {
            console.log('发送消息')
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
                logger.info(`正在获取${friendList[i].id}的聊天历史信息`)
                await this.io.emit("getHistory", {
                    friendId: friendList[i].id
                })
            }
        },
    },
    // persist: true,

})