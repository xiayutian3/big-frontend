// 中间件（获取用户id）
import { getJWTPayload } from '../common/Utils'

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
    }
  }

  await next()
}
