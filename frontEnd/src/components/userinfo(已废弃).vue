<template>
    <div class="container h-full w-full">
        <div class="image bg-pink-200 h-full w-full">
            <div class="headportrait ">
                <el-image style="width: 100%; height: 100%" src="../../public/头像/1.jpg" fit="cover" />
            </div>
        </div>
        <div class="infoTop bg-pink-200 h-full w-full">
            {{ currentTime }}
        </div>
        <div class="infoMiddleLeft bg-pink-200 h-full w-full">
            {{username}}
        </div>
        <div class="infoMiddleRight bg-pink-200 h-full w-full"></div>
        <div class="infoBottom bg-pink-200 h-full w-full">
            {{ province }} {{ city }}
        </div>
        <div class="bottom bg-pink-200 h-full w-full">
            {{ introduce }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const currentTime = ref('currentTime')
const username = ref('linger')
const introduce = ref('introduce')
const province = ref('province')
const city = ref('city')
</script>

<style lang="scss" scoped>
.container {
    display: grid;
    align-items: center;
    /* 垂直居中 */
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(4, 1fr);
    row-gap: 5px;
    column-gap: 5px;
    padding-left: 5px;
    padding-top: 5px
}

.image {
    grid-column-start: 1;
    grid-column-end: 3;
    grid-row-start: 1;
    grid-row-end: 4;
}

.infoTop {
    grid-column-start: 3;
    grid-column-end: 7;
    grid-row-start: 1;
    grid-row-end: 2;
}

.infoMiddleLeft {
    grid-column-start: 3;
    grid-column-end: 6;
    grid-row-start: 2;
    grid-row-end: 3;
}

.infoBottom {
    grid-column-start: 3;
    grid-column-end: 7;
    grid-row-start: 3;
    grid-row-end: 4;
}

.bottom {
    grid-column-start: 1;
    grid-column-end: 7;
    grid-row-start: 4;
    grid-row-end: 5;
}

.infoMiddleRight {
    grid-column-start: 6;
    grid-column-end: 7;
    grid-row-start: 2;
    grid-row-end: 3;
}

.headportrait {
    /* border-radius: 10px; */
    /* clip-path: circle(50% at 50% 50%); */
}
</style>