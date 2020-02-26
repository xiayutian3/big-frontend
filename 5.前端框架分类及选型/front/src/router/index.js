import Vue from 'vue'
import VueRouter from 'vue-router'
// import Home from '../views/Home.vue'
// const xxx = () => import(/* webpackChunkName: "about" */ '../views/About.vue')
const Login = () => import('@/views/Login')
const Reg = () => import('@/views/Reg')
const Forget = () => import('@/views/Forget')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
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
    component: Forget
  }
]

const router = new VueRouter({
  routes
})

export default router
