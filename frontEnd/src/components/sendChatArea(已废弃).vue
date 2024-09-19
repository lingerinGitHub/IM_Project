<template>
    <div class="sendChatArea w-full h-full">
        <div class="functionArea">
            <div class=" iconBox h-full w-full">
                <Lollipop class=" iconStyle h-8 w-8" />
            </div>
            <div class=" iconBox h-full w-full">
                <FolderOpened class=" iconStyle h-8 w-8" />
            </div>
            <div class=" iconBox h-full w-full">
                <ChatLineRound class=" iconStyle h-8 w-8" />
            </div>
            <div class=" iconBox h-full w-full">
                <Open class=" iconStyle h-8 w-8" />
            </div>
            <div class=" iconBox h-full w-full">
                <Edit class=" iconStyle h-8 w-8" />
            </div>
        </div>
        <div class="chatArea">
            <el-input v-model="textarea2" style="width: 100%; height: 80%" :autosize="{ minRows: 16, maxRows: 16 }"
                type="textarea" :prefix-icon="Search" placeholder="请输入" maxlength="1000" show-word-limit
                :autofocus="false"  resize='none'  input-style="font-size: 18px"/>
            <div class="bottomArea">
                <el-button class="sendbottom" type="primary" round>发送</el-button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { Search, Lollipop, FolderOpened, ChatLineRound, Edit, Open } from '@element-plus/icons-vue'
const textarea2 = ref('')
const input3 = ref('')
const select = ref('')
</script>

<style lang="scss" scoped>
.sendChatArea {
    display: flex;
    // height: 510px;
    // width: 300px;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    border-radius: 8px;
    margin-top: -50px;
    margin-bottom: 50px;
    background-color: pink;

    .functionArea {
        display: grid;
        // align-items: center; /* 垂直居中 */
        // justify-content: center; /* 水平居中 */
        // place-items: center; /* 简写，等同于 justify-items: center; align-items: center; */
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(1, 1fr);
        column-gap: 5px;
        box-sizing: border-box;
        /* 确保padding不会影响容器的总宽度 */

        .iconBox {
            display: grid;
            place-items: center;
            &:hover {
                background-color: darken($icon-base-color, 50%);
            }

            .iconStyle {
                color: #f5f5f5;
            }
        }
    }

    .chatArea {
        position: relative;
        width: 100%;
        height: calc(100% - 50px);
        background-color: #eee;
    }


    .bottomArea {
        text-align: center;
        width: 100%;
        height: 50px;
        // background-color: #ccc;
    }

    .sendbottom {
        position: absolute;
        bottom: 20px;
    }

    .functionArea {
        width: 100%;
        height: 50px;
        background-color: #ccc;
    }

    .chatArea {
        position: relative;
        width: 100%;
        height: calc(100% - 50px);
        background-color: #eee;
    }


    .bottomArea {
        text-align: center;
        width: 100%;
        height: 50px;
        // background-color: #ccc;
    }

    .sendbottom {
        position: absolute;
        bottom: 20px;
        right: 20px;
        // width: 100px;
        // height: 30px
        // position: sticky;
        // bottom: 0;
        // right: 0;
        width: 20%;
        height: 30px;
    }
}
</style>