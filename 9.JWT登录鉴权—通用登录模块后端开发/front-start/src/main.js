import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// import './local/index'

// 表单验证检验的第三方插件（vee-validate3.x的使用）
// import '@/utils/veevalidate'

// 使用到vue-i18n的vee-validate3.x
import '@/utils/veevalidate-i18n'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
