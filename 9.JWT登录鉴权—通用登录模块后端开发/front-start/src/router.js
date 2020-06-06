import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import jwt from 'jsonwebtoken'
// import moment from 'moment'
import moment from 'dayjs' // 功能跟moment一样，比moment小，moment的东西比较多，使用方法基本都一样
const Home = () => import(/* webpackChunkName: 'reg' */ './views/Home.vue')
const Login = () => import(/* webpackChunkName: 'login' */ './views/Login.vue')
const Reg = () => import(/* webpackChunkName: 'reg' */ './views/Reg.vue')
const Forget = () => import(/* webpackChunkName: 'Forget' */ './views/Forget.vue')
const Center = () => import(/* webpackChunkName: 'Center' */ './views/Center.vue')
const Index = () => import(/* webpackChunkName: 'Index' */ './views/channels/Index.vue')
const Template1 = () => import(/* webpackChunkName: 'Template1' */ './views/channels/Template1.vue')
const User = () => import(/* webpackChunkName: 'User' */ './views/User.vue')
const UserCenter = () => import(/* webpackChunkName: 'UserCenter' */ './components/user/Center.vue')
const UserMsg = () => import(/* webpackChunkName: 'UserMsg' */ './components/user/Msg.vue')
const UserOthers = () => import(/* webpackChunkName: 'UserOthers' */ './components/user/Others.vue')
const UserPosts = () => import(/* webpackChunkName: 'UserPosts' */ './components/user/Posts.vue')
const UserSetting = () => import(/* webpackChunkName: 'UserSetting' */ './components/user/Setting.vue')
const Accounts = () => import(/* webpackChunkName: 'Accounts' */ './components/user/common/Accounts.vue')
const MyInfo = () => import(/* webpackChunkName: 'MyInfo' */ './components/user/common/MyInfo.vue')
const Passwd = () => import(/* webpackChunkName: 'Passwd' */ './components/user/common/Passwd.vue')
const PicUpload = () => import(/* webpackChunkName: 'PicUpload' */ './components/user/common/PicUpload.vue')
const MyPost = () => import(/* webpackChunkName: 'MyPost' */ './components/user/common/MyPost.vue')
const MyCollection = () => import(/* webpackChunkName: 'MyCollection' */ './components/user/common/MyCollection.vue')
const NoFound = () => import(/* webpackChunkName: 'NoFound' */ './views/NoFound.vue')

Vue.use(Router)

const router = new Router({
  linkExactActiveClass: 'layui-this', // 精准匹配,layui a标签激活的样式
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'index',
          component: Index
        },
        {
          path: '/index/:catalog',
          name: 'catalog',
          component: Template1
        }
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/reg',
      name: 'reg',
      component: Reg,
      beforeEnter: (to, from, next) => {
        // 路由钩子  主要是为了sid 唯一值，因为它只在登录界面生成，所以先访问login后再能访问reg页
        // to要到的路由对象，from从哪里来的路由对象，next继续执行
        // debugger
        if (from.name === 'login') {
          next()
        } else {
          next('/login')
        }
      }
    },
    {
      path: '/forget',
      name: 'forget',
      component: Forget
    },
    {
      path: '/user/:uid',
      name: 'home',
      props: true,
      component: User
    },
    {
      path: '/center',
      component: Center,
      meta: { requiresAuth: true },
      linkActiveClass: 'layui-this',
      children: [
        {
          path: '',
          name: 'center',
          component: UserCenter
        },
        {
          path: 'msg',
          name: 'msg',
          component: UserMsg
        },
        {
          path: 'others',
          name: 'others',
          component: UserOthers
        },
        {
          path: 'posts',
          component: UserPosts,
          children: [
            {
              path: '',
              name: 'mypost',
              component: MyPost
            },
            {
              path: 'mycollection',
              name: 'mycollection',
              component: MyCollection
            }
          ]
        },
        {
          path: 'set',
          component: UserSetting,
          children: [
            {
              path: 'account',
              name: 'account',
              component: Accounts
            },
            {
              path: '',
              name: 'info',
              component: MyInfo
            },
            {
              path: 'passwd',
              name: 'passwd',
              component: Passwd
            },
            {
              path: 'pic',
              name: 'pic',
              component: PicUpload
            }
          ]
        }
      ]
    },
    {
      path: '/404',
      component: NoFound
    },
    {
      path: '*',
      redirect: '/404'
    }
  ]
})

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
    } else {
      // token过期，清空用户数据
      localStorage.clear()
    }
  }

  // 路由权限
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
