/**
 * 接口列表文件
*/
export default {

	/** 例子 **/
	ex1: {
		url: 'test',
		method: 'GET',
		token: false,//自定义属性，是否传token
		json: true, //参数是否为json对象，修改 header 'content-type': 'application/json'
		params:true,//参数将以 /paramsName/{paramsValue} 传递
		// desc: '例子1',
	},
	ex2:{
		ex21:{
			url: 'test',
			method: 'GET',
			token: false,
			// desc: '例子2',
		}
	},
	
	
};
