import Vue from 'vue'
import VueRouter from 'vue-router'
import store from '@/store'
import moment from 'dayjs'
import {
  SET_USER,
  SET_ISLOGIN,
  SET_TOKEN,
  INIT_WEBSOCKET
} from '@/store/mutation-types'
import { MessageBox } from 'mint-ui'

const Home = () => import(/* webpackChunkName: 'home' */ '@/views/home')
const Catalog = () => import(/* webpackChunkName: 'catalog' */ '@/views/home/catalog.vue')
const Detail = () => import(/* webpackChunkName: 'detail' */ '@/views/detail')

// 注册登录&找回密码
const Login = () => import(/* webpackChunkName: 'login' */ '@/views/user/login')
const Reg = () => import(/* webpackChunkName: 'reg' */ '@/views/user/reg')
const Forget = () => import(/* webpackChunkName: 'forget' */ '@/views/user/forget')

const User = () => import(/* webpackChunkName: 'forget' */ '@/views/user/user')

Vue.use(VueRouter)

const routes = [
  // 首页
  {
    path: '',
    name: 'home',
    component: Home,
    redirect: '/index',
    children: [
      {
        path: '/index',
        name: 'index',
        component: Catalog
      },
      {
        path: '/index/:catalog',
        name: 'catalog',
        component: Catalog,
        props: true //  让catalog 变成props 传递，在组件内就可以用props接受,这样的话，在访问index路径必须输入 :catalog,如果只是输入 /index，的话，无法访问，必须/index/123456
      }
    ]
  },
  // 详情页
  {
    path: '/detail/:tid',
    name: 'detail',
    props: true, // 让参数tid变成peops
    component: Detail
  },
  // 注册登录
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/reg',
    name: 'reg',
    component: Reg
  },
  {
    path: '/forget',
    name: 'forget',
    component: Forget,
    meta: { requiresAuth: true }
  },
  {
    path: '/user',
    name: 'user',
    component: User
  }
]

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'active'
})

// 1. 基于角色的路由守卫
// 2. 组件级的权限控制 -> directive

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  const userInfo = JSON.parse(localStorage.getItem('userInfo'))
  if (token !== '' && token !== null) {
    // method 1
    // const payload = jwt.decode(token)
    // method 2
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (moment().isBefore(moment(payload.exp * 1000))) {
      // 取localStorage里面缓存的token信息 + 用户信息
      // 8-24小时， refresh token 1个月
      // 'user/' + SET_TOKEN,表示user这个模块下的SET_TOKEN mutation方法，模块与方法间用 / 隔开 ，两者连起来时字符串
      store.commit('user/' + SET_TOKEN, token)
      store.commit('user/' + SET_USER, userInfo)
      store.commit('user/' + SET_ISLOGIN, true)
      if (!store.state.ws) {
        store.commit(INIT_WEBSOCKET, {})
      }
    } else {
      localStorage.clear()
    }
  }
  // to and from are Route Object,next() must be called to resolve the hook
  // console.log('to.matched', to.matched) // 匹配的路由记录
  // console.log(to)
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    const isLogin = store.state.user.isLogin
    // 需要用户登录的页面进行区别
    if (isLogin) {
      // 已经登录的状态
      // 权限判断，meta元数据
      next()
    } else {
      // 未登录的状态
      // next('/login')
      MessageBox.confirm('您还未登录，需要登录吗？')
        .then((action) => {
          next('/login')
        })
        .catch((cancel) => {})
    }
  } else {
    // 公共页面，不需要用户登录
    next()
  }
})

export default router
