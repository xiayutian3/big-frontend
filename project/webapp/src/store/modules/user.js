import { getCode, login } from '@/api/login'
// uuid 生成唯一的id
import { v4 as uuidv4 } from 'uuid'
import {
  SET_ISLOGIN,
  SET_SID,
  SET_USER,
  SET_MSG,
  SET_TOKEN,
  SET_HIDE
} from '@/store/mutation-types'
export default {
  namespaced: true,
  state: {
    sid: '',
    isLogin: false,
    token: '',
    userInfo: JSON.parse(localStorage.getItem('userInfo')) || {}, // 设置用户的基本信息
    num: 0, // 未读消息条数
    isHide: false
  },
  mutations: {
    [SET_SID] (state, value) {
      state.sid = value
    },
    [SET_TOKEN] (state, value) {
      if (value === '') return
      state.token = value
      // 本地存储token
      localStorage.setItem('token', value)
    },
    [SET_USER] (state, value) {
      if (value === '') return
      // 本地存储用户的基本信息
      localStorage.setItem('userInfo', JSON.stringify(value))
      state.userInfo = value
    },
    [SET_ISLOGIN] (state, value) {
      // 设置login的状态
      state.isLogin = value
    },
    // 设置container的状态
    [SET_HIDE] (state, value) {
      state.isHide = value
    },
    [SET_MSG] (state, value) {
      // 设置未读的评论条数（头部那里显示）
      state.num = value
    }
  },
  getters: {
    user: state => state.userInfo,
    isLogin: state => state.isLogin,
    token: state => state.token,
    sid: state => state.sid,
    isHide: state => state.isHide
  },
  actions: {
    // 设置未读的评论条数（头部那里显示）
    message ({ commit }, msg) {
      commit('setMessage', msg)
    },
    // 获取图片验证码
    async getCode ({ commit }) {
      let sid = ''
      if (localStorage.getItem('sid')) {
        sid = localStorage.getItem('sid')
      } else {
        sid = uuidv4()
        // console.log('sid:', sid)
        localStorage.setItem('sid', sid)
      }
      // 更新vuex的sid
      // commit([SET_SID], sid)  //报错，只能使用字符串，不能使用[变量]
      commit('SET_SID', sid)
      const result = await getCode(sid)
      // if (result.code === 200) {
      //   // 返回到前端svg图片数据
      //   return result.data
      // }
      return result
    },
    // 登录
    async login ({ commit, state }, payload) {
      const result = await login({
        ...payload,
        sid: state.user.sid
      })
      if (result.code === 200 && result.token) {
        const userInfo = result.data
        userInfo.username = payload.username
        commit('SET_TOKEN', result.token)
        commit('SET_USER', userInfo)
        commit('SET_ISLOGIN', true)
        // 注意  报错，只能使用字符串，不能使用[变量]
        // commit([SET_TOKEN], result.token)
        // commit([SET_USER], userInfo)
        // commit([SET_ISLOGIN], true)
      }
      return result
    }
  }
}
