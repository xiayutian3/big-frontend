// import axios from 'axios'

// // ...

// // 导出axios实例
// export default axios.create()

// nuxt 封装的axios 拦截器 生命周期钩子- onError
export default function ({ $axios, redirect }) {
  $axios.onError((error) => {
    if (error.response.status === 500) {
      redirect('/sorry')
    }
  })
}
