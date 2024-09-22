import { createRouter, createWebHistory } from 'vue-router'
import chatInterface from '../components/chat-components/chatInterface.vue';
import { useloginUserInfoStore } from '../stores/loginUserInfoStore';
import { login_api, tokenLogin_api } from '../api/login_api.ts'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/login',
            name: 'login',
            component: () => import('../views/login.vue')
        },
        {
            path: '/chat',
            name: 'chat',
            component: () => import('../views/chat.vue'),
            children: [
                {
                    path: '/:id',
                    component: chatInterface,
                    props: true // 将路由参数作为 props 传递给 UserDetails 组件
                }
            ]
        },
        {
            path: '/dragTest',
            name: 'dragTest',
            component: () => import('../views/dragTest.vue')
        }
    ]
})

//全局前置路由守卫————初始化的时候被调用、每次路由切换之前被调用
//每次跳转都应该检查id是否在好友列表内
router.beforeEach(async (to, from) => {

    console.log(from.path)
    console.log(to.path)

    if (to.path == '/') {
        // 自动登录
        const token = localStorage.getItem('token')
        var autoLogin: boolean = false
        if (token != undefined || token != null) {
            // 调用自动登录api
            autoLogin = await tokenLogin_api(token)
            //返回true表示登录完毕
            console.log(autoLogin)
            if(autoLogin == true) {
                router.push({ path: '/chat' })
                return
            }
        }
        router.push({ path: '/login' })
    }

    // 刷新页面重新从服务器获取数据
    if(to.path.slice(0, 5) == '/chat' && useloginUserInfoStore().id == undefined){
        // 自动登录
        const token = localStorage.getItem('token')
        var autoLogin: boolean = false
        if (token != undefined || token != null) {
            // 调用自动登录api
            autoLogin = await tokenLogin_api(token)
            //返回true表示登录完毕
            console.log(autoLogin)
            if(autoLogin == true) {
                router.push({ path: '/chat' })
                return
            }
        }
        router.push({ path: '/login' })
    }

    if (to.path != '/login' && useloginUserInfoStore().id == undefined) {
        router.push({ path: '/login' })
    }

    // 判断好友是否在好友列表,禁止非法访问
    if (from.path != '/login' && from.path != '/' && to.path.slice(0, 5) == '/chat') {
        console.log('判断好友是否在好友列表')
        const loginUserInfoStore = useloginUserInfoStore()
        try {
            const ifExist = loginUserInfoStore.friendList.findIndex(function (item, index) {
                console.log(item.id)
                return item.id == Number(to.path.slice(10))
            })
            if (ifExist == -1) {
                // 返回上一级页面
                return { path: from.path }
            }
        } catch {
            // 返回上一级页面
            return { path: from.path }
        }
    }
})

//以es6模块的方式导出router
export default router;

