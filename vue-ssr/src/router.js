// router.js
import Vue from 'vue'
import Router from 'vue-router'
// import Hello from './components/Hello.vue'

Vue.use(Router)

export function createRouter(){
  return new Router({
    mode: 'history',
    routes: [
      // ...
      {
        path:'/hello',
        // component:Hello
        //需要安装 插件支持 @babel/plugin-syntax-dynamic-import 才能才能使用懒加载
        component:()=> import( /*webpackChunkName: 'hello' */'./components/Hello.vue')
      },
      {
        path:'/hello1',
        // component:Hello
        //需要安装 插件支持 @babel/plugin-syntax-dynamic-import 才能才能使用懒加载
        component:()=> import( /*webpackChunkName: 'hello1' */'./components/Hello1.vue')
      }
    ]
  })
}  