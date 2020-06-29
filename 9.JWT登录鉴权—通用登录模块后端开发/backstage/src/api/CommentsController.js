// 评论列表Controller
import Comments from '../model/Comments'
// import Post from '../model/Post'
// import User from '../model/User'
// 引入自定义的对比函数(对比redis中存的验证码)
import { checkCode, getJWTPayload } from '../common/Utils'

class CommentsController {
  // 获取帖子对应的评论列表
  async getComments (ctx) {
    const params = ctx.query
    const tid = params.tid
    const page = params.page ? +params.page : 0
    const limit = params.limit ? +params.limit : 10
    // console.log(tid, typeof page, typeof limit)
    // 查询到的结果
    const result = await Comments.getCommentsList(tid, page, limit)
    // 查询到的总条数
    const total = await Comments.queryCount(tid)
    ctx.body = {
      code: 200,
      total,
      data: result,
      msg: '查询成功'
    }
  }

  async addComment (ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 对比客户端传过来的 sid code，是否与我们在redis中存的一致
    // 封装一个验证图片验证码的函数
    const result = await checkCode(sid, code) // 返回了一个promise对象,让它变成异步方法，才能正确返回结果
    if (!result) {
      // 验证码不通过
      ctx.body = {
        code: 500,
        msg: '图片验证码不正确，请检查！'
      }
      return
    }
    const newComment = new Comments(body)
    // 获取用户id,从请求头中获取
    const obj = await getJWTPayload(ctx.header.authorization)
    newComment.cuid = obj._id
    // 存在数据库中
    const comment = await newComment.save()
    ctx.body = {
      code: 200,
      data: comment,
      msg: '评论成功'
    }
  }
}
export default new CommentsController()
