import Vue from 'vue'
import Router from 'vue-router'
const Home = () => import(/* webpackChunkName: 'reg' */ './views/Home.vue')
const Login = () => import(/* webpackChunkName: 'login' */ './views/Login.vue')
const Reg = () => import(/* webpackChunkName: 'reg' */ './views/Reg.vue')
const Forget = () =>
  import(/* webpackChunkName: 'forget' */ './views/Forget.vue')
const Index = () => import(/* webpackChunkName: 'reg' */ './views/channels/Index.vue')
const Template1 = () => import(/* webpackChunkName: 'reg' */ './views/channels/Template1.vue')

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
    }
  ]
})
