import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import store from '@/store'
import { getCode, login, reg } from '@/api/login'
import { HttpResponse } from '@/common/interface'
import router from '@/router'

export const loginService = () => {
  let sid = ''

  const state = reactive({
    username: '',
    password: '',
    name: '',
    repassword: '',
    code: '',
    svg: ''
  })
  // 获取验证码
  const _getCode = async () => {
    // 产生唯一标识，用来跟检查对应用户验证码时效性

    if (localStorage.getItem('sid')) {
      sid = localStorage.getItem('sid') || ''
    } else {
      sid = uuidv4()
      // console.log('sid:', sid)
      localStorage.setItem('sid', sid)
      // 更新vuex的sid
      store.commit('setSid', sid)
    }

    // 指定类型  自定义 api接口返回的 Promise<HttpResponse>  HttpResponse
    const { data, code } = await getCode(sid) as HttpResponse
    if (code === 200) {
      state.svg = data
    }
  }

  // 登录
  const loginHandle = async () => {
    const res = await login({
      username: state.username,
      password: state.password,
      code: state.code,
      sid: sid
    })
    const { code, data, token } = res as HttpResponse
    if (code === 200) {
      data.username = state.username
      // 同步vuex的用户信息
      store.commit('setUserInfo', data)
      store.commit('setIsLogin', true)
      store.commit('setToken', token)
      // 登录成功 后重置数据
      state.username = ''
      state.password = ''
      state.code = ''
      router.push({ name: 'index' })
    }
    return res
  }

  // 注册
  const regHandle = async () => {
    const res = await reg({
      name: state.name,
      username: state.username,
      password: state.password,
      code: state.code,
      sid: sid
    })
    const { code } = res as HttpResponse
    if (code === 200) {
      // 注册成功 后重置数据
      state.name = ''
      state.username = ''
      state.password = ''
      state.repassword = ''
      state.code = ''
      setTimeout(() => {
        router.push('/login')
      })
    }
    return res
  }
  return {
    _getCode,
    state,
    loginHandle,
    regHandle
  }
}
