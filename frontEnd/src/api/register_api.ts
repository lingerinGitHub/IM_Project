import { axiosPost } from './axiosMethods.ts';
import { resBody } from '../class/resBody';
import { serverpath } from '../config/serverPath.ts';

interface registerData {
    username:string,
    password:string,
    email:string
}
async function register_api(data:registerData): Promise<object>{
    const resbody = new resBody('json',data)
    const result =  await axiosPost(resbody.type as string, `${serverpath}/users/register`, resbody.data)
    return result
}

export {
    register_api
}