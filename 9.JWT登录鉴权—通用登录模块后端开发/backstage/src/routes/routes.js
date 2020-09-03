// 合并路由插件
const combineRoutes = require('koa-combine-routers')

// const aroutes = require('./aRouter')
// const broutes = require('./bRouter')

// module.exports = combineRoutes(
//   aroutes,
//   broutes
// )

// *********************************************************************
// 使用es6语法改写 + 合并路由插件
// import combineRoutes from 'koa-combine-routers'
// import publicRouter from './publicRouter'
// import loginRouter from './LoginRouter'
// import userRouter from './userRouter'

// export default combineRoutes(
// publicRouter,
// loginRouter,
// userRouter
// )

// **************************************************************************
// 使用webpack管理依赖功能,加载目录中的router中间件
const moduleFiles = require.context('./modules', true, /\.js$/)
// 拿到router的数组，reduce方法取拼接 koa-combine-router所需的数据结构 object []
const modules = moduleFiles.keys().reduce((items, path) => {
  const value = moduleFiles(path)
  // console.log('value', value)
  items.push(value.default)
  return items
}, [])
// console.log('modules', modules)

export default combineRoutes(
  modules
// publicRouter,
// loginRouter,
// userRouter
)
