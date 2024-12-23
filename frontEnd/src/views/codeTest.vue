<template>
  <div class="input-component">
    <label :for="label">{{ label }}</label>
    <input :id="label" class="input" v-model="inputValue" @input="inputMethod">
    <!-- 在父组件向子组件插槽传入其他组件 -->
    <slot></slot>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const label = ref('标题')
const inputValue = ref('')

// 监听输入值变化
function inputMethod(){
  console.log(inputValue.value)
}
</script>

<style scoped>
.input {
  background-color: pink;
}
</style>