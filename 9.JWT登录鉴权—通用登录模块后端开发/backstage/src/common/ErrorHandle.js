// 添加收集错误日志服务 koa-log4
import log4js from '@/config/Log4'
// 持久化错误日志，保存到数据库
import ErrorRecord from '@/model/ErrorRecord'
import User from '@/model/User'
import { isDevMode } from '@/config/index'

const logger = log4js.getLogger('error')

// 对 koa-jwt鉴权做错误处理(jwt校验处理中间件,例如：数据库查找不到这个用户，mongoose程序报错，错误状态401)（统一的错误处理，针对鉴权，或者其它的错误处理）
export default async (ctx, next) => {
  try {
    // 程序正常运行
    await next()

    // 1.收集用户错误的请求路径的日志-》会造成大量的垃圾数据
    // 2.主动判断，并收集特定的接口请求-》regex -》path，status，params

    // 在开发环境收集 isDevMode 才会记录***到数据库***，提供给开发人员分析
    if (ctx.status !== 200 && isDevMode) {
      // 收集状态码不等于200的，才会进入下边日志收集
      const codeMessage = {
        // 200: '服务器成功返回请求的数据。',
        201: '新建或修改数据成功。',
        202: '一个请求已经进入后台排队（异步任务）。',
        204: '删除数据成功。',
        400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
        401: '用户没有权限（令牌、用户名、密码错误）。',
        403: '用户得到授权，但是访问是被禁止的。',
        404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
        405: '请求方法不存在，请检查路由！',
        406: '请求的格式不可得。',
        410: '请求的资源被永久删除，且不会再得到的。',
        422: '当创建一个对象时，发生一个验证错误。',
        500: '服务器发生错误，请检查服务器。',
        502: '网关错误。',
        503: '服务不可用，服务器暂时过载或维护。',
        504: '网关超时。'
      }
      ctx.throw({
        code: ctx.status,
        message: codeMessage[ctx.status]
      })
    }
  } catch (err) {
    // 收集错误日志  url  方法 状态码 错误栈( 可以区分生产和开发环境捕获错误)
    logger.error(`${ctx.url} ${ctx.method} ${ctx.status} ${err.stack}`)

    let user = ''
    if (ctx._id) {
      user = await User.findOne({ _id: ctx._id })
    }
    // 保存错误日志到数据库
    await ErrorRecord.create({
      message: err.message,
      code: ctx.response.status,
      method: ctx.method,
      path: ctx.path,
      param: ctx.method === 'GET' ? ctx.query : ctx.request.body,
      username: user.username,
      stack: err.stack

    })
    if (err.status == 401) {
      ctx.status = 401
      ctx.body = {
        code: 401,
        msg: 'Protected resource, use Authorization header to get access\n'
      }
    } else {
      // chrome浏览器调试要打断点 debugger
      // debugger

      // throw err;  //这个方式提示到哪个js文件多少行出了问题，调试方便
      // 或者
      // 下面这种方式，像上边这个方式精确的提示信息放在了 err.stack里边，我们可以使用object.assign,来在开发环境中显示
      ctx.status = err.status || 500
      // ctx.body = {
      //   code:500,
      //   msg:err.message
      // }

      // 换成这样
      ctx.body = Object.assign({
        code: 500,
        msg: err.message
      }, process.env.NODE_ENV === 'dev' ? { stack: err.stack } : {})
    }
  }
}
