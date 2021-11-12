import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

//全局混入
import mixins from '@/common/mixins/mixins';
Vue.mixin(mixins);

//公共函数引用
import utils from '@/common/utils.js'
Vue.prototype.$utils = utils

//请求方法挂载
import api from '@/common/request'
Vue.prototype.$api = api

//vuex挂载
import store from '@/common/store'
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
    ...App,
	store
})
app.$mount()
