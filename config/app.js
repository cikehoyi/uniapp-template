
//接口域名
const ENV_API_URL = {
	development: 'https://xxx.xxx.xxx/api/', //开发环境
	production: 'https://xxx.xxx.xxx/api/', //生产环境
}

//根域名
const ENV_BASE_URL = {
	development: 'https://xxx.xxx.xxx/', //开发环境
	production: 'https://xxx.xxx.xxx/', //生产环境
}

//根域名
const ENV_BASE_FILE_URL = {
	development: 'https://xxx.xxx.xxx/', //开发环境
	production: 'https://xxx.xxx.xxx/', //生产环境
}

export const BASE_URL = ENV_BASE_URL[process.env.NODE_ENV || 'development']; //后台根域名
export const API_URL = ENV_API_URL[process.env.NODE_ENV || 'development']; //后台接口域名
export const BASE_FILE_URL = ENV_BASE_FILE_URL[process.env.NODE_ENV || 'development']; //后台接口域名
