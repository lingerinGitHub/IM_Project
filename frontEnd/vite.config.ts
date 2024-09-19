
// vite.config.ts
import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
import vue from '@vitejs/plugin-vue'
import process from 'process'; // 引入process模块



// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    })
  ],
  // server: {
  //   host: '0.0.0.0', // 这个用于启动
  //   port: 8092, // 指定启动端口
  //   open: false //启动后是否自动打开浏览器
  // },
  //全局引入
  css: {
    preprocessorOptions: {
      scss: {
        // 引入 globalVar.scss 这样就可以在全局中使用 globalVar.scss中预定义的变量了
        // 给导入的路径最后加上 ;   
        additionalData: `@import "@/assets/scss/globalVar.scss";`
      }
    }
  },
  // 配置vite模块解析的方式，使得你可以通过模块名字而不是相对路径来引入模块
  resolve: {
    // 设置路径别名
    alias: {
      '@': path.resolve(__dirname,'src'),
      '@public': path.resolve('public'),
      '@img': path.resolve('src/assets/images'),
      '@js': path.resolve('src/assets/scripts'),
      '@css': path.resolve('src/assets/styles')
    }
  }
})
