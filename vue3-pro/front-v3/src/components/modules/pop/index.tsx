
// vue3注册插件

import { App, createApp } from 'vue'
import PopComponent from './Pop.vue'

// 定义使用的方法
export const popup = (type: string, msg: string) => {
  // 1创建根节点
  const root = document.createElement('div')
  document.body.appendChild(root)
  // 2 添加poup组件到body中
  const options = {
    type,
    msg,
    isShow: true
  }
  // 创建popup，vue组件（扩展原来的PopComponent vue组件）
  const popupCom = createApp({
    setup () {
      // 卸载节点（销毁节点）
      const unmount = () => {
        // console.log('popup组件销毁')
        document.body.removeChild(root)
      }
      return () => <PopComponent {...{ ...options, unmount }} />
    }
  })
  // 挂在到创建的根节点上
  popupCom.mount(root)
}

// 创建插件
export default {
  install: (app: App) => {
    app.config.globalProperties.$popup = popup
  },
  popup
}

// ********************************************************************************************
// // vue2中的注册插件（js）

// import PopComponent from './Pop.vue'
// const Pop = {}
// Pop.install = (Vue) => {
//   // 注册pop组件
//   const PopConstructor = Vue.extend(PopComponent)
//   const instance = new PopConstructor()
//   instance.$mount(document.createElement('div'))
//   document.body.appendChild(instance.$el)

//   // 添加实例方法，以供全局进行调用
//   Vue.prototype.$pop = (type, msg) => {
//     instance.type = type
//     instance.msg = msg
//     instance.isShow = true
//   }
// }
// export default Pop
