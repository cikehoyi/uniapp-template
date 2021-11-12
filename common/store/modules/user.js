// 用户数据模块
import store from '@/common/store'
import api from '@/common/request'
import {
	USER_INFO,
	LOGIN_TIP,
	LOGIN_STATE,
	FORCE_AUTH,
	USER_TOKEN,
} from '../types.js'

const state = {
	userInfo:uni.getStorageSync('userInfo')?uni.getStorageSync('userInfo'):{},//用户数据
	loginState:false,//登录状态
	showLoginTip:false,//全局登录授权弹窗显示控制
	forceAuth:false,//是否强制登录/授权
	user_token:'',//用户token
}

const actions = {
	//检查token及登录授权状态
	async checkUserState({
		commit,
		dispatch
	}){
		let token = uni.getStorageSync('token')
		let result = 1
		//#ifdef MP-WEIXIN
		result = await dispatch('checkSessionKey')
		//#endif
		if(result){
			if((token&&token.outTime <= Date.parse(new Date())/1000) || !token || token&&!token.token){//token过期或无token
				dispatch('login').then(()=>{
					dispatch('getUserInfo')
				})
			}else{
				commit('USER_TOKEN',token.token)
				dispatch('getUserInfo')
			}
		}else{
			dispatch('login').then(()=>{
				dispatch('getUserInfo')
			})
		}
	},
	//#ifdef MP-WEIXIN
	//检查session
	checkSessionKey({
		commit,
		dispatch
	}){
		return new Promise((resolve,reject)=>{
			uni.checkSession({
				success() {
					resolve(1)
				},
				fail(){
					resolve(0)
				},
				complete(e) {
					console.log('session',e)
				}
			})
		})
	},
	//#endif
	//登录
	login({
		commit
	},data){
		return new Promise((resolve, reject)=>{
			uni.login({
				success(res){
					
				},
			})
			
		})
		
	},
	//上传用户信息
	upUserInfo({
		commit,
		dispatch
	},data){
		return new Promise((resolve, reject)=>{
			let params = {}
			
		})
	},
	//获取用户信息
	getUserInfo({
		commit,
		dispatch
	}){
		
	},
	
	
}

const mutations = {
	[USER_TOKEN](state,data){
		state.user_token = data
		uni.setStorageSync('user_token',data)
		if(typeof this.state.init.callBack === 'function'){
			this.state.init.callBack()
			this.commit('callBack',null)
		}
		uni.setStorageSync('token',{token:data,outTime:Date.parse(new Date())/1000 + 14 * 24 * 60 * 60})
	},
	[USER_INFO](state,data){
		state.userInfo = data
		uni.setStorageSync('userInfo',data)
	},
	[LOGIN_STATE](state,data){
		state.loginState = data
	},
	[LOGIN_TIP](state,data){
		state.showLoginTip = data
	},
	[FORCE_AUTH](state,data){
		state.forceAuth = data
	},
}

const getters = {
	
}

export default {
	state,
	actions,
	mutations,
	getters
}