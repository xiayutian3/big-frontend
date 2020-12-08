import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/Home.vue'
import NotFound from '../components/NotFound.vue'
const routes = [
  {
    path: '/path',
    name: 'Home',
    component: Home,
    children:[
      {
        path:'',
        redirect:'/path/about'
      },
      {
        path:'about',
        component: () => import(/* webpackChunkName: "about" */ '../views/About1.vue')
      }
    ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    name:'not-found',
    path:'/:pathMatch(.*)',   //pathMatch:'not/found'  
    // path:'/:pathMatch(.*)*',   //路径通配符 （// pathMatch:['not','found']）  第二个*代表重复前面的正则
    component:NotFound
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
