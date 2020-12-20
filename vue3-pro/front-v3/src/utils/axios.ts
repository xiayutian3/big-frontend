// 封装axios的请求，返回重新封装的数据格式
// 对错误的统一处理

// ****************第一种方式封装axios*************
// import axios from 'axios'
// import config from '@/config'
// import errorHandle from './errorHandle'

// 创建实例
// var instance = axios.create({
//   baseURL: process.env.NODE_ENV === 'development' ? config.baseUrl.dev : config.baseUrl.pro,
//   headers: {
//     'Content-Type': 'application/json;charset=utf-8'
//   },
//   timeout: 1000 * 10
// })

// // 添加请求拦截器
// instance.interceptors.request.use(function (config) {
//   // 在发送请求之前做些什么
//   console.log('config:' + config)
//   return config
// }, function (error) {
//   // 对请求错误做些什么
//   errorHandle(error)
//   return Promise.reject(error)
// })

// // 添加响应拦截器
// instance.interceptors.response.use(function (response) {
//   // 对响应数据做点什么
//   console.log('response:' + response)
//   if (response.status === 200) {
//     // return response.data
//     // 跟上边直接返回都是一样的（也可以不加Promise.resolve）
//     return Promise.resolve(response.data)
//   } else {
//     return Promise.reject(response)
//   }
// }, function (error) {
//   // 对响应错误做点什么

//   errorHandle(error)
//   debugger
//   return Promise.reject(error)
// })
// export default instance

// ***************************************************************************************

// ****************第2种方式封装axios*************
// 以class类来实现axios实例化

// yarn add @types/axios -D  //安装声明类型
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, Canceler } from 'axios'
import errorHandle from './errorHandle'
import store from '@/store'
// 定义请求头不需要添加token的路径
import publicConfig from '@/config'
// 自定义 promise interface
import { HttpResponse } from '@/common/interface'

// 取消请求函数
const CancelToken = axios.CancelToken

class HttpRequest {
  private baseUrl: string;
  private pending: Record<string, Canceler>
  constructor (baseUrl: string) {
    this.baseUrl = baseUrl
    // 全局的变量，用于取消请求
    this.pending = {}
  }

  // 获取axios实例的配置
  getInsideConfig () {
    const config = {
      baseURL: this.baseUrl,
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      timeout: 1000 * 10
    }
    return config
  }

  // 取消请求函数
  removePending (key: string, isRequest = false) {
    if (this.pending[key] && isRequest) {
      this.pending[key]('取消重复请求')
    }
    delete this.pending[key] // 防止内存泄漏,还有删除对象上没有的属性不会报错
  }

  // 设定拦截器
  interceptors (instance: AxiosInstance) {
    // 添加请求拦截器
    instance.interceptors.request.use((config) => {
      // 判断是否是公共路径，是的话，就不要添加token
      let isPublic = false
      publicConfig.publicPath.map(path => {
        isPublic = isPublic || path.test(config.url || '')
      })
      // 添加token
      const token = store.state.token
      if (!isPublic && token) {
        config.headers.Authorization = 'Bearer ' + token
      }

      // console.log('config:' + JSON.stringify(config))
      // 取消请求的配置
      const key = config.url + '&' + config.method
      this.removePending(key, true)
      config.cancelToken = new CancelToken((c: any) => {
        this.pending[key] = c
      })
      // 在发送请求之前做些什么
      return config
    }, (error: Error) => {
      // 对请求错误做些什么
      errorHandle(error)
      return Promise.reject(error)
    })

    // 添加响应拦截器
    instance.interceptors.response.use((response) => {
      // console.log('response:' + JSON.stringify(response))
      // 对响应数据做点什么

      // 正常的请求，关于取消请求的（数据回来了，不需要取消请求了，但是要删除请求对应的key）
      const key = response.config.url + '&' + response.config.method
      this.removePending(key)

      if (response.status === 200) {
        // return response.data
        // 跟上边直接返回都是一样的（也可以不加Promise.resolve）
        return Promise.resolve(response.data)
      } else {
        return Promise.reject(response)
      }
    }, (error: Error) => {
      // 对响应错误做点什么

      errorHandle(error)
      // debugger
      return Promise.reject(error)
    })
  }

  // 创建实例
  request (options: AxiosRequestConfig) {
    const instance = axios.create()
    // 整合配置
    const newOptions = Object.assign(this.getInsideConfig(), options)
    this.interceptors(instance)

    // 实际上是调用request方法，然后直接省略调用，创建axios实例
    // return instance.request(newOptions)
    return instance(newOptions)
  }

  // 自定义接口返回的类型 | | Promise<any>  或者定义interface  ： Promise<HttpResponse>
  get (url: string, config?: AxiosRequestConfig): Promise<AxiosResponse> | Promise<HttpResponse> {
    const options = Object.assign({
      method: 'get',
      url: url
    }, config)
    return this.request(options)
  }

  // 自定义接口返回的类型 | | Promise<any>  或者定义interface  ： Promise<HttpResponse>
  post (url: string, data?: any): Promise<AxiosResponse>| Promise<HttpResponse> {
    return this.request({
      method: 'post',
      url: url,
      data: data
    })
  }
}

export default HttpRequest
