import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// vee-validate 的全局校验规则
import '@/common/vee-validate'

createApp(App).use(store).use(router).mount('#app')
