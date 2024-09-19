<!-- 页面头部可拖拽部分 -->

<template>
  <!-- <div id="list-container" v-draggable="[
    props.friendList,
    {
      animation: 150,
      onUpdate,
      onStart
    }
  ]">
    <div class="imagebox" v-for="item in props.friendList" :key="item.id">
      <div class="username" @click="selectChatId(Number(item.id))" >{{ item.username }}</div>
      <el-image style="width: 60px; height: 60px" :src="imgUrl[0]" fit="cover" :preview-src-list="imgUrl" :close="true"
        :hide-on-click-modal="true" />
      <div @click="selectChatId(Number(item.id))">{{ latestmessage }}</div>
    </div>
  </div>
  <div id="userinfo">
    <div class="chatingUserInfo">linger & linger</div>
  </div> -->
  <div class="list-container bg-cyan-200">
    <TransitionGroup v-draggable="[props.friendList, {
      animation: 150,
      onUpdate,
      onStart
      // bg-gray-500/5 rounded
    }]" type="transition" tag="ul" name="fade" class="bg-gray-500/5 rounded">
      <li v-for="(item, index) in props.friendList" :key="item.id" class="imagebox bg-gray-500/5 rounded ">
        <div class="username" @click="selectChatId(Number(item.id))">{{ item.username }}</div>
        <el-image style="width: 60px; height: 60px" :src="imgUrl[0]" fit="cover" :preview-src-list="imgUrl"
          :close="true" :hide-on-click-modal="true" />
        <div @click="selectChatId(Number(item.id))">{{ latestmessage }}</div>
      </li>
    </TransitionGroup>
    <preview-list :list="props.friendList" />
    <div id="userinfo">
      <div class="chatingUserInfo">linger & linger</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, } from 'vue'
import { vDraggable } from 'vue-draggable-plus'
import { usechatInfoStore } from '../stores/chatInfoStore'
import { Logger } from 'tslog'
const logger = new Logger({ name: 'chatList' })
var props = defineProps(['friendList']); //数组|对象写法都可以
const latestmessage = ref('我是最新消息');
const chatInfoStore = usechatInfoStore()

const imgUrl = ref(["https://tse1-mm.cn.bing.net/th/id/OIP-C.EMmWPY7BuoW-ojFGtDd7vAAAAA?rs=1&pid=ImgDetMain"]);

console.log(imgUrl.value)
// 拖拽开始
function onStart() {
  logger.info('拖拽开始')
}

//拖拽结束
function onUpdate() {
  logger.info('拖拽结束')
}
// 点击选择聊天
function selectChatId(id: number) {
  // logger.info(props.friendList)
  let temp: any = {};
  logger.debug(`选择了"${id}"chat`)
  // chatInfoStore.setChatingFriendId(id)
  // 被选中的对象变灰
  const num = props.friendList.findIndex(function (item: any, index: number) {
    logger.info(`查找"${id}"`)
    logger.info(item)
    return item.id == id
  })
  temp = props.friendList[0]//取出第一个
  props.friendList[0] = props.friendList[num]
  props.friendList[num] = temp
  logger.debug(`第"${num}"个div`)
}

const list: any = reactive([
  {
    name: '梁梓锋1234567',
    id: 1,
  },
  {
    name: 'Jean',
    id: 2,
  },
  {
    name: 'Johanna',
    id: 3,
  },
  {
    name: 'Juan',
    id: 4,
  },
  {
    name: 'Joao',
    id: 5,
  },
  {
    name: 'Jean',
    id: 6,
  },
  {
    name: 'Johanna',
    id: 7,
  },
  {
    name: 'Juan',
    id: 8,
  },
  {
    name: 'Joao',
    id: 9,
  },
  {
    name: 'Jean',
    id: 10,
  },
  {
    name: 'Johanna',
    id: 11,
  },
  {
    name: 'Juan',
    id: 12,
  },
  {
    name: 'Joao',
    id: 13,
  },
  {
    name: 'Jean',
    id: 14,
  },
  {
    name: 'Johanna',
    id: 15,
  },
  {
    name: 'Jean',
    id: 16,
  },
  {
    name: 'Johanna',
    id: 17,
  },
  {
    name: 'Jean',
    id: 18,
  },
  {
    name: 'Johanna',
    id: 19,
  },
  {
    name: 'Jean',
    id: 20,
  },
  {
    name: 'Johanna',
    id: 21,
  },
  {
    name: 'Jean',
    id: 22,
  },
  {
    name: '11111111111Johanna',
    id: 23,
  }
])

</script>

<style>
.list-container {
  /* display: flex; */
  overflow-y: auto;
  width: 100%;
  height: 80%;
  margin-left: 10px;
  box-sizing: border-box;

  .username {
    display: flex;
    justify-content: center;
    max-width: 100%;
    /* white-space: nowrap; */
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
    text-overflow: ellipsis;
  }
}

#userinfo {
  display: grid;
  grid-template-columns: repeat(4, minmax(100px, 1fr));
  grid-template-rows: 1fr;
  column-gap: 10px;
  width: 100%;
  height: 20%;
  box-sizing: border-box;
  padding: 0;
  /* background-color: pink; */

  .chatingUserInfo {
    grid-column-start: 0;
    grid-column-end: 3;
    margin-top: 0px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px
  }
}

.imagebox {
  display: inline-block;
  height: 92%;
  width: 60px;
  background-color: pink;
  border-radius: 8px;
  margin: 5px;
  margin-bottom: 10px;
  font-size: 14px;
  /* padding: 5px;s */
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