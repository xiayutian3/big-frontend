import axios from 'axios'

// 环境的切换
let baseURL = ''
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:3000'
} else if (process.env.NODE_ENV === 'debug') {
  baseURL = 'https://www.ceshi.com'
} else if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://www.production.com'
}

const instance = axios.create({
  baseURL,
  timeout: 5 * 1000
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default instance
