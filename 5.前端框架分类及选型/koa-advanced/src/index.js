// const Koa = require('koa')
// const path = require('path')
import Koa from 'koa'
import path from 'path'
//支持json form  文件 传输
import koaBody from 'koa-body'
//json格式化美化
import jsonutil from 'koa-json'
//处理跨域
import cors from '@koa/cors'
//koa通信安全头
const helmet = require("koa-helmet");
//设置静态资源目录
const statics = require('koa-static')
// const router = require('./routes/routes')

//用es6语法导出后，也要用es6语法来接收
import router from './routes/routes'
//对koa插件进行整合
import compose from 'koa-compose'
// 生产环境下，对中间件进行压缩
import compress from 'koa-compress'
const isDevMode = process.env.NODE_ENV === 'production'?false:true

const app = new Koa()
// app.use(helmet())
// app.use(router())
// app.use(statics(path.join(__dirname,'../public')))

//koa-compose对插件进行整合
const middleware = compose([
  koaBody(),
  statics(path.join(__dirname,'../public')),
  cors(),
  jsonutil({pretty:false,param:'pretty'}),
  helmet()
])

if(!isDevMode){
  app.use(compress())
}

app.use(middleware)
app.use(router())

app.listen(3000,()=>{
  console.log('server is starting')
})