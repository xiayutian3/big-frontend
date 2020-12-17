import { App, createApp } from 'vue'
import AlertComponent from './Alert.vue'

export const alert = (msg: string) => {
  // 1. 添加alert 根点
  const root = document.createElement('div')
  document.body.appendChild(root)
  // 2.添加Alert组件 -》 props
  const options = {
    type: 'alert',
    msg
  }
  const alertCom = createApp({
    setup () {
      // 卸载节点
      const unmount = () => {
        // alertCom.unmount(root)
        document.body.removeChild(root)
      }

      // jsx,tsx 语法可以直接返回 AlertComponent组件，（ts,js不行）
      return () => <AlertComponent {...{ ...options, unmount }} />
    }
  })
  // 挂在到节点上
  alertCom.mount(root)
}

export const confirm = (
  msg: string,
  sucess: any,
  cancel: any
) => {
  // 1. 添加confirm 根点
  const root = document.createElement('div')
  document.body.appendChild(root)
  // 2.添加confirm组件 -》 props
  const options = {
    type: 'confirm',
    msg,
    sucess,
    cancel
  }
  const confirmCom = createApp({
    setup () {
      // 卸载节点
      const unmount = () => {
        // alertCom.unmount(root)
        document.body.removeChild(root)
      }

      // jsx,tsx 语法可以直接返回 AlertComponent组件，（ts,js不行）
      return () => <AlertComponent {...{ ...options, unmount }} />
    }
  })
  // 挂在到节点上
  confirmCom.mount(root)
}

// 创建插件
export const AlertConfirmComponent = {
  install: (app: App) => {
    // alert 组件
    app.config.globalProperties.$alert = alert

    // confirm 组件
    app.config.globalProperties.$confirm = confirm
  }
}
