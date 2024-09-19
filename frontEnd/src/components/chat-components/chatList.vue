<template>
    <div class="list-container">
        <h2 class="h2">{{ props.account }}聊天室</h2>
        <h3 class="h3">聊天列表</h3>
        <div class="chat-list">
            <TransitionGroup v-draggable="[props.friendList, { animation: 150, onUpdate, onStart, }]" type="transition"
                tag="ul" name="fade" id="anchor" class="chat-list">
                <li v-for="(item, index) in props.friendList" :key="item.id"
                    :class="`${selectChatId == item.id ? 'selectedChat chatItem' : 'chatItem'} `"
                    :id="`${selectChatId == item.id ? 'selectedChat chatItem' : 'chatItem'} `"
                    @click="selectChat(index, item.id)">
                    <div class="userInfo">
                        <div class="dot"></div>
                        <div class="userImg">
                            <!-- 用户头像 -->
                            <el-image style="width: 100%; height: 100%"
                                :src="'http://localhost:8000/static?name=' + item.photo" fit="cover" />
                        </div>
                    </div>
                    <div class="info">
                        <span class="name">{{ item.username }}</span>
                        <span class="message">{{ chatInfoStore.chatInfoList[item.id] == undefined ? '暂无聊天记录' :
                            chatInfoStore.chatInfoList[item.id][chatInfoStore.chatInfoList[item.id].length - 1].message
                            }}</span>
                    </div>
                </li>
            </TransitionGroup>
            <preview-list :list="props.friendList" />
            <!-- <button id="backToTopBtn" @click="scrollToTop()">返回顶部</button> -->
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Logger } from 'tslog';
import { ref, reactive } from 'vue'
import { vDraggable } from 'vue-draggable-plus'
import router from '../../router';
import { usechatInfoStore } from '../../stores/chatInfoStore';
const chatInfoStore = usechatInfoStore()
var props = defineProps(['friendList', 'account']); //父传子数组|对象写法都可以
const logger = new Logger({ name: 'chatList' })
const selectChatId = ref<number>(0)
function onUpdate() {
    logger.info('onUpdate')
}
function onStart() {
    logger.info('onStart')
}


//选择的聊天
function selectChat(index: number, id: number) {
    //跳转路由到当前用户
    router.push({ path: `chatpage:${id}` })
    selectChatId.value = id;
    var tempListItem = props.friendList[index]
    props.friendList.splice(index, 1)
    props.friendList.unshift(tempListItem)
    logger.info(`selectChatId: ${selectChatId.value}`)
    scrollToTop()
}


//返回顶部
function scrollToTop() {
    // const selectChat: HTMLCollection = document.getElementsByClassName('chatItem')
    const anchor: HTMLElement | any = document.getElementById('anchor')
    // anchor.scrollIntoView({ behavior: 'smooth' });
    anchor.scroll({ top: 0, behavior: "smooth" })
}
</script>

<style lang="scss" scoped>
.list-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #323540;

    .h2 {
        height: 10%;
        font-size: 20px;
        width: 100%;
        color: #f5f5f5;
        margin-top: 5%;
    }

    .h3 {
        height: 6%;
        width: 100%;
        font-size: 15px;
        margin-top: 20%;
        margin-bottom: 5%;
        color: #8d8f97;
    }

    .chat-list {
        height: 92.8%;
        width: 95%;
        margin-right: 5%;
        // padding-right: 5%;
        background-color: #323540;
        overflow-y: auto;
        overflow-x: hidden;
        border-radius: 12px 12px 12px 12px;

        /*滚动条高宽度*/
        &::-webkit-scrollbar {
            margin-left: 3%;
            width: 4px;
            height: 10%;
            // display: none;
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


        .chatItem {
            display: flex;
            flex-direction: row;
            align-items: center;
            // background-color: #9cdcfe;
            height: 13%;
            width: 100%;
            padding-right: 2%;
            margin-top: 6%;
            margin-right: 16%;
            border-radius: 12px;
            background-color: #3a3f4c;

            .userInfo {
                position: relative;
                padding: 0;
                margin-left: 6%;
                flex-shrink: 1;
                height: 50px;
                width: 50px;

                .userImg {
                    display: inline-block;
                    margin-top: 0%;
                    padding: 0;
                    z-index: 1;
                    height: 100%;
                    width: 100%;
                    background-color: #fff;
                    clip-path: circle(50% at 50% 50%);
                }

                .dot {
                    position: absolute;
                    z-index: 2;
                    right: 8%;
                    top: 2%;
                    height: 16%;
                    width: 16%;
                    flex-shrink: 1;
                    background-color: #89c251;
                    clip-path: circle(50% at 50% 50%);
                }
            }

            .info {
                display: flex;
                flex-direction: column;
                align-items: center;
                margin-left: 8%;
                height: 100%;
                width: 50%;
                max-width: 60%;
                padding-top: 3%;

                .name {
                    // margin-top: 10%;
                    width: 100%;
                    height: 50%;
                    font-size: 100%;
                    font-weight: 520;
                    color: #f5f5f5;
                    max-width: 90%;

                    /* white-space: nowrap; */
                    overflow: hidden;
                    // display: -webkit-box;
                    -webkit-box-orient: vertical;
                    // -webkit-line-clamp: 1;
                    text-overflow: ellipsis;
                }

                .message {
                    // display: block;
                    // margin-top: -8%;
                    width: 100%;
                    height: 50%;
                    font-size: 100%;
                    max-width: 90%;
                    /* 防止文本换行 */
                    white-space: nowrap;

                    /* 当内容超出容器时隐藏超出部分 */
                    overflow: hidden;

                    /* 使用省略号表示被截断的文本 */
                    text-overflow: ellipsis;
                    color: #8d8f97;
                }
            }
        }

        /* 被选中的id */
        .selectedChat {
            background-color: #1f87e7;

            .info {
                color: #fff;

                .message {
                    color: #f5f5f5;
                }
            }

        }

    }


}

.fade-move,
.fade-enter-active,
.fade-leave-active {
    transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: scaleY(0.01) translate(30px, 0);
}

.fade-leave-active {
    position: absolute;
}
</style>