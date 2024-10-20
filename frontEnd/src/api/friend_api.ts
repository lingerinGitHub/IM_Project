import { serverpath } from '../config/serverPath.ts';
import { axiosPost } from './axiosMethods.ts';


async function addFriend_api(userid:number, friendid:number){
    const result = await axiosPost('json', `http://${serverpath}/friend/add`, { "userid":userid,"friendid":friendid })
    return result
}

async function searchFriend_api(userid:number, friendname:string) {
    const result = await axiosPost('json', `http://${serverpath}/friend/search`, { "userid":userid,"friendname":friendname })
    return result.data
}

async function accept_api(userid:number, friendid:number){
    const result = await axiosPost('json', `http://${serverpath}/friend/statusUpdate`, { "userid":userid,"friendid":friendid, "status":"accepted" })
    return result.data
}

async function reject_api(userid:number, friendid:number){
    const result = await axiosPost('json', `http://${serverpath}/friend/statusUpdate`, { "userid":userid,"friendid":friendid, "status":"rejected" })
    return result.data
}

async function delete_api(userid:number, friendid:number){
    const result = await axiosPost('json', `http://${serverpath}/friend/statusUpdate`, { "userid":userid,"friendid":friendid, "status":"deleted" })
    return result.data
}

export {
    addFriend_api,
    searchFriend_api,
    accept_api,
    reject_api,
    delete_api
}