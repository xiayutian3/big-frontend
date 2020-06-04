import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    sid: '',
    isLogin: false,
    token: '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {} // 设置用户的基本信息
  },
  mutations: {
    setSid (state, value) {
      state.sid = value
    },
    setToken (state, value) {
      if (value === '') return
      state.token = value
      // 本地存储token
      localStorage.setItem('token', value)
    },
    setUserInfo (state, value) {
      if (value === '') return
      state.userInfo = value
      // 本地存储用户的基本信息
      localStorage.setItem('userInfo', JSON.stringify(value))
    },
    setIsLogin (state, value) {
      // 设置login的状态
      state.isLogin = value
    }
  },
  actions: {

  }
})
