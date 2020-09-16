// 中间件（获取用户id）
import { getJWTPayload } from '../common/Utils'

// 获取redis中的超级管理员数据
import { getValue } from '@/config/RedisConfig'

// 引入公共路径
import config from '@/config/index'
import AdminController from '@/api/AdminController'

export default async (ctx, next) => {
  const headers = ctx.header.authorization
  // console.log('headers', headers)
  // 因为我们有些路由是没有添加headers的信息的（添加了headers的才获取）
  if (typeof headers !== 'undefined') {
    // 获取用户id,从请求头中获取
    const obj = await getJWTPayload(ctx.header.authorization)
    if (obj._id) {
      // 把id挂载到ctx上下文上。，方便使用
      ctx._id = obj._id

      // 超级管理员属性设置
      const admins = JSON.parse(await getValue('admin'))
      // console.log('admins', admins)
      if (admins.includes(obj._id)) {
        ctx.isAdmin = true
        await next()
        return
      } else {
        ctx.isAdmin = false
      }
      // console.log(' ctx.isAdmin', ctx.isAdmin)
    }
  }

  // 如果不是超级管理员
  // 1.过滤公共路径
  const { publicPath } = config
  if (publicPath.some(item => item.test(ctx.url))) {
    await next()
    return
  }
  // 2.根据用户的roles-》menus-》 operations
  const operations = await AdminController.getOperations(ctx)
  // 3.判断用户的请求路径是否在operations里边，如果在放行，否者禁止访问
  // api接口  operations
  if (operations.includes(ctx.url)) {
    await next()
  } else {
    ctx.throw(401)
  }
}
