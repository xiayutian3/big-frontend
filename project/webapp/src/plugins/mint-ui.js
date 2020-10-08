import Vue from 'vue'
// 引入mint-ui样式
import 'mint-ui/lib/style.min.css'
import { Button, Cell, Header, Spinner, Toast, InfiniteScroll, Field, Actionsheet } from 'mint-ui'

Vue.use(InfiniteScroll)
Vue.component(Spinner.name, Spinner)
// 自己考了源码，重新写了loadmore，  源码的event.preventDefault()出了一些问题，改为了
// if (event.cancelable) {
//   event.preventDefault()
// }
// Vue.component(Loadmore.name, Loadmore)
Vue.component(Button.name, Button)
Vue.component(Cell.name, Cell)
Vue.component(Header.name, Header)
Vue.component(Field.name, Field)
Vue.component(Actionsheet.name, Actionsheet)
Vue.prototype.$Toast = Toast
