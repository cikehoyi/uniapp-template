import {
	mapState,
	mapActions
} from 'vuex'
import {
	BASE_URL,
	IMG_URL,
	BASE_FILE_URL
} from "@/config/app.js"

export default {
	data() {
		return {

		}
	},
	computed: {

	},
	onPullDownRefresh() {

	},
	onLoad(e) {


	},
	onReady() {

	},
	onShow() {

	},
	methods: {
		/**
		 * 显示提示并可返回上一页
		 * @param {String} msg - 显示内容 
		 * @param {Number} isback - 提示完成后是否返回上一页， 0不返回 1返回
		 * @param {Number} duration - 弹窗提示时间  
		 * @returns 
		 */
		$tips(msg, isback = 0, duration = 2000) {
			return new Promise((resolve, reject) => {
				uni.showToast({
					title: msg || '请求出错,稍后重试',
					icon: 'none',
					duration: duration,
					mask: true,
				});
				setTimeout(() => {
					resolve()
					if (isback == 1) {
						uni.navigateBack()
					}
				}, duration)
			})
		},
		/**
		 * 服务器资源文件路径拼接
		 * @param {String} url 
		 * @returns {String}
		 */
		$src(url) {
			if (!/^http/.test(url)) {
				return BASE_URL + url
			} else {
				return url
			}
		},
		/**
		 * 服务器资源文件路径拼接,多个资源，返回数组
		 * @param {String, Array, String<Array>} url 
		 * @returns {Array}
		 */
		$srcArr(url) {
			// 如果是数组
			if (Array.isArray(url)) {
				return url.map((item) => this.$src(item))
			}
			// 如果是JSON数组或 ',' 分割字符串
			let urlArr = ''
			try {
				urlArr = JSON.parse(url)
			} catch (err) {
				urlArr = url.split(',')
			}
			return urlArr.map((item) => this.$src(item))
		},

		/**
		 * 页面跳转
		 * @param {String} url 
		 * @param {String} type - 跳转方法 
		 * @returns 
		 */
		$to(url, type = "nt") {
			let methods = {
				'nt': 'navigateTo',
				'rt': 'redirectTo',
				'st': 'switchTab',
				'rl': 'reLaunch',
				'nb': 'navigateBack',
			}
			return new Promise((resolve, reject) => {
				uni[methods[type]]({
					url: url,
					success() {
						resolve()
					},
					fail() {
						reject()
					}
				})
			})
		},

		/**
		 * 流加载状态
		 * @param {Array} resData - 接口获取的数据列表
		 * @param {*} list - 当前已有列表数据
		 * @param {*} page - 当前页数
		 * @param {*} length - 每次请求的数据长度
		 * @returns 
		 */
		$loadMore(resData, list = [], page = 1, pageSize = 10) {
			let data = resData || [],
				loadStatus = 'loadmore';
			if (data.length == 0 && list.length == 0) {
				loadStatus = 'nodata' //'nodata' 3
			} else if (data.length == pageSize) {
				loadStatus = 'loading' //'loading' 4
				page += 1
			} else {
				loadStatus = 'nomore' //'noMore' 2
			}
			return {
				page,
				loadStatus,
				lists: list.concat(resData)
			}
		}
	},
	onShareAppMessage() {

	}
}