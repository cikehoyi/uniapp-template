import Request from './request'
import apiList from './api'


/*
请求函数调用
api('ex1').then((res)=>{})
api('ex2.ex21',data).then((res)=>{})
*/
export default function api(url, data = {}) {
	const request = new Request();
	let api = JSON.parse(JSON.stringify(getApiObj(url)));
	request.interceptor.request((config, cancel) => { /* 请求之前拦截器 */
	
		/*
			api为自定义对象，可自定义属性进行其余操作
			如token等
			if(api.token){
				config.header.token = uni.getStorageSync('token').token || ''
			}
		*/
	    if(api.json){
			config.header['Content-Type'] = 'application/json'
	    }

		
	    // if(api.token){
		// 	config.data.token = uni.getStorageSync('user_token') || ''
	    // }
		return config
	});

	request.interceptor.response((response) => { /* 请求之后拦截器 */
		// if (response.data.code === 0) { // 服务端返回的状态码不等于200，则reject()
		// 	uni.showToast({
		// 		title: response.data.msg || '请求出错,稍后重试',
		// 		icon: 'none',
		// 		duration: 1000,
		// 		mask: true
		// 	});
		// }

		// if (response.data.code === 401) { // 服务端返回的状态码不等于200，则reject()
			
		// }
		
		return response
	}, (response) => { // 预留可以日志上报
		return response
	})

	//url处理，路径需提前处理好
	if(api.params){
		if(data && typeof data === 'object'){
			for(let i in data){
				api.url += `/${i}/${data[i]}`
			}
			data = {}
		}
	}

	return request.request({
		url: api.url,
		data,
		method: api.method,
	})

}

function getApiObj(url) {
	let apiArray = url.split(".");
	let api = apiList;
	apiArray.forEach(v => {
		api = api[v];
	});
	return api;
}
