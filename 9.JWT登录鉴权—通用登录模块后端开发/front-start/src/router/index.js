import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import routes from './routers'
import jwt from 'jsonwebtoken'
// import moment from 'moment'
import moment from 'dayjs' // 功能跟moment一样，比moment小，moment的东西比较多，使用方法基本都一样

Vue.use(Router)

const router = new Router(routes)

// 全局路由前置守卫

router.beforeEach((to, from, next) => {
  // 不管是哪个页面，头部都需要拿到用户的数据
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))

  if (token !== '' && token !== null && userInfo) {
    // 取localstorage缓存的数据  同步vuex，防止刷新的问题

    // 解析token拿到过期时间(payload.exp单位是秒，moment是毫秒，需要转换)
    const payload = jwt.decode(token)
    // console.log('payload', payload)
    // 判断时间是否过期
    // console.log(moment().isBefore(moment(payload.exp * 1000)))
    if (moment().isBefore(moment(payload.exp * 1000))) {
    // jsonwebtoken （jwt.decode(token [, options])）可以解析出token中的时效性，因为是明文传输
    // token时效性问题8-24小时，refresh token 1个月  （如果有refresh token的话）作用：当用户的token过期后，会拿着这个refresh token，去服务器请求新的token，从而替换旧的token,通常把token时效设置短一点，保证安全性
      store.commit('setToken', token)
      store.commit('setUserInfo', userInfo)
      store.commit('setIsLogin', true)
      // 如果websocket不存在，就初始化websocket
      if (!store.state.ws) {
        store.commit('initWebSocket', {})
      }
    } else {
      // token过期，清空用户数据
      localStorage.clear()
    }
  }

  // 路由权限  //路由守卫添加了 meta: { requiresAuth: true },
  if (to.matched.some(record => record.meta.requiresAuth)) {
    const isLogin = store.state.isLogin
    // 需要用户登录的页面
    if (isLogin) {
      // 已经登录的状态
      // 还可以增加权限判断，meta元数据
      next()
    } else {
      // 未登录的状态
      next('/login')
    }
  } else {
    // 公共页面 不需要用户登录的
    next()
  }
})

export default router
