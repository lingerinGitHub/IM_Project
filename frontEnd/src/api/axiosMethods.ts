import { resBody } from '../class/resBody';
import axiosInstance from '../utils/axiosInterceptorConfig';

interface responseBody {
    status:number,
    data: any
}
//输入参数：请求类型，url地址，数据，返回json{status,data}
export async function axiosPost(type:string, url:string, data:object): Promise<responseBody> {

    const resbody = new resBody(type, data)
    return await axiosInstance.axiosInstance.post(url, { data: resbody.getData() },
        {
            headers: {
                "Content-Type": resbody.getType(),
            },
            withCredentials: true //需要cookie
        })
        .then((response) => {
            // logger.debug(response)
            const successBody = {
                'status': response.status,
                'data': response.data
            }
            // logger.debug(successBody)
            return successBody
        })
        .catch((err) => {
            const errBody = {
                'status': err.response.status,
                'data': err.response.data.data
            }
            // console.log(errBody)
            // logger.error(errBody)
            return errBody
        })
}


//输入参数：请求类型，url地址，返回json{status,data}
export async function axiosGet(type:string, url:string): Promise<any> {
    const resbody = new resBody(type)
    return await axiosInstance.axiosInstance.get(url,
        {
            headers: {
                "Content-Type": resbody.getType(),
            },
            withCredentials: true //需要cookie
        })
        .then((response) => {
            const successBody = {
                'status': response.status,
                'data': response.data
            }
            return successBody
        })
        .catch((err) => {
            console.log(err.response.data)
            const errBody = {
                'status': err.response.status,
                'data': err.response.data.data
            }
            console.log(errBody)
            return errBody
        })
}