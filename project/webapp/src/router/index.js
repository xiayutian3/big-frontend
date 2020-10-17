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

const User = () => import(/* webpackChunkName: 'user' */ '@/views/user/user')
const Hot = () => import(/* webpackChunkName: 'hot' */ '@/views/hot')
const Msg = () => import(/* webpackChunkName: 'msg' */ '@/views/msg')
const NotFound = () => import(/* webpackChunkName: '404' */ '@/views/404')

// 修改密码
const Passwd = () =>
  import(/* webpackChunkName: 'passwd' */ '@/views/user/passwd')
// 修改个人设置
const Settings = () =>
  import(/* webpackChunkName: 'settings' */ '@/views/user/settings')
// 我的帖子
const MyPost = () =>
  import(/* webpackChunkName: 'mypost' */ '@/views/user/mypost')
// 我的收藏
const MyFav = () => import(/* webpackChunkName: 'myfav' */ '@/views/user/myfav')
// 我的签到
const Sign = () => import(/* webpackChunkName: 'sign' */ '@/views/user/sign')
// 我的主页
const Center = () =>
  import(/* webpackChunkName: 'center' */ '@/views/user/center')
// 热门相关
// const HotPost = () =>
//   import(/* webpackChunkName: 'hotpost' */ '@/views/hot/post')
// const HotComments = () =>
//   import(/* webpackChunkName: 'hotcomments' */ '@/views/hot/comments')
// const HotSign = () =>
//   import(/* webpackChunkName: 'hotsign' */ '@/views/hot/sign')

Vue.use(VueRouter)

const routes = [
  // 首页
  {
    path: '/',
    redirect: '/index'
  },
  {
    path: '/index',
    name: 'home',
    component: Home,
    children: [
      {
        path: '',
        name: 'index',
        component: Catalog,
        meta: {
          index: 0
        }
      },
      {
        path: ':catalog',
        name: 'catalog',
        component: Catalog,
        props: true, //  让catalog 变成props 传递，在组件内就可以用props接受,这样的话，在访问index路径必须输入 :catalog,如果只是输入 /index，的话，无法访问，必须/index/123456
        meta: {
          index: 0
        }
      }
    ]
  },
  // 详情页
  {
    path: '/detail/:tid',
    name: 'detail',
    props: true, // 让参数tid变成peops
    component: Detail,
    meta: {
      index: 1
    }
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
    component: User,
    meta: {
      index: 0
    }
  },
  // 修改设置
  {
    path: '/passwd',
    name: 'passwd',
    component: Passwd,
    meta: { requiresAuth: true, index: 1 }
  },
  // 修改设置
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true, index: 1 }
  },
  // 我的帖子
  {
    path: '/mypost',
    name: 'mypost',
    component: MyPost,
    meta: { requiresAuth: true, index: 1 }
  },
  // 我的收藏
  {
    path: '/myfav',
    name: 'myfav',
    component: MyFav,
    meta: { requiresAuth: true, index: 1 }
  },
  // 签到中心
  {
    path: '/sign',
    name: 'sign',
    component: Sign,
    meta: { requiresAuth: true, index: 1 }
  },
  // 个人主页
  {
    path: '/center',
    name: 'center',
    component: Center,
    meta: { requiresAuth: true, index: 1 }
  },
  {
    path: '/hot/:type',
    name: 'hot',
    component: Hot,
    props: true
  },
  {
    path: '/msg/:type',
    name: 'msg',
    component: Msg,
    props: true,
    meta: { requiresAuth: true }
  },
  {
    path: '/404',
    name: '404',
    component: NotFound
  },
  {
    path: '*',
    redirect: '/404'
  }
]

const router = new VueRouter({
  routes,
  linkExactActiveClass: 'active' // 精准匹配。激活class name
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
