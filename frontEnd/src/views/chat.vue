<template>
    <!-- <div v-if="account == ''"><RouterView></RouterView></div> -->
    <div class="body" >
        <div class="flex-container" >
            <div class="nav-menu-list" style="flex-grow:0">
                <Nav :photoUrl="photo"></Nav>
            </div>
            <div class="nav-chat-list" style="flex-grow:0; background-color: #fff;">
                <ChatList :friendList="friendList" :account="account"></ChatList>
            </div>
            <div class="chat-interface" style="flex-grow:0">
                <!-- <chatInterface></chatInterface> -->
                <keep-alive>
                    <RouterView></RouterView>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Nav from '../components/chat-components/nav.vue';
import ChatList from '../components/chat-components/chatList.vue';
import { useloginUserInfoStore } from '../stores/loginUserInfoStore';
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router'
const loginUserInfoStore = useloginUserInfoStore()
const { friendList,account, photo } = storeToRefs(loginUserInfoStore)
</script>

<style lang="scss" scoped>
.body {
    padding-top: 5vh;
    display: flex;
    flex-wrap: nowrap;
    height: 100vh;
    width: 100%;
    background-color: #91969f;
}

.flex-container {
    // margin-top: 5vh;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: stretch;
    margin-left: 5%;
    height: 90vh;
    width: 90%;
    background-color: #323540;
    border-radius: 15px;

    .nav-menu-list {
        height: 100%;
        width: 9%;
        // background-color: #fff;
        // background-color: #1f87e7;
        // overflow: hidden;
    }

    .nav-chat-list {
        width: 24%;
        height: 100%;
        background-color: #fff;
    }

    .chat-interface {
        width: 67%;
        height: 100%;
    }
}
</style>