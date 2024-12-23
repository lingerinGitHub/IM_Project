<template>
    <div ref="chatContainerRef" class="chat-interface-container">
        <div class="info-function">
            <div class="userInfo">
                <div class="userImg-dot">
                    <div class="dot"></div>
                    <div class="userImg">
                        <!-- 用户头像 -->
                        <el-image style="width: 100%; height: 100%" :src="imgUrl" fit="cover" :close="true"
                            :hide-on-click-modal="true" />
                    </div>
                </div>
                <div class="info">
                    <div class="name">{{ friendInfo.username }}</div>
                    <div class="message">{{ currentMessage }}</div>
                </div>
            </div>
            <div class="function">
                <ul class="menu-list">
                    <li v-for="(item, index) in iconfontList" class="iconfont" @click="selectFunction"
                        :key="index">
                        <el-icon class="icon" size="1.8rem" color="#727885">
                            <component :is="item" />
                        </el-icon>
                    </li>
                </ul>
            </div>
        </div>
        <div class="chat-container">
            <div ref="chatInfo" id="chat-infos" class="chat-infos">
                <button id="backToBottomBtn" @click="scrollToBottom()">{{ chatInfoStore.chatInfoList[currentId] == undefined ?  "快来开始聊天吧":"返回底部" }}</button>
                <chatFrame v-for="(item, index) in chatInfoStore.chatInfoList[currentId]" :index="index"
                    :role="item.role" :message="item.message" :photoUrl="item.role == 'user' ? photo : imgUrl">
                </chatFrame>
            </div>
            <div class="chat-emit">
                <div class="emoji">
                    <div class="location">
                        <span>
                            <!-- 表情选择器，支持点击添加表情 -->
                            <V3Emoji @click-emoji="clickEmoji" size="mid" :options-name="optionsName" FixType="upright">
                            </V3Emoji>
                        </span>
                    </div>
                </div>
                <div class="input">
                    <el-input v-model="message" style="width: 100%; height: 50%" placeholder="Please input"
                        maxlength="200" minlength="1" />
                </div>
                <div class="emit">
                    <div class="location location-emit" @click="sendMessage(currentId, message)">发送</div>
                </div>
                <!-- <V3Emoji @click-emoji="clickEmoji" :options-name="customIcon" :recent="true" :custom-size="customSize"/> -->
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, reactive, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ChatDotRound, Setting, More, VideoCamera } from '@element-plus/icons-vue';
import V3Emoji from 'vue3-emoji';
import 'vue3-emoji/dist/style.css';
import chatFrame from './chatFrame.vue';
import { usechatInfoStore } from '../../stores/chatInfoStore';
import { useloginUserInfoStore } from '../../stores/loginUserInfoStore';
import { useSocket_api_store } from '../../stores/socket';
import { serverpath } from '../../config/serverPath.ts'
const socket_api_store = useSocket_api_store()
const chatInfoStore = usechatInfoStore()
const { friendList, photo } = useloginUserInfoStore()
const currentId = ref<number>(0)
const message = ref<string>("");
const imgUrl = ref<string>('');
const route = useRoute()
const iconfontList = [
    Setting,
    More,
    VideoCamera,
    ChatDotRound,
]


// 最新的聊天记录
const currentMessage = ref<string>('')
const chatInfo = ref<any>()

const optionsName = {
  "Smileys & Emotion": "笑脸&表情",
  "Food & Drink": "食物&饮料",
  "Animals & Nature": "动物&自然",
  "Travel & Places": "旅行&地点",
  "People & Body": "人物&身体",
  Objects: "物品",
  Symbols: "符号",
  Flags: "旗帜",
  Activities: "活动",
};

interface chatinfoList {
    message: string,
    timeStamp: string
}
interface friend {
    id: number,
    username: string,
    province: string,
    city: string,
    photo: string,
    updated_at: string,
    chatInfo?: Array<chatinfoList> //将最新一条聊天记录保存在此
}

let friendInfo = reactive<friend | any>({
    id: 0,
    username: '',
    province: '',
    city: '',
    photo: '',
    updated_at: '',
})

function clickEmoji(val:any){
  message.value += val;
};

function selectFunction() {
    // logger.info(`选择了"${index}"号功能项`)
}

async function sendMessage(toId: number, sendmessage: string) {
    if (sendmessage == '') {

        return
    }
    await socket_api_store.B2Bmessageto(toId, sendmessage)
    message.value = ''
    scrollToBottom()
}

//返回顶部
function scrollToBottom() {

    const chatInfos: HTMLElement | any = document.getElementById('chat-infos')
    if (chatInfos == null || chatInfos == undefined) {

    } else {
        chatInfos.scroll({ top: chatInfos.scrollHeight, behavior: "smooth" })
        
    }
}


watch(() => route.params.id, (newId, oldId) => {

    // 对路由变化做出响应...
    if (oldId == newId) {
        scrollToBottom()
        return
    }
    //使用正则表达式匹配并提取数字
    //\d + 表示匹配一个或多个数字
    if (typeof newId === 'string') {
        newId = newId.split(':');
    }
    currentId.value = Number(newId[1])

    friendInfo = friendList.find((item) => {

        return item.id == Number(currentId.value)
    })

    // 动态路由匹配时生命周期钩子不会调用
    imgUrl.value = `${serverpath}/static?name=` + friendInfo.photo
    currentMessage.value = chatInfoStore.chatInfoList[currentId.value] == undefined ? '暂无聊天记录' : chatInfoStore.chatInfoList[currentId.value][chatInfoStore.chatInfoList[currentId.value].length - 1].message;
}, { immediate: true, deep: true })

