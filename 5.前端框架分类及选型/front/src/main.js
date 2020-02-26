import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import axios from 'axios'

// // 表单验证 VeeValidate  2.x版本   (使用插件提供的中文语言包) 第一种

// import VeeValidate, { Validator } from 'vee-validate'
// // 中文语言V
// import zh from 'vee-validate/dist/locale/zh_CN'
// Vue.use(VeeValidate)
// Validator.localize('zh', zh)

// 表单验证 VeeValidate  2.x版本  (使用自己提供的中文语言包) 第二种

import VeeValidate, { Validator } from 'vee-validate'
import './local' // 本地提供的中文语言包
const validator = new Validator()
Vue.use(VeeValidate)
validator.localize('zh')

// 表单验证 vuelidate

// import Vuelidate from 'vuelidate'
// Vue.use(Vuelidate)

// 设置axios 的baseUrl(已经封装了请求，这里就不需要了)
// axios.defaults.baseURL = process.env.NODE_ENV !== 'production' ? 'http://localhost:3000' : 'https://api.example.com'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
