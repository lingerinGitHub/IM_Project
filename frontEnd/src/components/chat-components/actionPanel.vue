<template>
    <div class="list-container">
        <h2 class="h2">{{ props.name }}聊天室</h2>
        <div class="h3">
            <span>聊天列表</span>
            <span class="add">
                <!-- 组件1 -->
                <el-popover placement="bottom" title="请输入好友名" trigger="click"
                    popper-style="width:30%;max-height:60vh;overflow:auto;"
                    content="this is content, this is content, this is content">
                    <el-input v-model="searchFriendname" style="width: 100%" placeholder="Please input" size="small"
                        class="input-with-select">
                        <template #prepend style="width: 20%;">
                            <el-button :icon="Search" @click="searchFriend(searchFriendname)" />
                        </template>
                    </el-input>
                    <template #reference>
                        <div>
                            <!-- 组件2 -->
                            <el-tooltip class="box-item" effect="light" content="点击添加好友" placement="top-end">
                                <el-icon class='icon' :style="{
                                    // backgroundColor:  '#1f87e7',
                                    color: '#8d8f80',
                                }" size="1.2rem">
                                    <component :is="Plus" />
                                </el-icon>
                            </el-tooltip>
                        </div>
                    </template>
                    <div class=" pt-2 flex flex-wrap gap-2">
                        <!-- 好友列表s -->
                        <div v-for="(item, index) in userList" :key="index" @click="addFriend(item.id)">
                            <friendFrame :name="item.username" :from="item.province + item.city"
                                :photoUrl="item.photo == '0' ? `${serverpath}/static?name=` + item.photo : `${serverpath}/static?name=1.jpg`"
                                :id="item.id">

                            </friendFrame>
                        </div>
                    </div>

                </el-popover>
            </span>
        </div>
        <!-- 其他功能区 -->
        <slot name="panel"></slot>
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
// import router from '../../router';
import { Plus, Search } from '@element-plus/icons-vue';
import friendFrame from './friendFrame.vue'
import { serverpath } from '../../config/serverPath';
import { addFriend_api, searchFriend_api } from '../../api/friend_api';
import { ElNotification } from 'element-plus';
import { useloginUserInfoStore } from '../../stores/loginUserInfoStore';
import { storeToRefs } from 'pinia';

const loginUserInfoStore = useloginUserInfoStore()
const { friendList } = storeToRefs(loginUserInfoStore)

var props = defineProps(['friendList', 'email', 'name', 'id', 'test']); //父传子数组|对象写法都可以
const searchFriendname = ref<string>('')

interface userItem {
    id: number,
    username: string,
    province: string,
    city: string,
    photo: string
}
const userList: userItem[] = reactive([]);


// 查找用户
var currentName = ''
async function searchFriend(searchUsername: string) {

    if (searchUsername == '' && currentName == searchUsername) {
        return
    } else {
        currentName = searchUsername
    }

    const searchResult = await searchFriend_api(props.id, searchUsername)

    userList.splice(0, userList.length)

    for (let i = 0; i < searchResult.length; i++) {
        userList.push(searchResult[i] as userItem)
    }
}


// 添加好友
async function addFriend(friendid: number) {

    if (friendid == props.id) {
        notificationEmits(notificationType.error, '失败', '请不要添加自己为好友')
        return
    }
    
    let ifAccept = false
    for(let i=0; i<friendList.value.length; i++) {
        if(friendList.value[i].id == friendid) {
            ifAccept = true;
            break;
        }
    }
    if(ifAccept) {
        notificationEmits(notificationType.error, '失败', '已添加为好友')
        return
    }

    console.log('用户id：' + props.id + ' 好友id：' + friendid)
    const addResult = await addFriend_api(props.id, friendid)
    if (addResult.status == 200) {
        notificationEmits(notificationType.success, '成功', '请求发送成功')
    } else {
        notificationEmits(notificationType.error, '失败', '请求已发送，请内心等待')
    }

}


enum notificationType {
    success = 'success',
    warning = 'warning',
    info = 'info',
    error = 'error'
}
//弹窗
function notificationEmits(type: notificationType, title: string, message: string) {
    ElNotification({
        title: title,
        message: message,
        type: type,
        duration: 2500,
        offset: 50,
    })
}

</script>

<style>
friendFrame {
    padding: 100px;
}

.popover {
    height: 500px;
    background-color: pink;
}

::v-deep .el-popper {
    height: 500px;
    background-color: pink;
}
</style>

<style lang="scss" scoped>
.list-container {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    overflow: auto;
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
        display: flex;
        justify-content: space-between;
        align-items: center;

        .add {
            display: flex;
            height: 100%;
            align-items: center;
            padding-right: 8%;

            .popover {
                height: 500px
            }
        }
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
                    background-color: #f5f5f5;
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