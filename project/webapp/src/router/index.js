import Vue from 'vue'
import VueRouter from 'vue-router'
const Home = () => import(/* webpackChunkName: 'home' */ '@/views/home')
const Catalog = () => import(/* webpackChunkName: 'catalog' */ '@/views/home/catalog.vue')

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
  }
]

const router = new VueRouter({
  routes
})

export default router
