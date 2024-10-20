<template>
    <!-- <div v-if="email == ''"><RouterView></RouterView></div> -->
    <div class="body">
        <div class="flex-container">
            <div class="nav-menu-list" style="flex-grow:0">
                <Nav :photoUrl="photo" @getFriendStatus="getFriendStatus"></Nav>
            </div>
            <div class="nav-chat-list" style="flex-grow:0;">
                <!-- <ChatList :friendList="friendList" :email="email" :name="name"></ChatList> -->
                <ActionPanel :friendList="friendList" :email="email" :name="name" :id="id">
                    <template v-slot:panel>
                        <!-- 插槽的内容放这里 -->
                        <keep-alive>
                            <router-view name="actionPanel" :friendList="friendList"
                                :friendStatusClassification="friendStatusClassification" :id="id" @test="test"></router-view>
                        </keep-alive>
                    </template>
                </ActionPanel>
            </div>
            <div class="chat-interface" style="flex-grow:0">
                <keep-alive>
                    <router-view name="chatPage" ></router-view>
                </keep-alive>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Nav from '../components/chat-components/nav.vue';
import ActionPanel from '../components/chat-components/actionPanel.vue';
import { useloginUserInfoStore } from '../stores/loginUserInfoStore';
import { usefriendStatusStore } from '../stores/friendStatusPanel';
import { storeToRefs } from 'pinia';
import { RouterView } from 'vue-router'
const friendStatusStore = usefriendStatusStore()
const loginUserInfoStore = useloginUserInfoStore()
const { friendStatusClassification } = storeToRefs(friendStatusStore)
const { friendList, email, photo, name, id } = storeToRefs(loginUserInfoStore)

async function getFriendStatus() {
    var friendStatusClassification = await friendStatusStore.getFriendStatus(id.value)
    console.log(friendStatusClassification)
}

function test(){
    console.log(' sfgag')
}
</script>

<style lang="scss" scoped>
.body {
    padding-top: 5vh;
    display: flex;
    flex-wrap: nowrap;
    height: 100vh;
    width: 100%;
    background-color: #f5f5f5;
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
        background-color: #323540;
    }

    .chat-interface {
        width: 67%;
        height: 100%;
    }
}
</style>