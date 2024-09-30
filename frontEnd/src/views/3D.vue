<template>
    <button @click="spin">旋转</button>
    <div class="view-container flex justify-center ">
        <div class="item1 absolute">我是item1</div>
        <div class="item2 absolute">我是item2</div>
    </div>
</template>

<script lang="ts" setup>
var ifSpan = false;
function spin() {
    var container: any = document.querySelector('.view-container')
    if(ifSpan == false){
        container.classList.add('spin')
        ifSpan = true;
        return 
    }
    container.classList.remove('spin')
    ifSpan = false

}

</script>

<style lang="scss" scoped>
.view-container {
    margin: auto;
    position: relative;
    height: 300px;
    width: 200px;
    // background-color: lightblue;
    transform-style: preserve-3d;
    perspective: 1000px;
    transition: all 2s;
    // backface-visibility: hidden;


    .item1 {
        background-color: yellowgreen;
        height: 90%;
        width: 90%;
        backface-visibility: hidden;

    }

    .item2 {
        background-color: pink;
        height: 80%;
        width: 80%;
        transition: all 0s;
        backface-visibility: hidden;
        transform: rotateY(180deg);

    }

}

.spin {
    transform: rotate3d(0, 1, 0, 180deg);
}
</style>

