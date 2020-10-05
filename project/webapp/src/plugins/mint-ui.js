import Vue from 'vue'
// 引入mint-ui样式
import 'mint-ui/lib/style.min.css'
import { Button, Cell, Header, Loadmore, Spinner, Toast } from 'mint-ui'

Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Header.name, Header)
Vue.component(Spinner.name, Spinner)
Vue.component(Loadmore.name, Loadmore)
Vue.prototype.$Toast = Toast
