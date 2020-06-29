import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import './local/index'

// 表单验证检验的第三方插件（vee-validate3.x的使用）
// import '@/utils/veevalidate'

// 使用到vue-i18n的vee-validate3.x
import '@/utils/veevalidate-i18n'

// Symbol 引用 自定义 icon(阿里de iconfont上下载的)
import '@/assets/custom/iconfont'

// 一次性注册所有的过滤器
import filters from '@/utils/filter'
// 一次性注册所有的自定义指令
import directives from '@/utils/directives'

// 使用自定义 alert组件 ，pop组件
import Alert from './components/modules/alert/index'
import Pop from './components/modules/pop'
Vue.use(Alert)
Vue.use(Pop)
// 注册全局过滤器(一次性注册)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
// 注册全局自定义指令(一次性注册)
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
