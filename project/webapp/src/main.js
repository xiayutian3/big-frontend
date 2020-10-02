import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引用svg icon
import '@/assets/icons/index'
import { Button, Cell } from 'mint-ui'

Vue.config.productionTip = false

Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
