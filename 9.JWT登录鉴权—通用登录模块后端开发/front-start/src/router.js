import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import(/* webpackChunkName: 'reg' */ './views/Home.vue')
const Login = () => import(/* webpackChunkName: 'login' */ './views/Login.vue')
const Reg = () => import(/* webpackChunkName: 'reg' */ './views/Reg.vue')
const Forget = () => import(/* webpackChunkName: 'forget' */ './views/Forget.vue')
const Center = () => import('./views/Center.vue')
const Index = () => import(/* webpackChunkName: 'reg' */ './views/channels/Index.vue')
const Template1 = () => import(/* webpackChunkName: 'reg' */ './views/channels/Template1.vue')
const User = () => import('./views/User.vue')
const UserCenter = () => import('./components/user/Center.vue')
const UserMsg = () => import('./components/user/Msg.vue')
const UserOthers = () => import('./components/user/Others.vue')
const UserPosts = () => import('./components/user/Posts.vue')
const UserSetting = () => import('./components/user/Setting.vue')
const Accounts = () => import('./components/user/common/Accounts.vue')
const MyInfo = () => import('./components/user/common/MyInfo.vue')
const Passwd = () => import('./components/user/common/Passwd.vue')
const PicUpload = () => import('./components/user/common/PicUpload.vue')

Vue.use(Router)

export default new Router({
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
          name: 'posts',
          component: UserPosts
        },
        {
          path: 'set',
          name: 'set',
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
    }
  ]
})
