<template>
    <div ref="container" :class="props.role">
        <div ref="chatframe" id="chatframe" class="image">
            <img :src="photoUrl" alt="">
        </div>
        <div ref="talkbubble" id="talkbubble" class="talkbubble" v-if="props.message">
            {{ props.message }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted } from 'vue'
const props = defineProps({
    // 简单的类型检查  
    role: String,
    message: String,
    photoUrl: String,
    // time?: String, // 是可选项，可以不填充
});

const chatframe = ref(null) as any;
const talkbubble = ref(null) as any;
const container = ref(null) as any;

onMounted(() => {
    console.log(talkbubble.value.offsetHeight)
    const height = talkbubble.value.offsetHeight;
    // console.log(height)
    container.value.style.height = (height + 20) + 'px';
    // console.log(container.value.offsetHeight)
})
</script>

<style lang="scss" scoped>
/* 当对话框属于用户 */
.user {
    display: block;
    float: left;
    position: relative;
    min-height: 70px;
    width: 100%;
    // background-color: pink;

    .image {
        display: inline-block;
        position: absolute;
        right: 0%;
        height: 60px;
        width: 60px;
        clip-path: circle(50% at 50% 50%);
    }

    .talkbubble {
        display: inline-block;
        position: absolute;
        right: 80px;
        // padding: 10px;
        margin-left: 70px;
        padding-left: 12px;
        padding-right: 8px;
        padding-top: 8px;
        padding-bottom: 8px;
        min-width: 0px;
        /* 最小宽度设置为00% */
        max-width: 30%;
        /* 最大宽度设置为20% */
        word-break: break-all;
        height: auto;
        background: #1f87e7;
        border-radius: 10px;

        &::before {
            content: "";
            position: absolute;
            left: 100%;
            top: 20px;
            width: 0;
            height: 0;
            border-top: 9px solid transparent;
            border-left: 16px solid #358bdb;
            border-bottom: 9px solid transparent;
            transform: translate(0, -50%);
        }
    }
}

/* 当对话框属于对方 */
.opposite {
    display: block;
    float: right;
    position: relative;
    min-height: 70px;
    width: 100%;
    // background-color: pink;

    .image {
        display: inline-block;
        position: absolute;
        height: 60px;
        width: 60px;
        clip-path: circle(50% at 50% 50%);
    }

    .talkbubble {
        display: inline-block;
        position: absolute;
        margin-left: 80px;
        padding-left: 12px;
        padding-right: 8px;
        padding-top: 8px;
        padding-bottom: 8px;
        min-width: 0px;
        /* 最小宽度设置为00% */
        max-width: 30%;
        /* 最大宽度设置为20% */
        word-break: break-all;
        height: auto;
        border-radius: 10px;
        background: #f5f5f5;
        border-radius: 10px;

        &::before {
            content: "";
            position: absolute;
            right: 100%;
            top: 20px;
            width: 0;
            height: 0;
            border-top: 9px solid transparent;
            border-right: 16px solid #f5f5f5;
            border-bottom: 9px solid transparent;
            transform: translate(0, -50%);
        }
    }
}

@mixin chatrole($condition) {

    /* 如果是用户的对话框 */
    @if $condition =='user' {
        .talk-bubble {
            position: relative;
            // padding: 10px;
            padding-left: 12px;
            padding-right: 8px;
            padding-top: 8px;
            padding-bottom: 8px;
            min-width: 0px;
            /* 最小宽度设置为200px */
            max-width: 20%;
            /* 最大宽度设置为600px */
            word-break: break-all;
            height: auto;
            background: #90cf5b;
            border-radius: 10px;

            &::before {
                content: "";
                position: absolute;
                left: 100%;
                top: 50%;
                width: 0;
                height: 0;
                border-top: 9px solid transparent;
                border-left: 16px solid #90cf5b;
                border-bottom: 9px solid transparent;
                transform: translate(0, -50%);
            }
        }
    }

    /* 如果是对方的对话框 */
    @else if $condition =='opposite' {
        .talk-bubble {
            position: relative;
            // padding: 10px;
            padding-left: 12px;
            padding-right: 8px;
            padding-top: 8px;
            padding-bottom: 8px;
            min-width: 0px;
            /* 最小宽度设置为200px */
            max-width: 20%;
            /* 最大宽度设置为600px */
            word-break: break-all;
            /* 不论是中文还是英文都自动换行 */
            height: auto;
            background: #f5f5f5;
            border-radius: 10px;

            &::before {
                content: "";
                position: absolute;
                right: 100%;
                top: 50%;
                width: 0;
                height: 0;
                border-top: 9px solid transparent;
                border-right: 16px solid #f5f5f5;
                border-bottom: 9px solid transparent;
                transform: translate(0, -50%);
            }
        }
    }
}
</style>