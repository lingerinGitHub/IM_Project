<template>
    <div>from-user-{{ loginUserInfoStore.account }}</div>
    <div><el-input v-model="toId" style="width: 240px" placeholder="to-user" /></div>
    <div><el-input v-model="message" style="width: 240px" placeholder="chat-massage" /></div>
    <div><el-button plain @click="emit()"> emit </el-button></div>
    <div><el-button plain @click="historyChatInfo()"> history </el-button></div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";
import { ElNotification, ElLoading } from 'element-plus'
import { useSocket_api_store } from "../stores/socket.ts";
import { useloginUserInfoStore } from "../stores/loginUserInfoStore";
import { Logger } from "tslog";
import { storeToRefs } from "pinia";

const loginUserInfoStore = useloginUserInfoStore()
const socket_api_store = useSocket_api_store();
const { offsetNum } = storeToRefs(socket_api_store);
const logger = new Logger({ name: "chat1Test" });
const message = ref("");
const toId = ref<number>(0);
var io: any = null;

function receive(message:string) {
    ElNotification({
        title: 'Success',
        message: `接收到消息${message}`,
        type: 'success',
        duration: 2500,
        offset: 50,
    });
}
function emit() {
    console.log(`emit`)
    socket_api_store.B2Bmessageto(toId.value, message.value)
}

//更新用户聊天信息
function historyChatInfo(chatList?: any, timeStamp?: number) {
    console.log('historyChatInfo()')
    io.emit('history:chatInfo', {
        id: '114514',
        chatList: [456],
        pageNum: 0,
        offsetNum: 0
    });
}

watch(offsetNum, (New, Old)=>{
    logger.info('接收到一条消息')
    receive(socket_api_store.message)
})
</script>

<style lang="scss" scoped></style>