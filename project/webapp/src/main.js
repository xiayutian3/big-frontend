import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import filters from '@/plugins/filter'
import directives from '@/plugins/directives'
// // 引用svg icon（已经在plugins中common全局注册components下面的组件了，这里不需要了）
// import '@/assets/icons/index'

// 基础样式重置-normalize.css
import 'normalize.css/normalize.css'
// 引入自定义主题色
import '@/assets/styles/theme.scss'

// 引用mint ui
import '@/plugins/mint-ui'
// 引入自动注册的组件
import '@/plugins/common'

// 全局过滤器
Object.keys(filters).forEach((key) => {
  Vue.filter(key, filters[key])
})
// 全局指令
Object.keys(directives).forEach((key) => {
  Vue.directive(key, directives[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
