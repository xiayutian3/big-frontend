import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import RefView from '../views/RefView.vue'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/ref',
    name: 'RefView',
    component: RefView
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
