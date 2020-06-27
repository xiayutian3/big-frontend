// 评论列表Controller
import Comments from '../model/Comments'
// import Post from '../model/Post'
// import User from '../model/User'

class CommentsController {
  // 获取帖子对应的评论列表
  async getComments (ctx) {
    const params = ctx.query
    const tid = params.tid
    const page = params.page ? params.page : 0
    const limit = params.limit ? params.limit : 10
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
}
export default new CommentsController()
