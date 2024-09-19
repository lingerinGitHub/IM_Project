import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import * as echarts from 'echarts'
import 'animate.css/animate.min.css' //引入animate.css
import * as ElementPlusIconsVue from '@element-plus/icons-vue' //引入element-plus图标库
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// main.ts/main.js按需引入组件样式
import "element-plus/theme-chalk/el-loading.css";
import "element-plus/theme-chalk/el-message.css";
import "element-plus/theme-chalk/el-notification.css";
import "element-plus/theme-chalk/el-message-box.css";
import V3Emoji from 'vue3-emoji'


const app = createApp(App)
app.use(V3Emoji)

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

app.use(pinia)

app.use(router)
// 注册为全局组件
// app
//     .component('userinfo', userinfo)


//注册element-plus图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

// 将 echarts 添加到 Vue 的全局属性
app.config.globalProperties.$echarts = echarts;


app.mount('#app')
