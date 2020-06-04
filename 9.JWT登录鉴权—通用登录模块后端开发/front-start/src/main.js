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

// 使用自定义 alert组件 ，pop组件
import Alert from './components/modules/alert/index'
import Pop from './components/modules/pop'
Vue.use(Alert)
Vue.use(Pop)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
