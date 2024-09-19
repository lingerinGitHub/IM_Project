<template>
  <div class="box">
    <div class="input">
      <el-input v-model="value" style="width: 240px" placeholder="请输入内容" />
      <!-- 表情选择器，点击添加表情 -->
      <V3Emoji
        @click-emoji="clickEmoji"
        :recent="true"
        size="small"
        :options-name="optionsName"
      ></V3Emoji>
    </div>
    <el-button type="primary" @click="submit">确认</el-button>
  </div>
  <p>要提交的内容为：{{ submitvalue }}</p>
</template>
 
<script setup>
import { ref } from "vue";
import V3Emoji from "vue3-emoji";
import "vue3-emoji/dist/style.css";
 
const optionsName = {
  "Smileys & Emotion": "笑脸&表情",
  "Food & Drink": "食物&饮料",
  "Animals & Nature": "动物&自然",
  "Travel & Places": "旅行&地点",
  "People & Body": "人物&身体",
  Objects: "物品",
  Symbols: "符号",
  Flags: "旗帜",
  Activities: "活动",
};
const value = ref("");
const clickEmoji = (val) => {
  value.value += val;
};
const submitvalue = ref("");
const submit = () => {
  submitvalue.value = value.value;
};
</script>
 
<style lang="scss" scoped>
.box,
.input {
  display: flex;
  align-items: center;
}
.input {
  border: 1px solid #f0f0f0;
  border-radius: 5px;
  ::v-deep(.el-input__wrapper) {
    box-shadow: none;
    background: #f0f0f0;
  }
  .V3Emoji-module__emoji-item___aCxWs {
    width: fit-content;
  }
}
.input,
p {
  margin: 50px;
}
</style>
 