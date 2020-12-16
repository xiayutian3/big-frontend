import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '@/views/Login.vue'
// import Reg from '@/views/Reg.vue'

// 路由懒加载的形式
const Reg = () => import('@/views/Reg.vue')

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
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
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
