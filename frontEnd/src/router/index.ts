import { createRouter, createWebHistory } from 'vue-router'
import chatInterface from '../components/chat-components/chatInterface.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
      {
        path: '/',
        name: 'login',
        component: () => import('../views/login.vue')
      },
      {
        path: '/chat',
        name: 'chat',
        component: () => import('../views/chat.vue'),
        children:[
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

//以es6模块的方式导出router
export default router;

