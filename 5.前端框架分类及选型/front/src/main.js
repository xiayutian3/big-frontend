import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// // 表单验证 VeeValidate(使用插件提供的中文语言包) 第一种
// import VeeValidate, { Validator } from 'vee-validate'
// // 中文语言V
// import zh from 'vee-validate/dist/locale/zh_CN'
// Vue.use(VeeValidate)
// Validator.localize('zh', zh)

// 表单验证 VeeValidate(使用自己提供的中文语言包) 第二种
import VeeValidate, { Validator } from 'vee-validate'
import './local' // 本地提供的中文语言包
const validator = new Validator()
Vue.use(VeeValidate)
validator.localize('zh')

// 表单验证 vuelidate
// import Vuelidate from 'vuelidate'
// Vue.use(Vuelidate)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
