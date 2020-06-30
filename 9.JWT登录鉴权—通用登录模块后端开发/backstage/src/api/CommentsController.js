// 评论列表Controller
import Comments from '../model/Comments'
import Post from '../model/Post'
import User from '../model/User'
// 引入自定义的对比函数(对比redis中存的验证码)
import { checkCode, getJWTPayload } from '../common/Utils'

// 判断用户是否可以回贴，是否被禁言(是否被禁用，0-正常，1-禁言，2-账号禁用)
const canReply = async (ctx) => {
  let result = false
  // 获取用户id,从请求头中获取
  const obj = await getJWTPayload(ctx.header.authorization)
  if (typeof obj._id === 'undefined') {
    return result
  } else {
    const user = await User.findByID(obj._id)
    if (user.status === '0') {
      // 属于正常情况。可以回贴
      result = true
    }
    return result
  }
}

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

  // 添加评论
  async addComment (ctx) {
    // 判断用户是否可以回贴
    const check = await canReply(ctx)
    if (!check) {
      ctx.body = {
        code: 500,
        msg: '用户已经被禁言'
      }
      return
    }

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

  // 编辑评论
  async updateComment (ctx) {
    // 判断用户是否可以回贴
    const check = await canReply(ctx)
    if (!check) {
      ctx.body = {
        code: 500,
        msg: '用户已经被禁言'
      }
      return
    }
    const { body } = ctx.request
    // 更新评论
    const result = await Comments.updateOne({ _id: body.cid }, { $set: body })
    ctx.body = {
      code: 200,
      msg: '修改成功',
      data: result
    }
  }

  // 采纳为最佳答案
  async setBest (ctx) {
    // （1）对用户权限的判断，post uid -> header id
    // 获取用户id,从请求头中获取
    const obj = await getJWTPayload(ctx.header.authorization)
    if (typeof obj === 'undefined') {
      ctx.body = {
        code: 401,
        msg: '用户未登录，或者用户未授权'
      }
      return
    }
    const params = ctx.query
    // 通过文章tid查找这篇文章
    const post = await Post.findOne({ _id: params.tid })
    console.log(typeof post.uid)
    // 判断是不是作者本人，帖子为未结帖状态
    // post.uid如果为填充的数据，typeof post.uid，typeofpost.uid._id 都是object类型，不能直接判断相等
    if (post.uid === obj._id && post.isEnd === '0') {
      // 说明这是作者本人，帖子为未结帖状态，可以设置isBest，采纳为最佳答案

      // 更新文章结帖，以为已采纳为最佳答案
      const result = await Post.updateOne({ _id: params.tid }, { $set: { isEnd: '1' } })
      // 更新最佳答案评论
      const result1 = await Comments.updateOne({ _id: params.cid }, { $set: { isBest: '1' } })

      if (result.ok === 1 && result1.ok === 1) {
        // （2）把积分值给采纳的用户

        // 查找该条评论
        const comment = await Comments.findByCid(params.cid)
        // 从该条评论上找到评论用户的信息，更新用户的积分, $inc  递增
        const result2 = await User.updateOne({ _id: comment.cuid }, { $inc: { favs: parseInt(post.fav) } })
        if (result2.ok === 1) {
          ctx.body = {
            code: 200,
            msg: '设置成功',
            data: result2
          }
        } else {
          ctx.body = {
            code: 500,
            msg: '设置最佳答案-更新用户失败'
          }
        }
      } else {
        ctx.body = {
          code: 500,
          mag: '设置失败',
          data: { ...result, ...result1 }
        }
      }
    } else {
      // 设置不成功的情况
      ctx.body = {
        code: 500,
        msg: '帖子已结帖，无法重复设置'
      }
    }
  }
}
export default new CommentsController()
