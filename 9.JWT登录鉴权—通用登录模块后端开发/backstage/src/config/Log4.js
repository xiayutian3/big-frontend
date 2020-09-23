
// 日志打印
import log4js from 'koa-log4'

log4js.configure({
  appenders: {
    access: {
      type: 'dateFile', // 类型
      filename: 'logs/access.log', // 文件名
      pattern: '-yyyy-MM-dd' // 模式
    },
    application: {
      type: 'dateFile',
      filename: 'logs/app.log',
      pattern: '-yyyy-MM-dd'
    },
    error: {
      type: 'dateFile',
      filename: 'logs/error.log',
      pattern: '-yyyy-MM-dd'
    },
    out: { /// / out类型   输出到控制台
      type: 'console'
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    access: { appenders: ['access'], level: 'info' },
    application: { appenders: ['application'], level: 'warn' },
    error: { appenders: ['error'], level: 'warn' }
  }
})

export default log4js
