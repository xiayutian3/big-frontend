import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入自定义 Alert,Confirmt组件
import { AlertConfirmComponent } from '@/components/modules/alert'

// 引入自定义的popup组件
import popupComponent from '@/components/modules/pop'

// vee-validate 的全局校验规则
import '@/common/vee-validate'

const app = createApp(App)
// 全局注册alert, Confirmt组件
app.use(AlertConfirmComponent)
// 全局注册popup组件
app.use(popupComponent)
app.use(store)
app.use(router)

app.mount('#app')
