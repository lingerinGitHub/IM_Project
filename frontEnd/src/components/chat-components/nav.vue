<template>
    <div class="nav-container">
        <ul class="menu-list">
            <li v-for="(item, index) in iconfontList" @click="selectFunction(index)" :key="index">
                <div class="block"></div>
                <span class="iconfont">
                    <el-icon class="icon" size="1.5rem" color="#727885">
                        <component :is="item" />
                    </el-icon>
                </span>
            </li>
            <div class="userInfo">
                <div class="dot"></div>
                <div class="userImg">
                    <!-- 用户头像 -->
                    <el-image style="width: 100%; height: 100%"
                        :src="props.photoUrl"
                        fit="cover" />
                </div>
            </div>
        </ul>
    </div>
</template>

<script lang="ts" setup>
import { ChatDotRound, Setting, More, VideoCamera } from '@element-plus/icons-vue'
import { Logger } from 'tslog'
const logger = new Logger({ name: 'nav' })
var props = defineProps(['photoUrl']);
const iconfontList = [
    ChatDotRound,
    VideoCamera,
    More,
    Setting,
]

function selectFunction(index: number) {
    var icons: any | HTMLCollection = document.getElementsByClassName('icon')
    var blocks: any | HTMLCollection = document.getElementsByClassName('block')
    for (let i = 0; i < icons.length; i++) {
        icons[i].style.color = '#727885'
        blocks[i].style.backgroundColor = '#323540'
    }
    icons[index].style.color = '#1f87e7'
    blocks[index].style.backgroundColor = '#1f87e7'
}
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
                display: inline-block;
                flex-shrink: 1;
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
            margin-top: 180px;
            margin-left: 22%;
            margin-right: 10px;
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
                background-color: pink;
                clip-path: circle(50% at 50% 50%);
            }

            .dot {
                position: absolute;
                z-index: 2;
                right: 8%;
                top: 2%;
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