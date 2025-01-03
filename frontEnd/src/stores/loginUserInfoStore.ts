
import { defineStore } from "pinia"
import { serverpath } from "../config/serverPath";


interface friendChatInfo {
    timeStamp: string,
    oldestTimeStamp: string,
    newestTimeStamp: string,
    ifMore: boolean
}

class friendChatTnfoConstroctor implements friendChatInfo {
    public timeStamp: string;
    public oldestTimeStamp: string;
    public newestTimeStamp: string;
    public ifMore: boolean;
    constructor(timeStamp: string, oldestTimeStamp:string, newestTimeStamp:string, ifMore:boolean){
        this.timeStamp = timeStamp;
        this.newestTimeStamp = newestTimeStamp;
        this.oldestTimeStamp = oldestTimeStamp;
        this.ifMore = ifMore;
    }
}

interface friend {
    id: number,
    username: string,
    province: string,
    city: string,
    photo: string,
    updated_at: string,
    chatInfo?: friendChatTnfoConstroctor //将最新一条聊天记录保存在此
};

export const useloginUserInfoStore = defineStore('useloginUserInfoStore', {
    state: () => {
        return {
            Latest_time: undefined as unknown as string,
            // 登录用户信息
            id: undefined as unknown as number,
            email: String(''),
            photo: String(''),
            name: String(''),
            province: String(''),
            city: String(''),
            socketID: String(''),
            create_at: String(''),
            update_at: String(''),
            token: String(''),
            wsConnectTimeStamp: String(''),
            friendList: [] as friend[],// 初始化为空数组，并明确指定类型为 Friend[]
            last_update: String('')
        }
    },

    actions: {
        saveToken() {
            try {
                if (this.token != undefined) {
                    localStorage.setItem('token', this.token)
                    return true;
                }
                console.error('token为空无法保存')
            } catch {
                console.log('token保存失败')
                return false;
            }
        },
        setId(id: number) {
            this.id = id;
        },
        setemail(email: string) {
            this.email = email;
        },
        setName(name: string) {
            this.name = name;
        },
        setPhoto(photo: string) {
            this.photo = (`${serverpath}/static?name=${photo}`);
        },
        setProvince(province: string) {
            this.province = province;
        },
        setCity(city: string) {
            this.city = city;
        },
        setSocketID(socketID: string) {
            this.socketID = socketID;
        },
        setCreateAt(create_at: string) {
            this.create_at = create_at;
        },
        setUpdateAt(update_at: string) {
            this.update_at = update_at;
        },
        setToken(token: string) {
            this.token = token;
        },
        setWsConnectTimeStamp(wsConnectTimeStamp: string) {
            this.wsConnectTimeStamp = wsConnectTimeStamp;
        },
    },
    // persist: true,
})