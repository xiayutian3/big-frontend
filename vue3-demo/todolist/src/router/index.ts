import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import Home from '../views/Home.vue'
import Add from '@/components/Add.vue'
import Delete from '@/components/Delete.vue'
import Done from '@/components/Done.vue'
import Edit from '@/components/Edit.vue'

const routes: Array<RouteRecordRaw> = [
  // {
  //   path: '/',
  //   redirect: { name: 'add' }
  // },
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '',
        // redirect: { name: 'add' }   //可以
        redirect: '/add' // 要自己加上/，vue3中不会自动加上/了
      },
      {
        path: 'add',
        name: 'add',
        component: Add
      },
      {
        path: 'delete',
        name: 'delete',
        component: Delete
      },
      {
        path: 'done',
        name: 'done',
        component: Done
      },
      {
        path: 'edit',
        name: 'edit',
        component: Edit
      }
    ]
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  linkExactActiveClass: 'active' // 精准匹配 a标签激活的样式
})

export default router
