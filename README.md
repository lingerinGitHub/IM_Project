这是一个即时通讯系统，拥有完整的前后端（vue3+koa2），功能如下：
1.登录登出
2.注册（暂不开放注册接口）
3.聊天
4.添加/删除好友

技术栈：
前端：vite,vue3,pinia,axios,socketio等
后端：koa2,mysql,redis,log4js等

聊天记录可以在后端保存7天（可调整），具有顶号的设置，使用token进行身份认证，session跟踪用户，后端有对接口权限验证的中间件，跨域设置，界面是响应式样式配置电脑端（手机端暂未适配样式）

项目演示地址：www.greenworld.icu
游客账号：visitor
游客密码：visitor
如果浏览过程中返回到login页面，说明被顶号了hh

admin\user1是我的账号，欢迎与我畅聊！

ps：还没设置登出（懒），退出登录访问www.greenworld.icu/login即可

祝大家玩的开心~
