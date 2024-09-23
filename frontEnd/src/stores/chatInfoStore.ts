import { defineStore } from "pinia";
import { Logger } from "tslog";
import { chatInfo } from '../class/chatInfoClass.ts';
import { useloginUserInfoStore } from "./loginUserInfoStore.ts";

const logger = new Logger({ name: 'chatInfoRecored' })

enum Role {
    user = 'user',
    opposite = 'opposite'
}

interface resChatList {
    from: number;
    to: number;
    timeStamp: string; // 日期
    message: string;
}

export const usechatInfoStore = defineStore('chatInfoStore', {
    state: () => {
        return {
            // chatInfoList初始化为空数组，用于存储子数组  
            chatInfoList: [] as Array<Array<chatInfo>>,
            loginUserInfoStore: useloginUserInfoStore() as any,
            // chatingFriendId: undefined as unknown as number,
        }
    },

    actions: {
        // 插入最新的聊天
        async chatInfoInsert(role: Role, frientId: number, data: chatInfo) {
            logger.info(chatInfo)
            const newChatInfo = new chatInfo(role, data.timeStamp, data.message)
            if (this.chatInfoList[Number(frientId)] == undefined) {
                this.chatInfoList[Number(frientId)] = new Array<chatInfo>
                console.log(`创建于用户:"${frientId}" 消息列表成功`)
            }
            this.chatInfoList[Number(frientId)].push(newChatInfo)
            logger.debug(this.chatInfoList[Number(frientId)].length)
        },

        //保存服务器返回历史记录id:登录用户id，historyData
        async HistoryChatInfoInsert(friendId:number,historyDataList:resChatList[], _ifMore: boolean) {
            let role:Role; //对于该用户来说的角色
            for (let i = 0; i < historyDataList.length; i++) {
                role = historyDataList[i].from == friendId ? Role.opposite : Role.user;
                const newChatInfo = new chatInfo((role), historyDataList[i].timeStamp, historyDataList[i].message)
                if (this.chatInfoList[friendId] == undefined) {
                    this.chatInfoList[friendId] = new Array<chatInfo>
                    console.log(`创建用户:"${friendId}" 消息列表成功`)
                }
                // logger.debug(chatInfo)
                this.chatInfoList[friendId].push(newChatInfo)
                logger.debug(this.chatInfoList[friendId].length)
            }
        },

    },
})