// 动态路由匹配时生命周期钩子不会调用
watch(() => route.params.id, async () => {
    // 对路由变化做出响应...
    await nextTick();//等待dom渲染完成
    const chatInfos: HTMLElement | any = document.getElementById('chat-infos')
    chatInfos.scroll({ top: chatInfos.scrollHeight, behavior: "auto" })
})

// 接收到新消息则自动触底
watch(() => chatInfoStore.chatInfoList[currentId.value], async () => {
    // console.log(newId.length)
    // console.log(oldId)
    await nextTick();//等待dom渲染完成
    const chatInfos: HTMLElement | any = document.getElementById('chat-infos')
    chatInfos.scroll({ top: chatInfos.scrollHeight, behavior: "smooth" })
}, { immediate: true, deep: true })

onMounted(() => {
    scrollToBottom()
})
</script>

<style lang="scss" scoped>
.chat-interface-container {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
    border-radius: 0 15px 15px 0;
    background-color: #323540;

    .info-function {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-bottom: 2%;
        height: 14%;
        width: 100%;

        .userInfo {
            display: flex;
            flex-direction: row;
            align-items: center;
            align-items: center;
            height: 100%;
            width: 40%;
            min-width: 30%;
            // background-color: #fff;

            .userImg-dot {
                display: flex;
                flex-direction: row;
                align-items: center;
                position: relative;
                height: 111px;
                width: 111px;

                .userImg {
                    position: relative;
                    z-index: 1;
                    height: 65%;
                    width: 65%;
                    background-color: #f5f5f5;
                    clip-path: circle(50% at 50% 50%);
                }

                .dot {
                    position: absolute;
                    z-index: 999;
                    left: 53%;
                    top: 20%;
                    height: 15%;
                    width: 15%;
                    background-color: #89c251;
                    clip-path: circle(50% at 50% 50%);
                }
            }

            .info {
                display: flex;
                flex-direction: column;
                justify-content: center;
                height: 100%;
                width: 65%;
                margin-left: -8%;

                // width:auto;
                .name {
                    // margin-top: -2%;
                    height: 30%;
                    font-size: 110%;
                    font-weight: 550;
                    color: #f5f5f5;
                }

                .message {
                    font-size: 100%;
                    /* 防止文本换行 */
                    // white-space: nowrap;

                    /* 当内容超出容器时隐藏超出部分 */
                    overflow: hidden;

                    /* 使用省略号表示被截断的文本 */
                    text-overflow: ellipsis;
                    // max-width: 30%;
                    max-width: 100%;
                    color: #8d8f97;
                }
            }
        }

        .function {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
            height: 100%;
            width: 40%;
            min-width: 30%;
            // background-color: #fff;

            .menu-list {
                display: flex;
                flex-direction: row-reverse;
                align-items: center;
                width: 100%;

                .iconfont {
                    width: 20%;
                    color: #737885;

                    :hover {
                        color: #1f87e7;
                    }
                }
            }
        }
    }

    .chat-container {
        display: flex;
        flex-direction: column;
        margin: 0% 3.5% 2% 0%;
        height: 78%;
        width: 96.5%;
        border-radius: 15px;
        background-color: #3a3f4c;

        .chat-infos {
            display: flex;
            flex-direction: column;
            row-gap: 4%;
            width: 99%;
            height: 100%;
            padding: 0% 1% 0% 2%;
            overflow: auto;

            #backToBottomBtn {
                color: #727885;
            }

            #anchor {
                height: 100px;
                width: 100%;
                background-color: #fff;
            }

            /*滚动条高宽度*/
            &::-webkit-scrollbar {
                width: 4px;
                height: 4px;
            }

            /*滚动条滑块*/
            &::-webkit-scrollbar-thumb {
                border-radius: 3px;
                background: transparent;
            }

            /*滚动条里面轨道*/
            &::-webkit-scrollbar-track {
                // box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
                display: none;
            }

            /*滚动条的小边角*/
            &::-webkit-scrollbar-corner {
                background: transparent;
            }

            &:hover {

                /*滚动条滑块*/
                &::-webkit-scrollbar-thumb {
                    border-radius: 3px;
                    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
                    background: #c7c4c4;
                }
            }
        }

        .chat-emit {
            display: flex;
            flex-direction: row;
            height: 15%;
            width: 100%;
            border-radius: 0 0 15px 15px;
            justify-content: space-between;
            padding: 0 5% 0 5%;

            // background-color: #fff;

            .emoji,
            .emit {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 12%;
                // background-color: lightblue;

                .location {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 50%;
                    height: 50%;
                    border-radius: 10px;
                    background-color: #474d5a;
                }
            }

            .emit {
                .location-emit {
                    width: 60%;
                    background-color: #a8abb2;

                    &:hover {
                        background-color: #1f87e7;
                        color: #f5f5f5;
                    }
                }
            }

            .input {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                width: 75%;
                // background-color: lightblue;

                ::v-deep .el-input__wrapper {
                    border-radius: 10px;
                    background-color: transparent;
                }

                ::v-deep .el-input__inner {
                    border-radius: 10px;
                    background-color: transparent;

                    color: #8d8f97;

                }

                ::v-deep #placeholder {
                    color: #8d8f97;
                }
            }
        }
    }
}
</style>