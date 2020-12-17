import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入自定义 Alert,Confirmt组件
import { AlertConfirmComponent } from '@/components/modules/alert'

// vee-validate 的全局校验规则
import '@/common/vee-validate'

const app = createApp(App)
// 全局注册alert组件
app.use(AlertConfirmComponent)
app.use(store)
app.use(router)

app.mount('#app')
