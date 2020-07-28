// 这个是老师线上的接口地址
//  pro: 'http://api.dev.toimc.com:22000'

export default {
  baseUrl: {
    // doclever mock server
    // dev: 'http://localhost:36742',
    // 我们搭建的nodejs服务
    dev: 'http://localhost:3000',
    pro: 'http://www.toimc.com:12000'
  },
  // 定义请求头不需要添加token的路径
  publicPath: [/^\/public/, /^\/login/]
}
