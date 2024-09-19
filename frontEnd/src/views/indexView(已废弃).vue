<template>
    <!-- <div class="float"></div> -->
    <div class="grid-container">
        <!-- <GridComponen></GridComponen> -->
        <div class="topleft item01 h-full w-full">
            <userinfo></userinfo>
        </div>
        <div class="topright item02 h-full w-full">
            <chatList :friendList="loginUserInfoStore.friendList"></chatList>
        </div>
        <div class="left item03 h-full w-full">
            <chatEcharts id="chatEcharts" class=" w-full"></chatEcharts>
            <onlineAndNumber id="onlineAndNumber" class=" w-full"></onlineAndNumber>
        </div>
        <div class="right item04 h-full w-full">
            <!-- <chatFrame index="1" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame role="opposite"
                message="hellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohellohello">
            </chatFrame>
            <chatFrame index="2" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame index="3" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame index="4" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame index="5" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame index="6" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame index="7" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame index="8" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame index="9" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame index="10" role="user" message="hellohellohellohellohello"></chatFrame>
            <chatFrame index="11" role="user" message="hellohellohellohellohello"></chatFrame> -->
            <!-- <div v-for="item"></div> -->
            <div v-for="(item, index) in chatInfoList[0]" :key="index">
                <chatFrame :index="index" :role="item.role" :message="item.message"></chatFrame>
            </div>

        </div>
        <div class="bottomRight item05 h-full w-full">
            <!-- <sendChatArea class=" h-full w-full"></sendChatArea> -->
            <div><el-input v-model="toId" style="width: 240px" placeholder="to-user" /></div>
            <div><el-input v-model="message" style="width: 240px" placeholder="chat-massage" /></div>
            <div><el-button plain @click="emit(toId, message)"> emit </el-button></div>
        </div>
    </div>


</template>

<script setup lang="ts">
import userinfo from '../components/userinfo.vue';
import chatList from '../components/chatList.vue';
import chatEcharts from '../components/chatEcharts.vue';
import onlineAndNumber from '../components/onlineAndNumber.vue';
import sendChatArea from '../components/sendChatArea.vue';
import chatFrame from '../components/chatFrame.vue';
import { useloginUserInfoStore } from '../stores/loginUserInfoStore';
import { Logger } from 'tslog'
import { useSocket_api_store } from '../stores/socket.ts';
import { storeToRefs } from 'pinia';
import { usechatInfoStore } from '../stores/chatInfoStore.ts'
import { ElNotification, ElLoading } from 'element-plus'
import { ref, watch } from 'vue';
import { getTimestamp } from '../utils/time.ts'


const chatInfoStore = usechatInfoStore()
const socket_api_store = useSocket_api_store()
const logger = new Logger({name:'indexView'})
const loginUserInfoStore = useloginUserInfoStore()
const { offsetNum } = storeToRefs(socket_api_store)
const { chatInfoList } = storeToRefs(chatInfoStore)

logger.debug(getTimestamp())

const toId = ref<number>(0)
const message = ref<string>('')

function receive(message:string) {
    ElNotification({
        title: 'Success',
        message: `接收到消息${message}`,
        type: 'success',
        duration: 2500,
        offset: 50,
    });
}

function emit(id:number, message:string) {
    console.log('emit')
    socket_api_store.B2Bmessageto(id, message)
}

watch(offsetNum, (New, Old)=>{
    logger.info('接收到一条消息')
    receive(socket_api_store.message)
})

</script>

<style lang="scss" scoped>
#chatEcharts {
    height: 76%;
}

#onlineAndNumber {
    height: 25%;
}

.grid-container {
    display: grid;
    overflow: hidden;
    grid-template-columns: repeat(5, minmax(290px, 1fr));
    /* grid-template-rows: repeat(6, 1fr, minmax(200px, 1fr)); */
    grid-template-rows: repeat(6, minmax(120px, 1fr));
    /* grid-template-areas: repeat(5, 'area01 area02 area03 area04 area05'); */
    row-gap: 0px;
    column-gap: 0px;
    width: 100%;
    height: 100vh;
    place-items: center;
    z-index: -2;
    box-sizing: border-box;
    /* 确保padding不会影响容器的总宽度 */
}

.item {
    // background-color: pink;
}

.topright {
    padding-bottom: -40px;
    grid-column-start: 2;
    grid-column-end: 7;
    grid-row-start: 1;
    grid-row-end: 3;
    // background-color: lightblue;

}

.topleft {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 2;
    // background-color: lightblue;
}

.left {
    grid-column-start: 1;
    grid-column-end: 2;
    grid-row-start: 2;
    grid-row-end: 7;
    // background-color: lightblue;
}

.right {
    overflow: auto;
    padding-left: 20px;
    padding-right: 20px;
    grid-column-start: 2;
    grid-column-end: 5;
    grid-row-start: 3;
    grid-row-end: 7;
    // background-color: lightblue;

    /*滚动条高宽度*/
    &::-webkit-scrollbar {
        width: 8px;
        height: 4px;
    }

    /*滚动条滑块*/
    &::-webkit-scrollbar-thumb {
        border-radius: 6px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #cccccc;
    }

    /*滚动条里面轨道*/
    &::-webkit-scrollbar-track {
        // box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
        background: transparent;
    }

    /*滚动条的小边角*/
    &::-webkit-scrollbar-corner {
        background: transparent;
    }

}

.bottomRight {
    grid-column-start: 5;
    grid-column-end: 7;
    grid-row-start: 3;
    grid-row-end: 7;
    // background-color: lightblue;
}
</style>
