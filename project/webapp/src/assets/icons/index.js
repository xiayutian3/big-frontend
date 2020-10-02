import Vue from 'vue'
import SvgIcon from '@/components/SvgIcon'

// 注册全局 svg
Vue.component('svg-icon', SvgIcon)

// webpack 自带读取文件 当前目录的svg的文件 .svg结尾
const req = require.context('./svg', false, /\.svg$/)
// console.log('req', typeof req) // 函数
// console.log('req.keys()', req.keys()) // ["./xx.svg", "./xx.svg",...]

// 类似于遍历所有的svg ["./xx.svg",...],把他们变成一个个模块导出
const requireAll = requireContext => requireContext.keys().map(requireContext)

requireAll(req)
// console.log('reqAll', requireAll(req))
