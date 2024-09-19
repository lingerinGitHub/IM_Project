
import { ref } from 'vue';
import axiosInstance from '../utils/axiosInterceptorConfig.ts';
import { resBody } from '../class/resBody.ts';
import socket from 'socket.io-client';
import { axiosPost } from './axiosMethods.ts';


export async function login_api(type: string, data: object): Promise<object> {
    // const resbody = new resBody(type, data)
    console.log(data)
        // console.log(`resbodydata: ${JSON.stringify(resbody.getData())}`)
    return axiosPost(type,'http://localhost:8000/login',data)
}

export async function testClass(type: string) {
    const requestbody = new resBody('json')

}