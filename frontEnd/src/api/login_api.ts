
import { axiosGet, axiosPost } from './axiosMethods.ts';
import { useloginUserInfoStore } from '../stores/loginUserInfoStore.ts';
import { useSocket_api_store } from '../stores/socket.ts';
import { Logger } from 'tslog';
// import { storeToRefs } from 'pinia'
const logger = new Logger({name:'login_api'})
// 使用token登录，必须同时具有cookie，token

//常规的账号密码登录,data是放在body里面的
export async function login_api(type: string, data: object): Promise<object> {
    const socket_api_store = useSocket_api_store()
    if(socket_api_store.socketID != undefined) {
        return {
            status: 0,
            data: '请勿重复登录!'
        }
    }
    const logger = new Logger({name: 'login_api'})
    const loginUserInfoStore = useloginUserInfoStore()

    const resbody = await axiosPost(type,'http://localhost:8000/login',data)
    //处理登录逻辑
    logger.info(resbody)
    if(resbody.status == 200){
        loginUserInfoStore.setId(resbody.data.id);
        loginUserInfoStore.setToken(resbody.data.token);
        loginUserInfoStore.setCity(resbody.data.city);
        loginUserInfoStore.setAccount(resbody.data.account);
        loginUserInfoStore.setProvince(resbody.data.province);
        loginUserInfoStore.setPhoto(resbody.data.photo);
        loginUserInfoStore.setCreateAt(resbody.data.created_at);
        loginUserInfoStore.setUpdateAt(resbody.data.updated_at);

        //获取用户好友列表
        logger.info(loginUserInfoStore.id)
        const friendListresbody = await getFriendList({
            id: loginUserInfoStore.id,
            timeStamp: undefined // 先不填数据
        })
        if(friendListresbody.status != 200) {
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

async function getFriendList(data:object) {
    const friendList = await axiosPost('json', 'http://localhost:8000/getFriendList', data)
    logger.info(friendList.data.friendList)
    return friendList;
}
