//合并路由插件
// const combineRoutes = require('koa-combine-routers')

// const aroutes = require('./aRouter')
// const broutes = require('./bRouter')

// module.exports = combineRoutes(
//   aroutes,
//   broutes
// )

//使用es6语法改写
import combineRoutes from 'koa-combine-routers'
import publicRouter from './publicRouter'
export default combineRoutes(publicRouter)