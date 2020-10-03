import Vue from 'vue'

// 动态注册全局组件

// webpack 自带读取文件 当前目录的@/components的文件 index.vue结尾  ,第二个参数 是否读取子目录，true-递归执行子目录
const componentsContext = require.context('@/components', true, /index.vue$/)
// console.log('componentsContext', componentsContext)

componentsContext.keys().forEach(component => {
  // files(key).default 获取文件默认的暴露内容
  const componentConfig = componentsContext(component).default
  // console.log('componentConfig', componentConfig)
  // 全局注册组件
  Vue.component(componentConfig.name, componentConfig)
})
