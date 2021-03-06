import { createStore, createLogger } from 'vuex'
// 类型约束
import { UserInfo } from '@/common/interface'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  state: {
    sid: '',
    isLogin: false,
    token: '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || JSON.stringify({
      name: '',
      pic: '',
      isVip: 0,
      _id: ''
    })) as UserInfo, // 设置用户的基本信息
    ws: null, // websoxket客户端
    num: 0 // 未读消息条数

  },
  mutations: {
    // initWebSocket (state, config) {
    // state.ws = new WebSocketClient(config)
    // state.ws.init()
    // },
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
      // 本地存储用户的基本信息
      localStorage.setItem('userInfo', JSON.stringify(value))
      state.userInfo = value
    },
    setIsLogin (state, value) {
      // 设置login的状态
      state.isLogin = value
    },
    setMessage (state, value) {
      // 设置未读的评论条数（头部那里显示）
      state.num = value
    }
  },
  actions: {
    // 设置未读的评论条数（头部那里显示）
    message ({ commit }, msg) {
      commit('setMessage', msg)
    }
  },
  plugins: debug ? [createLogger()] : [] // 调试vuex
})
