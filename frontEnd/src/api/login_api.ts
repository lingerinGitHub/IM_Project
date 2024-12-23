
import { axiosPost } from './axiosMethods.ts';
import { useloginUserInfoStore } from '../stores/loginUserInfoStore.ts';
import { useSocket_api_store } from '../stores/socket.ts';
import { usechatInfoStore } from '../stores/chatInfoStore.ts';
import { Logger } from 'tslog';
import { serverpath } from '../config/serverPath.ts';

// import { storeToRefs } from 'pinia'
const logger = new Logger({ name: 'login_api' })
// 使用token登录，必须同时具有cookie，token

//常规的账号密码登录,data是放在body里面的
async function login_api(type: string, data: object): Promise<object> {

    const socket_api_store = useSocket_api_store()
    if (socket_api_store.socketID != undefined) {
        return {
            status: 0,
            data: '请重复登录!'
        }
    }
    const logger = new Logger({ name: 'login_api' })
    const loginUserInfoStore = useloginUserInfoStore()

    const resbody = await axiosPost(type, `${serverpath}/users/login`, data)
    //处理登录逻辑
    logger.info(resbody)
    if (resbody.status == 200) {
        loginUserInfoStore.setId(resbody.data.id);
        loginUserInfoStore.setToken(resbody.data.token);
        loginUserInfoStore.setCity(resbody.data.city);
        loginUserInfoStore.setemail(resbody.data.email);
        loginUserInfoStore.setProvince(resbody.data.province);
        loginUserInfoStore.setPhoto(resbody.data.photo);
        loginUserInfoStore.setCreateAt(resbody.data.created_at);
        loginUserInfoStore.setUpdateAt(resbody.data.updated_at);
        loginUserInfoStore.setName(resbody.data.username)
        //获取用户好友列表
        logger.info(loginUserInfoStore.id)
        const friendListresbody = await getFriendList({
            id: loginUserInfoStore.id,
            timeStamp: undefined // 先不填数据
        })
        if (friendListresbody.status != 200) {
            alert('error')
            return {
                status: 0,
                data: '出现不可抗错误'
            }
        }
        loginUserInfoStore.friendList = friendListresbody.data.friendList

        //开始升级请求
        socket_api_store.wsConnection(loginUserInfoStore.id as number, loginUserInfoStore.token as string)

        //获取历史消息
        socket_api_store.B2BGetHistory(friendListresbody.data.friendList)
    }
    return resbody;
}


async function tokenLogin_api(token: string): Promise<boolean> {
    const resbody = await axiosPost('json', `${serverpath}/users/tokenSessionLogin`, { token: token })
    const socket_api_store = useSocket_api_store()
    const loginUserInfoStore = useloginUserInfoStore()

    if (resbody.status != 200) {
        // 退出登录并删除缓存
        logout()
        return false
    } else {
        loginUserInfoStore.setId(resbody.data.id);
        loginUserInfoStore.setToken(resbody.data.token);
        loginUserInfoStore.setCity(resbody.data.city);
        loginUserInfoStore.setemail(resbody.data.email);
        loginUserInfoStore.setProvince(resbody.data.province);
        loginUserInfoStore.setPhoto(resbody.data.photo);
        loginUserInfoStore.setCreateAt(resbody.data.created_at);
        loginUserInfoStore.setUpdateAt(resbody.data.updated_at);
        loginUserInfoStore.setName(resbody.data.username)

        //获取用户好友列表
        logger.info(loginUserInfoStore.id)
        const friendListresbody = await getFriendList({
            id: loginUserInfoStore.id,
            timeStamp: undefined // 先不填数据
        })
        if (friendListresbody.status != 200) {
            return false
        }
        loginUserInfoStore.friendList = friendListresbody.data.friendList

        //开始升级请求
        socket_api_store.wsConnection(loginUserInfoStore.id as number, loginUserInfoStore.token as string)

        //获取历史消息
        await socket_api_store.B2BGetHistory(friendListresbody.data.friendList)
            .then(() => {
                return true
            })
        
        return true
    }
}

async function getFriendList(data: object) {
    const friendList = await axiosPost('json', `${serverpath}/users/getFriendList`, data)
    logger.info(friendList.data.friendList)
    return friendList;
}

// 登出系统，删除pinia,浏览器中所有数据
function logout() {
    // 重置pinia中数据
    useloginUserInfoStore().$reset()
    useSocket_api_store().$reset()
    usechatInfoStore().$reset()
    // 删除token
    localStorage.removeItem('token')
}

export { login_api, tokenLogin_api, logout };
