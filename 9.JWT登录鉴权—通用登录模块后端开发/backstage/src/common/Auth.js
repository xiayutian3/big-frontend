// 中间件（获取用户id）
import { getJWTPayload } from '../common/Utils'

// 获取redis中的超级管理员数据
import { getValue } from '@/config/RedisConfig'

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
      } else {
        ctx.isAdmin = false
      }
      // console.log(' ctx.isAdmin', ctx.isAdmin)
    }
  }

  await next()
}
