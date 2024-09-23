import axios from 'axios'; //引入axios
import { InternalAxiosRequestConfig } from 'axios';
import moment from 'moment';
moment.locale('zh-cn');//设置时区

//创建axios实例
let axiosInstance = axios.create({
    timeout: moment.now() //请求时间
})

//返回本地存放token
function getToken() {
    return localStorage.getItem('token');
}

// 在相应之前中断系统操作
let loadingInstance = null;//先声明变量，防止报错

// 这个接口是用来规范请求的格式，type是区分请求类型，loading是是否需要loading
// const config: CustomAxiosRequestConfig = {
//     url: 'https://api.example.com/data',
//     method: 'GET',
//     type: 'customType', // 添加自定义属性
//   };
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    type: string;
}


//request拦截器
axiosInstance.interceptors.request.use(
    (config: any) => {
        // if (getToken()) {
        //     config.headers['Authorization'] = getToken() //让每个请求携带自定义的token，请根据实际情况自行修改
        // }
		console.log(config)
		console.log('该请求经过了请求拦截器')
        // config.headers['Content-Type'] = 'application/json'这里默认type为json了
        //这个headers头部的Content-Type：一般都是application/json,但是也有部分接口需要传递的是formData格式的，此时就需要用到qs，为了做区分，在config参数中添加一个type变量来进行判断处理
        if (config.type && config.type == 'form') {
            config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
            if (config.data) {
                config.data = JSON.stringify(config.data);//转换为json格式发送
            }
        }
        if (config.loading) {
            // loadingInstance = Loading.service({ fullscreen: true })需要等待返回值的时候
        }
		console.log(config)
        return config
		
    },
    error => {
        console.log(error);
        Promise.reject(error);
    }
)


//response拦截器
axiosInstance.interceptors.response.use(
	(response: any) =>{
        console.log('该响应经过了响应拦截器')
		const code = response.status
		if(code<200 ||code>300){
			// Notification.error({
			// 	title:response.message	
			// })
			if(loadingInstance){
				// loadingInstance.close();
			}
			return Promise.reject('error')
		}else{
			if(loadingInstance){
				// loadingInstance.close();
			}
			//如果相应无异常,则检查是否需要保存token
			if(response.data && response.data.data.token){
				console.log('response.data.data.token: '+response.data.data.token)
				localStorage.setItem('token',response.data.data.token);
			}
			return response.data
		}
	},
	error =>{
		let code = 0
		try{
			code = error.response.data.status
		}catch(e){
			if(error.toString().indexOf('Error:timeout') !==-1){
				// Notification.error({
				// 	title:"网络请求超时",
				// 	duration:5000
				// })
				return Promise.reject(error)
			}
		}
		if(code){
			if(code==401){
				// MessageBox.confirm(
				// 	'登录状态已过期，您可以继续留在该页面，或者重新登录',
				// 	'系统提示',
				// 	{
				// 		confirmButtonText:'重新登录'，
				// 		cancelButtonText:'取消',
				// 		type:'warning'
				// 	}	
				// ).then(()=>{
				// 	store.dispatch('Login').then(()=>{
				// 		location.reload();//为了重新实例化vue-router对象
				// 	})
				// })
			}else if(code==405){
				// router.push({path:'/401'})
			}else{
				const errorMsg = error.response.data.message
				if(errorMsg !== undefined){
					// Notification.error({
					// 	title:errorMsg,
					// 	duration:5000
					// })
				}
			}
		}else{
			// Notification.error({
			// 	title:'接口请求失败',
			// 	duration:5000
			// })
		}
		return Promise.reject(error)
	}
)


// 导出这个配置好的实例
export default {
    axiosInstance,
}
