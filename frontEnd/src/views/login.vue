<template>
    <div class="view-container">
        <div class="info-container">
            <div class="photo">
                <el-image style="width: 100%; height: 100%" :src="photourl" fit="cover" />
            </div>
            <div class="input email-container">
                <el-input class="email" v-model="userinfo.email" style="width: 80%" placeholder="Please input email" />
            </div>
            <div class="input password-container">
                <el-input class="password" v-model="userinfo.password" style="width: 80%" type="password"
                    placeholder="Please input password" show-password />
            </div>
            <div class="function-button">
                <span class="register">
                    <el-button class="button-left" type="info" @click="spin" round>注册</el-button>
                </span>
                <span class="signin">
                    <el-button class="button-right" type="primary" round
                        @Click="login(userinfo.email, userinfo.password)">登录</el-button>
                </span>
            </div>
        </div>
        <div class="register-container">
            <div class="item title">
                <h1>Registration</h1>
            </div>
            <div class="item username">
                <el-input class="username" v-model="regUsername" style="width: 80%" placeholder="Username" />
            </div>
            <div class="item email">
                <el-input class="email" v-model="regEmail" style="width: 80%" placeholder="Email" />
            </div>
            <div class="item password">
                <el-input class="password" v-model="regPassword" style="width: 80%" placeholder="Password"
                    show-password />
            </div>
            <div class="item condition">
                <el-radio-group v-model="radio1">
                    <el-radio value="1" text-color="#ffffff">
                        <h3 style="">I agree to the terms & conditions</h3>
                    </el-radio>
                </el-radio-group>

            </div>
            <div class="item register-btn">
                <el-button class="button" type="primary" @click="register" round>注册</el-button>
            </div>
            <div class="item mention">
                <button @click="spin">
                    <h5>Already have an account? Login</h5>
                </button>
            </div>
        </div>
    </div>
    <div class="image-container">
        <el-image style="width: 120%; height: 120%; margin: 5,5,5,5%;" :src="url" fit="cover" />
    </div>
    <el-dialog v-model="dialogVisible" title="" width="340" :show-close="false" top="33vh">
        <div class="container" id="container">
            <div id="captcha"></div>
            <div id="msg"></div>
        </div>
        <template #footer>

        </template>
    </el-dialog>
</template>

