import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
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

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
