// 添加收集console日志服务 koa-log4  -》 中间件
import log4js from '@/config/Log4'
// out类型   输出到控制台
// const logger = log4js.getLogger('out')
// 输入到application中
const loggerApp = log4js.getLogger('application')

export default async (ctx, next) => {
  const start = Date.now()
  await next()
  const resTime = Date.now() - start

  // app级别的日志，请求时间太长，就记录(大于1秒)  判断系统的执行效率
  if (resTime / 1000 > 1) {
    loggerApp.warn(`[${ctx.method}] - ${ctx.url} - time:${resTime / 1000}`)
  }

  // info类型  [2020-09-23T22:47:38.231] [INFO] out - [GET] - /public/getCaptcha?sid=127e7477-fe7f-4b34-9c1e-09542fd43d4c - time:0.014
  // logger.info(`[${ctx.method}] - ${ctx.url} - time:${resTime / 1000}`)

  // warn类型  [2020-09-23T22:47:38.231] [INFO] out - [GET] - /public/getCaptcha?sid=127e7477-fe7f-4b34-9c1e-09542fd43d4c - time:0.014
  // logger.warn(`[${ctx.method}] - ${ctx.url} - time:${resTime / 1000}`)
  // loggerApp.warn(`[${ctx.method}] - ${ctx.url} - time:${resTime / 1000}`)

  // [2020-09-23T22:48:26.457] [INFO] out -    后边没有东西
  // logger.log(`[${ctx.method}] - ${ctx.url} - time:${resTime / 1000}`)
}
