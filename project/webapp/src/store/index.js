import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// webpack 自带读取文件 当前目录的modules的文件 .js结尾
const files = require.context('./modules', false, /\.js$/)
// console.log('files', typeof files) // 函数
// console.log('files.keys()', files.keys()) // ["./common.js", "./user.js"]

const modules = {}

// 动态加载vuex modules
files.keys().forEach(key => {
  // 除去文件 ./ 和 .js 后缀名    files(key).default 获取文件默认的暴露内容
  modules[key.replace(/(\.\/|\.js)/g, '')] = files(key).default
})
// console.log('modules', modules)
// {
//   common: {state: {…}, mutations: {…}}
//   user:{
//     state: {…}
//     mutations: {SET_SID: ƒ, SET_TOKEN: ƒ, SET_USER: ƒ, SET_ISLOGIN: ƒ, SET_HIDE: ƒ, …}
//     getters: {user: ƒ, isLogin: ƒ, token: ƒ, sid: ƒ, isHide: ƒ}
//     actions: {message: ƒ, getCode: ƒ, login: ƒ}
//   }
// }

export default new Vuex.Store({
  modules
})
