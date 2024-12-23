<template>
    <div class="info-container">
        <div class="photo">
            <el-image style="width: 100%; height: 100%" :src="photourl" fit="cover" />
        </div>
        <div class="input email-container">
            <el-input class="email" v-model="userinfo.email" style="width: 80%"
                placeholder="Please input email" />
        </div>
        <div class="input password-container">
            <el-input class="password" v-model="userinfo.password" style="width: 80%" type="password"
                placeholder="Please input password" show-password />
        </div>
        <div class="function-button">
            <span class="register">
                <el-button class="button-left" type="info" round>注册</el-button>
            </span>
            <span class="signin">
                <el-button class="button-right" type="primary" round
                    @Click="login(userinfo.email, userinfo.password)">登录</el-button>
            </span>
        </div>
    </div>
    <div class="image-container">
        <el-image style="width: 120%; height: 120%; margin: 5,5,5,5%;" :src="url" fit="cover" />
    </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import { login_api } from '../api/login_api.ts'
import { ElNotification, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router';
// import jigsaw from '../utils/jigsaw.js';
const router = useRouter()//路由实例化
const photourl = ref('../../public/壁纸_compressed.JPG');
const url = ref('../../public/壁纸_compressed.JPG');


interface userinfo {
    email: string,
    password: string
}

//绑定组件
const userinfo = reactive({
    email: '',
    password: ''
});

async function login(username: string, password: string) {

    if (username != '' && password != '') {
        const userinfo: userinfo = {
            email: username,
            password: password
        }
        const result: any = await login_api('json', userinfo) || null;
        switch (result.status) {
            case 200:
                openFullScreen2()
                ElNotification({
                    title: 'Success',
                    message: `登录成功啦,${result.data.email}牢弟`,
                    type: 'success',
                    duration: 2500,
                    offset: 50,
                })
                userinfo.email = '';
                userinfo.password = '';
                router.push({ path: '/chat' })
                break;
            case 401:
                ElNotification({
                    title: 'Error',
                    message: '牢弟,账号密码错啦',
                    type: 'error',
                    duration: 2500,
                    offset: 50,
                });
                break;
            case 429:
                ElNotification({
                    title: 'Error',
                    message: '牢弟,访问次数太多了',
                    type: 'error',
                    duration: 2500,
                    offset: 50,
                });
                break;
            case 0:
                ElNotification({
                    title: 'Error',
                    message: `请勿重复登陆, 牢弟！`,
                    type: 'error',
                    duration: 2500,
                    offset: 50,
                });
                break;
            default:
                ElNotification({
                    title: 'Error',
                    message: '出错了',
                    type: 'error',
                    duration: 2500,
                    offset: 50,
                });
                break;
        }
    } else {
        ElNotification({
            title: 'Warning',
            message: '牢弟,你需要确认账号密码的正确输入',
            type: 'warning',
            duration: 2500,
            offset: 50,
        })
    }
}

//遮罩
const openFullScreen2 = () => {
    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })
    loading.close()

}

</script>

<style lang="scss" scoped>
.image-container {
    height: 100vh;
    width: 100%;
    min-width: 80%;
    min-height: 80%;
    filter: blur(7px) brightness(100%) contrast(100%) opacity(100%);
    box-sizing: border-box;
    overflow: hidden;
}

.info-container {
    display: grid;
    grid-template-rows: repeat(4, minmax(80px, 1fr));
    place-items: center;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    /* 居中定位 */
    width: 38%;
    /* 示例宽度 */
    height: 55%;
    /* 示例高度 */
    // background-color: lightblue; /* 示例背景色 */
    border-radius: 30px;
    min-width: 250px;
    min-height: 350px;
    z-index: 100;
    /* 确保它位于其他元素之上 */
    backdrop-filter: blur(20px) brightness(95%) contrast(80%) opacity(100%);
    box-shadow: 10px 10px 5px -4px rgba(0, 0, 0, 0.4);

    .photo {
        margin-top: 70px;
        width: 140px;
        height: 140px;
        background-color: #fff;
        box-shadow: 6px 6px 12px -3px rgba(0, 0, 0, 0.3);
    }

    .input {
        display: flex;
        justify-content: center;
        height: 50%;
        width: 100%;
    }

    .input:nth-child(2) {
        margin-top: 100px;
    }

    .input:nth-child(3) {
        margin-top: 80px;
    }

    .function-button {
        margin-top: 25px;
        width: 75%;
        height: 42%;
        // background-color: #fff;

        .button-left {
            width: 23%;
            height: 100%;
            float: left;
        }

        .button-right {
            width: 23%;
            height: 100%;
            float: right;
        }

        :deep .el-button {
            border-radius: 14px;
        }
    }

    ::v-deep .el-input:first-child {
        border-radius: 18px;
        height: 100%;
        width: 80%;
        padding-left: 16px;
        padding-right: 16px;
        background-color: rgba(188, 188, 188, 0.4);
        box-shadow: 10px 10px 5px -4px rgba(0, 0, 0, 0.15);
        // color: #fff;
        font-size: 18px;


    }

    ::v-deep .el-input__inner {

        
        &::placeholder {
            // color: rgba(247, 251, 255, 0.80);
            color: rgba(71, 71, 71, 0.55);
            font-size: 15px;
            font-weight: 500;
        }
    }

    ::v-deep .el-input__suffix-inner {

        .el-input__icon{
            padding-right: -10%;
            color: #606366;
        }
    }







    ::v-deep .el-input__wrapper {
        background-color: transparent;
        // border: 0;
        // border-left: 20px ;
        box-shadow: 0 0 0 0;
    }

    // :deep .el-input--suffix.password {
    //     background-color: transparent;
    //     // border: 0;
    //     // border-left: 20px ;
    //     box-shadow: 0 0 0 0;
    // }
}
</style>