// refresh token  机制

import axios from 'axios'
import store from '@/store'
// 之前的实例，用来发上次的请求
import request from './request'
import router from '@/router'
import config from '@/config'
const baseUrl = process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro

// 重新创建一个axios实例，用原来的axios实例的话，会一直判断axios的token过期，进入死循坏
const instance = axios.create({
  baseURL: baseUrl,
  headers: {
    'Content-Type': 'application/json;charset=utf-8'
  },
  timeout: 1000 * 10
})
// axios用来处理错误的函数
const errorHandle = async (err) => {
  console.log(err)
  if (err.response.status === 401) {
    const refreshToken = localStorage.getItem('refreshToken')
    // 不能这么设置因为它是全局的
    // instance.headers.Authorization = 'Bearer ' + refreshToken

    // token已经过期
    // 需要请求refreshToken接口
    // 1.成功-》重新发起请求 -》 参数  之前的请求参数存在err.config中
    // 2.失败 -》 token全失效需要用户重新登录

    try {
      const result = await instance.post('/login/refresh', null, { // 第三个参数才是 config，第二个是data
        headers: {
          Authorization: 'Bearer ' + refreshToken
        }
      })
      if (result) {
        store.commit('setToken', result.data.token)
        // 重新上次请求（err.config 上次请求的数都在里边）
        return request.request(err.config)
      }
    } catch (error) {
      // 清空数据，返回登录
      // 清空本地，vuex上的用户数据
      localStorage.clear()
      store.commit('setToken', '')
      store.commit('setUserInfo', '')
      store.commit('setIsLogin', false)

      // token失效，跳转登录，当用户登录成功后，让用户回到之前的页面
      return router.push({ name: 'login',
        query: {
          redirect: router.currentRoute.fullPath
          // router.currentRoute 等价于 $route
        }
      })
    }
  }
}
export default errorHandle
