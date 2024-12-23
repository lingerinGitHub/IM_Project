<template>
    <el-popover placement="top-start" trigger="hover"
        content="单击即可添加好友">
        <template #reference>
            <div class="friendFrame">
                <div class="image">
                    <el-image style="width: 100%; height: 100%" :src='props.photoUrl' fit="fill" />
                </div>
                <div class="friendInfo">
                    <div class="name">{{ props.name }}</div>
                    <div class="from">{{ props.from == 0 ? '未知':props.from }}</div>
                </div>
            </div>
        </template>
    </el-popover>
</template>

<script lang="ts" setup>
// import { ref } from 'vue';

var props = defineProps(['photoUrl', 'name', 'from', 'id']); //父传子数组|对象写法都可以

// const visible = ref(false)


// function test(){
//     console.log('我被触发了')
//     // visible.value = true
// }
</script>

<style lang="scss">
.friendFrame {
    // padding: 10px;
    display: inline-block;
    background-color: #3a3f4c;
    width: auto;
    max-width: 160px;
    overflow: hidden;
    padding: 5px;
    border-radius: 6px;
    font-size: 0;

    .image {
        display: inline-block;
        height: 26px;
        width: 26px;
    }

    .friendInfo {
        padding-left: 5px;
        display: inline-block;
        vertical-align: top;
        // height: 100%;

        .name {
            height: 16px;
            font-size: 13px;
            max-width: 90px;
            color: #f5f5f5;
            overflow: hidden;
            /* 使用省略号表示被截断的文本 */
            text-overflow: ellipsis;
        }

        .from {
            height: 10px;
            font-size: 10px;
            color: #8d8f97;
            /* 使用省略号表示被截断的文本 */
            text-overflow: ellipsis;
            color: #8d8f97;
        }
    }
}
</style>