import { defineStore } from "pinia";
import { serverpath } from "../config/serverPath.ts";
import { axiosPost } from '../api/axiosMethods.ts'


export const usefriendStatusStore = defineStore('usefriendStatusStore', {

    state:() => {
        return {
            friendStatusClassification:{}
        }
    },

    actions: {
        async getFriendStatus(userid:number) {
            
            const friendStatusClassification = await axiosPost('json',`http://${serverpath}/friend/status`, {"userid":userid})
            this.friendStatusClassification = friendStatusClassification.data
            return friendStatusClassification.data

        }
    }

})