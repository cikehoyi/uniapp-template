import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import init from './modules/init.js'
import user from './modules/user.js'
const store = new Vuex.Store({
	modules: {
		init,
		user,
	}
})
export default store