import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sid: '',
    isLogin: false,
    token: '',
    userInfo: {} // 设置用户的基本信息
  },
  mutations: {
    setSid (state, value) {
      state.sid = value
    },
    setUserInfo (state, value) {
      state.userInfo = value
    },
    setIsLogin (state, value) {
      // 设置login的状态
      state.isLogin = value
    }
  },
  actions: {

  }
})
