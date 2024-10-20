<template>
    <div class="nav-container">
        <ul class="menu-list">
            <li v-for="(item, index) in iconfontList" @click="selectFunction(index)" :key="index">
                <span class="block"></span>
                <span class="iconfont">
                    <el-icon class='icon' :style="{
                        backgroundColor: item.isSelected ? '#1f87e7' : '#323540',
                        color: item.isSelected ? '#1f87e7' : '#727885'
                    }" size="1.5rem">
                        <component :is="item" />
                    </el-icon>
                </span>
            </li>
            <div class="userInfo">
                <div class="dot"></div>
                <div class="userImg">
                    <!-- 用户头像 -->
                    <el-image style="width: 100%; height: 100%" :src="props.photoUrl" fit="cover" />
                </div>
            </div>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { ChatDotRound, Setting, More, VideoCamera, Files } from '@element-plus/icons-vue';
import { watch, nextTick, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import router from '../../router/index.ts';
import { defineEmits } from 'vue'
import { ElNotification } from 'element-plus';
//声明从父组件中传递的方法
const emit = defineEmits(['getFriendStatus'])

const route = useRoute();
var props = defineProps(['photoUrl']);
const iconfontList = [
    ChatDotRound,
    Files,
    VideoCamera,
    More,
    Setting,
]


var currendAction = -1;
function selectFunction(index: number) {

    if (currendAction == index) {
        return
    } else if(index < 2) {
        currendAction = index
    } else {
        notificationEmits(notificationType.warning, '警告', '该功能正在开发中')
        return
    }
    var icons: any = document.querySelectorAll('.icon');
    var blocks: any = document.querySelectorAll('.block');

    console.log(`选择了${index}`)

    switch (index) {
        case 0:
            router.push({ path: '/chat' })
            console.log('跳转至/chat')
            break;
        case 1:
            emit('getFriendStatus')
            router.push({ path: '/chat/friendActionPanel' })
            console.log('跳转至/friendActionPanel')
            break;
        default:
            
            break;
    }



    // 重置所有图标的颜色和块的背景色  
    icons.forEach((icon: any, i: number) => {
        icon.style.color = '#727885';
        if (blocks[i]) { // 确保 blocks[i] 存在  
            blocks[i].style.backgroundColor = '#323540';
        }
    });

    // 更改特定索引的图标颜色和块背景色  
    if (index < icons.length && index < blocks.length) {
        icons[index].style.color = '#1f87e7';
        blocks[index].style.backgroundColor = '#1f87e7';
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

watch(() => route.path, async (currentPath) => {
    await nextTick();
    console.log(currentPath)
    switch (currentPath) {
        case '/chat':
            selectFunction(0);
            break;

    }
}, { immediate: true })

onMounted(() => {
    selectFunction(0)
})
</script>

<style lang="scss" scoped>
.nav-container {
    // margin-top: 5vh;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    // background-color: #fff;
    // border-radius: 15px;

    .menu-list {
        // background-color: #323540;
        // padding-top: 10%;
        padding-top: 160%;
        width: 100%;
        height: 100%;
        border-radius: 15px 0 0 15px;
        background-color: #323540;

        li {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-grow: 1;
            /* 缩小的最小限制 */
            width: 100%;
            height: 10%;


            &:hover {
                .icon {
                    color: #1f87e7;
                }

                .block {
                    background-color: #1f87e7;
                }
            }

            .block {
                // display: inline-block;
                // flex-shrink: 1;
                height: 1.5rem;
                width: 7%;
                // background-color: #fff;
            }

            .iconfont {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-grow: 20;
                flex-grow: 1;
            }
        }

        .userInfo {
            position: relative;
            padding: 0;
            padding-top: 80%;
            margin: auto;
            flex-shrink: 1;
            width: 60px;
            height: 60px;

            .userImg {
                padding: 0;
                z-index: 1;
                width: 60px;
                height: 60px;
                flex-shrink: 1;
                flex: 1;
                background-color: #f5f5f5;
                clip-path: circle(50% at 50% 50%);
            }

            .dot {
                position: absolute;
                z-index: 2;
                right: 8%;
                margin-top: 0%;
                height: 10px;
                width: 10px;
                flex-shrink: 1;
                background-color: #89c251;
                clip-path: circle(50% at 50% 50%);
            }
        }
    }
}
</style>