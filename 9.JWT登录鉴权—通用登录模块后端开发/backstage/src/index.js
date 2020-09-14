// const Koa = require('koa')
// const path = require('path')
import Koa from 'koa'
import path from 'path'
// koa token 鉴权(不能产生token)
import JWT from 'koa-jwt'
// 支持json form  文件 传输
import koaBody from 'koa-body'
// json格式化美化
import jsonutil from 'koa-json'
// 处理跨域
import cors from '@koa/cors'
// const router = require('./routes/routes')

// 用es6语法导出后，也要用es6语法来接收
import router from './routes/routes'
// 对koa插件进行整合
import compose from 'koa-compose'
// 生产环境下，对中间件进行压缩
import compress from 'koa-compress'
// 配置文件
import config from './config/index'
// koa-jwt鉴权 错误处理中间件
import errorHandle from './common/ErrorHandle.js'
// 引入websocket服务
import WebSocketServer from './config/WebSocket'
// 引入自定义的中间机件
import auth from '@/common/Auth'

// koa通信安全头
const helmet = require('koa-helmet')
// 设置静态资源目录
const statics = require('koa-static')

const isDevMode = process.env.NODE_ENV !== 'production'

const app = new Koa()
// 使用websocket服务
const ws = new WebSocketServer()
ws.init()
// 绑定websocket服务到全局对象上
global.ws = ws

// app.use(helmet())
// app.use(router())
// app.use(statics(path.join(__dirname,'../public')))

// 定义公共路径，不需要jwt鉴权,排除一些不需要鉴权的路径，如 /public ,/\/login/
const jwt = JWT({ secret: config.JWT_SECRET }).unless({ path: [/^\/public/, /\/login/] })

// koa-compose对插件进行整合
const middleware = compose([
  koaBody({
    multipart: true, // 支持文件上传
    formidable: {
      keepExtensions: true, // 保持文件的后缀
      maxFieldsSize: 5 * 1024 * 1024 // 上传文件的最大限制
    },
    onError: (err) => { // 错误处理回调
      console.log('koa-body err', err)
    }
  }),
  statics(path.join(__dirname, '../public')),
  cors(),
  jsonutil({ pretty: false, param: 'pretty' }),
  helmet(),
  errorHandle,
  jwt,
  auth
])

if (!isDevMode) {
  app.use(compress())
}
app.use(middleware)
app.use(router())

app.listen(3000, () => {
  console.log('server is starting')
})
