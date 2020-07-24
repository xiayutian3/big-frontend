// 注册自定义vue alert插件
import AlertComponent from './Alert.vue'

const Alert = {}

Alert.install = function (Vue) {
  // extend vue的插件机制，绑定到vue的实例上
  const AlertConstructor = Vue.extend(AlertComponent)
  const instance = new AlertConstructor()
  instance.$mount(document.createElement('div'))
  document.body.appendChild(instance.$el)

  // 4. 添加实例方法
  // 封装 alert 组件
  Vue.prototype.$alert = function (msg) {
    // 逻辑...
    instance.type = 'alert'
    instance.msg = msg
    instance.isShow = true
  }

  // 封装confirm组件
  Vue.prototype.$confirm = function (msg, sucess, cancel) {
    // 逻辑...
    instance.type = 'confirm'
    instance.msg = msg
    instance.isShow = true
    if (typeof sucess !== 'undefined') {
      instance.sucess = sucess
    }
    if (typeof cancel !== 'undefined') {
      instance.cancel = cancel
    }
  }
}

export default Alert
