// 对 koa-jwt鉴权做错误处理(jwt校验处理中间件,例如：数据库查找不到这个用户，mongoose程序报错，错误状态401)（统一的错误处理，针对鉴权，或者其它的错误处理）
export default (ctx, next) => {
  return next().catch((err) => {
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
  })
}
