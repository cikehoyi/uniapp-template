// 初始化数据模块
import store from '@/common/store'
import api from '@/common/request'
import {
	BASE_URL
} from '@/config/app.js'
import {
	INIT_DATA,
	STATUS_BAR_INFO,
	IS_IPHONEX,
} from '../types.js'

const state = {
	initData: {}, //应用初始配置
	BASE_URL:BASE_URL,//根域名
	statusBarInfo:{},//状态栏距离信息
	callBack:null,//回调函数（一般用于分享进入页面，未获取token时设置）
	isIponeX:false,//是否为iphonex
}

const actions = {
	//获取系统信息，设置自定义导航高度
	getSystemInfo({
		commit
	}){
		return new Promise((resolve,reject)=>{
			uni.getSystemInfo({
				success(res){
					console.log(res)
					let menuButtonHeight = 0;//小程序胶囊高度
					let menuButtonTop = res.statusBarHeight;//小程序胶囊到顶部的距离
					let canUseWidth = res.windowWidth;//可用宽度
					//#ifdef MP-WEIXIN
					let menuButtonInfo = uni.getMenuButtonBoundingClientRect()
					menuButtonHeight = menuButtonInfo.height
					menuButtonTop = menuButtonInfo.top
					canUseWidth = res.windowWidth - (res.windowWidth - menuButtonInfo.right)*2 - menuButtonInfo.width
					//#endif
					let barHeight = res.statusBarHeight + menuButtonHeight + (menuButtonTop - res.statusBarHeight)*2 //整个导航栏高度
					commit('STATUS_BAR_INFO',{
						canUseWidth,
						menuButtonTop,
						barHeight,
						statusBarHeight:res.statusBarHeight,
						windowWidth:res.windowWidth,
						windowHeight:res.windowHeight,
						screenHeight:res.screenHeight,
						//#ifdef MP-ALIPAY
						titleBarHeight:res.titleBarHeight,
						//#endif
						//#ifdef MP-WEIXIN
						titleBarHeight:44,
						//#endif
					})
					// 判断是否为IPhoneX，得到安全区域高度
					let modelmes = res.model;
					if (modelmes.search('iPhone X') != -1){ //IPhoneX底部大约为68rpx
						commit('IS_IPHONEX',true)
					}
					resolve(res)
				}
			})
		})
	},
	//获取配置数据
	getInit({
		commit
	}){
		return new Promise((resolve,reject)=>{
			
		})
	},
	
}

const mutations = {
	//设置状态栏高度
	STATUS_BAR_INFO(state,data){
		state.statusBarInfo = data
	},
	//设置配置数据
	[INIT_DATA](state,data){
		state.initData = data
	},
	callBack(state,data){
		state.callBack = data
	},
	IS_IPHONEX(state,data){
		state.isIponeX = data
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