<script lang="ts" setup>
import { nextTick, reactive, ref } from 'vue';
import { login_api } from '../api/login_api.ts'
import { ElNotification, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router';
import jigsaw from '../utils/jigsaw.js';
import { isValidUsername, isValidEmail, isValidPassword } from '../utils/stringVerify.ts'
import { register_api } from '../api/register_api.ts'

const router = useRouter()//路由实例化
const photourl = ref('../../public/壁纸_compressed.JPG');
const url = ref('../../public/壁纸_compressed.JPG');

const regUsername = ref<string>('')
const regEmail = ref<string>('')
const regPassword = ref<string>('')
const dialogVisible = ref<boolean>(false)

interface registerData {
    username:string,
    password:string,
    email:string
}

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
                    message: `登录成功啦,${result.data.username}牢弟`,
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

const radio1 = ref<number>(0)

async function register() {
    const nameResult = isValidUsername(regUsername.value)
    const emailResult = isValidEmail(regEmail.value)
    const passwordResult = isValidPassword(regPassword.value)

    if (!nameResult.result) {
        notificationEmits(notificationType.warning, '警告',nameResult.message)
    } else if (!emailResult.result) {
        notificationEmits(notificationType.warning, '警告',emailResult.message)
    } else if (!passwordResult.result) {
        notificationEmits(notificationType.warning, '警告',passwordResult.message)
    } else if (radio1.value == 0) {
        notificationEmits(notificationType.warning, '警告','牢弟,你需要阅读并同意相关条款')
    } else {
        // 登录在图片验证码内
        picVerify()
    }

}

var pic = false

async function picVerify() {
    dialogVisible.value = !dialogVisible.value
    if (pic == false) {
        await nextTick();//等待dom渲染完成
        jigsaw.init({
            el: document.getElementById('captcha'),
            onSuccess: function () {
                setTimeout(() => {
                    // document.getElementById('msg').innerHTML = '验证成功！'
                    dialogVisible.value = !dialogVisible.value
                    const loading = ElLoading.service({
                        lock: true,
                        text: 'Registering',
                        background: 'rgba(0, 0, 0, 0.7)',
                    })
                    verifySuccess(loading)
                }, 1500)
            },
            onFail: cleanMsg,
            onRefresh: cleanMsg
        })
    }
    pic = true
    function cleanMsg() {
        //   document.getElementById('msg').innerHTML = ''
        // alert('验证失败')
    }
}

async function verifySuccess(loading:any) {
    //调用接口发起请求
    const registerData:registerData = {
        username: regUsername.value,
        password: regPassword.value,
        email: regEmail.value
    }
    const response:any = await register_api(registerData)
    if(response.status != 200){
        loading.close();
        notificationEmits(notificationType.error,'错误','该邮箱已注册')
    } else {
        loading.close();
        regUsername.value = '';
        regPassword.value = '';
        regEmail.value = '';
        radio1.value = 0;
        notificationEmits(notificationType.success,'成功了','快去登录吧!')
        spin() //翻转回去登录面
    }

}

enum notificationType {
    success = 'success',
    warning = 'warning',
    info = 'info',
    error = 'error'
}
function notificationEmits(type:notificationType, title:string, message:string){
    ElNotification({
        title: title,
        message: message,
        type: type,
        duration: 2500,
        offset: 50,
    })
}

var ifSpan = false;
function spin() {

    var container: any = document.querySelector('.view-container')
    if (ifSpan == false) {
        container.classList.add('spin')
        ifSpan = true;
        return
    }
    container.classList.remove('spin')
    ifSpan = false

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

.view-container {
    position: fixed;
    margin: 0 auto;
    width: 100%;
    height: 100vh;
    z-index: 999;
    // background-color: pink;
    transform-style: preserve-3d;
    // perspective: 1000px;
    transition: transform 2s;

    // &:hover {
    //     transform: rotate3d(0, 1, 0, 180deg);
    // }

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
        backface-visibility: hidden;

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

            .el-input__icon {
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

    }


    .register-container {
        margin: auto;
        display: flex;
        flex-direction: column;
        justify-items: center;
        column-gap: 2%;
        margin-top: 9%;
        height: 65vh;
        width: 30%;
        border-radius: 30px;
        transform: translateZ(0px) rotateY(180deg);
        backface-visibility: hidden;
        backdrop-filter: blur(20px) brightness(95%) contrast(80%) opacity(100%);
        box-shadow: 10px 10px 5px -4px rgba(0, 0, 0, 0.4);

        .item {
            height: 15%;
            display: flex;
            justify-content: center;
            align-items: center;


            // background-color: pink;
            ::v-deep .el-input:first-child {
                border-radius: 18px;
                height: 65%;
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

                .el-input__icon {
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
        }

        .title {
            height: 25%;
            font-size: xx-large;
            font-weight: 700;
            margin-bottom: -4%;
            color: #d6bc90;
        }

        .condition {
            height: 8%;
            // background-color: #fff;
        }

        .register-btn {

            .button {
                height: 60%;
                width: 80%;
            }
        }

        .mention {
            height: 8%;
            color: #5d5c5c;

            &:hover {
                color: #242424;
            }
        }

    }

}

.spin {
    transform: rotate3d(0, 1, 0, 180deg);
}
</style>

<!-- 图片验证码所用的css样式 -->
<style>
.block {
    position: absolute;
    left: 0;
    top: 0;
    cursor: pointer;
    cursor: grab;
}

.block:active {
    cursor: grabbing;
}

.sliderContainer {
    position: relative;
    text-align: center;
    width: 310px;
    height: 40px;
    line-height: 40px;
    margin-top: 15px;
    background: #f7f9fa;
    color: #45494c;
    border: 1px solid #e4e7eb;
}

.sliderContainer_active .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #1991FA;
}

.sliderContainer_active .sliderMask {
    height: 38px;
    border-width: 1px;
}

.sliderContainer_success .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #52CCBA;
    background-color: #52CCBA !important;
}

.sliderContainer_success .sliderMask {
    height: 38px;
    border: 1px solid #52CCBA;
    background-color: #D2F4EF;
}

.sliderContainer_success .sliderIcon {
    background-position: 0 -26px !important;
}

.sliderContainer_fail .slider {
    height: 38px;
    top: -1px;
    border: 1px solid #f57a7a;
    background-color: #f57a7a !important;
}

.sliderContainer_fail .sliderMask {
    height: 38px;
    border: 1px solid #f57a7a;
    background-color: #fce1e1;
}

.sliderContainer_fail .sliderIcon {
    top: 14px;
    background-position: 0 -82px !important;
}

.sliderContainer_active .sliderText,
.sliderContainer_success .sliderText,
.sliderContainer_fail .sliderText {
    display: none;
}

.sliderMask {
    position: absolute;
    left: 0;
    top: 0;
    height: 40px;
    border: 0 solid #1991FA;
    background: #D1E9FE;
}

.slider {
    position: absolute;
    top: 0;
    left: 0;
    width: 40px;
    height: 40px;
    background: #fff;
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.3);
    transition: background .2s linear;
    cursor: pointer;
    cursor: grab;
}

.slider:active {
    cursor: grabbing;
}

.slider:hover {
    background: #1991FA;
}

.sliderIcon {
    position: absolute;
    top: 15px;
    left: 13px;
    width: 14px;
    height: 12px;
    background: url(https://cstaticdun.126.net//2.13.6/images/icon_light.4353d81.png) 0 -13px;
    background-size: 32px 544px;
}

.slider:hover .sliderIcon {
    background-position: 0 0;
}

.refreshIcon {
    position: absolute;
    right: 5px;
    top: 5px;
    width: 30px;
    height: 30px;
    cursor: pointer;
    background: url(https://cstaticdun.126.net//2.13.6/images/icon_light.4353d81.png) 0 -233px;
    background-size: 32px 544px;
}

.refreshIcon:hover {
    background-position: 0 -266px;
}

.loadingContainer {
    position: absolute;
    left: 0;
    top: 0;
    width: 310px;
    height: 155px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    color: #45494c;
    z-index: 2;
    background: #EDF0F2;
}

.loadingIcon {
    width: 32px;
    height: 32px;
    margin-bottom: 10px;
    background: url(https://cstaticdun.126.net//2.13.6/images/icon_light.4353d81.png) 0 -332px;
    background-size: 32px 544px;
    animation: loading-icon-rotate 0.8s linear infinite;
}

@keyframes loading-icon-rotate {
    from {
        transform: rotate(0)
    }

    to {
        transform: rotate(360deg)
    }
}

.container {
    width: 310px;
}

input {
    display: block;
    width: 290px;
    line-height: 40px;
    margin: 10px 0;
    padding: 0 10px;
    outline: none;
    border: 1px solid #c8cccf;
    border-radius: 4px;
    color: #6a6f77;
}

#msg {
    width: 100%;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
}

a:link,
a:visited,
a:hover,
a:active {
    margin-left: 100px;
    color: #0366D6;
}
</style>