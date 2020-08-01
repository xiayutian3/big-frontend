// 文章列表
import Post from '../model/Post'
import Links from '../model/Links'
import fs from 'fs'
import { v4 as uuid } from 'uuid'
import moment from 'dayjs'
import config from '@/config'
// 自定义判断路径创建目录
// import { dirExists } from '@/common/Utils'
// 也可以用现成的第三方库创建文件夹
import makeDir from 'make-dir'
// 引入自定义的对比函数(对比redis中存的验证码 checkCode)
import { checkCode, getJWTPayload } from '../common/Utils'
import User from '../model/User'
import UserCollect from '@/model/UserCollect'

class ContentController {
  // 获取文章列表
  async getPostList (ctx) {
    const body = ctx.query

    // *************************************
    // 测试数据
    // const post = new Post({
    //   title: 'test logs',
    //   content: 'test logs',
    //   catalog: 'logs',
    //   fav: 20,
    //   isEnd: '0',
    //   reads: '0',
    //   answer: '0',
    //   status: '0',
    //   isTop: '0',
    //   sort: '0',
    //   tags: [
    //     {
    //       name: '精华',
    //       class: ''
    //     }
    //   ]
    // })

    // const tmp = await post.save()
    // console.log('ContentController -> getPostList -> tmp', tmp)
    // *************************************

    const sort = body.sort ? body.sort : 'created'
    const page = body.page ? parseInt(body.page) : 0 // parseInt转化成浮点数，给后台
    const limit = body.limit ? parseInt(body.limit) : 20
    const options = {}

    if (typeof body.catalog !== 'undefined' && body.catalog !== '') {
      options.catalog = body.catalog
    }
    if (typeof body.isTop !== 'undefined' && body.isTop !== '') {
      options.isTop = body.isTop
    }
    if (typeof body.status !== 'undefined' && body.status !== '') {
      options.status = body.status
    }
    if (typeof body.isEnd !== 'undefined' && body.isEnd !== '') {
      options.isEnd = body.isEnd
    }
    if (typeof body.tag !== 'undefined' && body.tag !== '') {
      // mongoose的嵌套查询方法，$elemMatch: 查询某个对象数组中，对象的属性 name
      options.tags = { $elemMatch: { name: body.tag } }
    }
    const result = await Post.getList(options, sort, page, limit)
    const total = await Post.countList(options)
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取文章列表成功',
      total
    }
  }

  // 获取友情链接
  async getLinks (ctx) {
    const result = await Links.find({ type: 'links' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 获取温馨提示
  async getTips (ctx) {
    const result = await Links.find({ type: 'tips' })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 本周热议
  async getTopWeek (ctx) {
    const result = await Post.getTopWeek()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 上传图片
  // (后端存储图片，一般是给每个图片一个特定的名字，按时间日期来分文件夹存放在里边)
  async uploadImg (ctx) {
    // 获得上传的文件
    const file = ctx.request.files.file
    // 图片名称、图片格式、存储的位置、返回给前端-可以读取的路径
    // 拿到图片的格式
    const ext = file.name.split('.').pop()
    // 存储的位置， 图片名称
    const dir = `${config.uploadPath}/${moment().format('YYYYMMDD')}`

    // 判断路径是否存在，不存在则创建
    // await dirExists(dir)   //自己写的函数判断路径和创建文件夹
    await makeDir(dir) // 第三方库创建文件夹
    // 存储文件到指定的路径
    // 给文件一个唯一的名称（防止文件重名问题）
    const picname = uuid() // 生成唯一图片名称
    const destPath = `${dir}/${picname}.${ext}` // 图片路径
    // 创建文件读取流
    const reader = fs.createReadStream(file.path)
    // const reader = fs.createReadStream(file.path, {
    // 上传bufer的大小限制 1kb，不设置，默认64kb
    // highWaterMark: 1 * 1024
    // })
    // 创建写入文件流，写入文件到指定目录
    const upStream = fs.createWriteStream(destPath)
    // 返回的用户的图片路径
    const filePath = `/${moment().format('YYYYMMDD')}/${picname}.${ext}`

    // method 1（直接读取文件流，写入文件）
    reader.pipe(upStream)

    // methods 2
    // 要上传文件的总长度( stat.size)
    // const stat = fs.statSync(file.path)
    // // console.log('ContentController -> uploadImg -> stat', stat.size)
    // // 记录读取的长度
    // let totalLength = 0
    // // 监听读取数据
    // reader.on('data', function (chunk) {
    //   totalLength += chunk.totalLength
    //   // console.log('ContentController -> uploadImg -> totalLength', totalLength)
    //   if (upStream.write(chunk) === false) {
    //     // 如果写入失败，就停止流的读取
    //     reader.pause()
    //   }
    // })

    // // 监听 drain，书写完后，再继续读取流（因为上边暂停了）
    // reader.on('drain', function () {
    //   // 继续读取
    //   reader.resume()
    // })

    // // 当读取完成。就关闭掉写入流（因为写入很快完成）
    // reader.on('end', function () {
    //   upStream.end()
    // })
    ctx.body = {
      code: 200,
      msg: '图片上传成功',
      data: filePath
    }
  }

  // 发表新帖
  async addPost (ctx) {
    const { body } = ctx.request

    // 校验验证码的内容（时效性，有效性）
    const sid = body.sid
    const code = body.code
    // 对比客户端传过来的 sid code，是否与我们在redis中存的一致
    // 封装一个验证图片验证码的函数
    const result = await checkCode(sid, code) // 返回了一个promise对象,让它变成异步方法，才能正确返回结果
    if (result) {
      // 获得payload数据
      const obj = await getJWTPayload(ctx.header.authorization)
      // 判断用户的积分是否 > fav,否则，提示用户积分不足发帖
      // 用户积分足够的时候，新建Post，减除用户对应的积分
      const user = await User.findByID(obj._id)
      if (user.favs < body.fav) {
        ctx.body = {
          code: 501,
          msg: '积分不足'
        }
        return
      } else {
        // 发帖成功扣除相应的积分  $inc 在原有的基础上减去,
        await User.updateOne({ _id: obj._id }, { $inc: { favs: -body.fav } })
      }
      // 保存到数据库
      const newPost = new Post(body)
      newPost.uid = obj._id
      const result = await newPost.save()
      ctx.body = {
        code: 200,
        msg: '成功的保存文章',
        data: result
      }
    } else {
      /// 图片验证码验证失败
      ctx.body = {
        code: 500,
        msg: '图片验证码验证失败'
      }
    }
  }

  // 更新帖子
  async updatePost (ctx) {
    const { body } = ctx.request

    // 校验验证码的内容（时效性，有效性）
    const sid = body.sid
    const code = body.code
    // 对比客户端传过来的 sid code，是否与我们在redis中存的一致
    // 封装一个验证图片验证码的函数
    const result = await checkCode(sid, code) // 返回了一个promise对象,让它变成异步方法，才能正确返回结果
    if (result) {
      // 获得payload数据
      const obj = await getJWTPayload(ctx.header.authorization)
      // 判断帖子的作者是否为本人
      const post = await Post.findOne({ _id: body.tid })
      // 判断帖子是否结帖
      if (post.uid === obj._id && post.isEnd === '0') {
        const result = await Post.updateOne({ _id: body.tid }, body)
        if (result.ok === 1) {
          ctx.body = {
            code: 200,
            msg: '更新帖子成功',
            data: result
          }
        } else {
          ctx.body = {
            code: 500,
            msg: '编辑帖子，更新失败',
            data: result
          }
        }
      } else {
        ctx.body = {
          code: 401,
          msg: '没有操作的权限'
        }
      }
    } else {
      /// 图片验证码验证失败
      ctx.body = {
        code: 500,
        msg: '图片验证码验证失败'
      }
    }
  }

  // 获取文章详情
  async getPostDetail (ctx) {
    const params = ctx.query
    // 没有帖子标题的情况
    if (!params.tid) {
      ctx.body = {
        code: 500,
        msg: '文章标题为空'
      }
      return
    }

    // 查找返回相应的数据，（包括帖子中的用户信息）
    const post = await Post.findByTid(params.tid)
    // 判断是用户是否收藏文章 的字段 isFav
    let isFav = 0
    // 判断用户是否传递authorization的数据，即是否登录
    if (typeof ctx.header.authorization !== 'undefined' && ctx.header.authorization !== '') {
      // 获得payload数据
      const obj = await getJWTPayload(ctx.header.authorization)
      const userCollect = await UserCollect.findOne({
        uid: obj._id,
        tid: params.tid
      })
      if (userCollect && userCollect.tid) {
        isFav = 1
      }
    }
    // 操作文章，给文章添加收藏字段
    const newPost = post.toJSON()
    newPost.isFav = isFav
    // 更新文章阅读记数  $in 累加 1
    const result = await Post.updateOne({ _id: params.tid }, { $inc: { reads: 1 } })
    if (post._id && result.ok === 1) {
      ctx.body = {
        code: 200,
        data: newPost,
        msg: '查询文章详情'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '获取文章详情失败'
      }
    }
    // rename方法,把uid改成user字段
    // const result = rename(post.toJSON(), 'uid', 'user')
  }

  // 获取用户发帖记录
  async getPostByUid (ctx) {
    const params = ctx.query
    // 获得payload数据
    const obj = await getJWTPayload(ctx.header.authorization)
    const result = await Post.getListByUid(obj._id, params.page, params.limit ? parseInt(params.limit) : 10)
    const total = await Post.countByUid(obj._id)
    // mongdb查出的数据经过 toJSON 后才能操作
    // const newResult = result.toJSON()
    // newResult.total = total
    if (result.length > 0) {
      ctx.body = {
        code: 200,
        data: result,
        total,
        msg: '查询列表成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '查询列表失败'
      }
    }
  }

  // 获取用户收藏的帖子
  async collect (ctx) {
    const params = ctx.query
    // 获得payload数据
    const obj = await getJWTPayload(ctx.header.authorization)
    const result = await UserCollect.getListByUid(obj._id, params.page, params.limit ? parseInt(params.limit) : 10)
    const total = await UserCollect.countByUid(obj._id)
    if (result.length > 0) {
      ctx.body = {
        code: 200,
        data: result,
        total,
        msg: '查询列表成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '查询列表失败'
      }
    }
  }

  // 删除发帖记录
  async deletePostByUid (ctx) {
    const params = ctx.query
    // 获得payload数据
    const obj = await getJWTPayload(ctx.header.authorization)
    // 判断发帖的作者是不是本人
    const post = await Post.findOne({ uid: obj._id, _id: params.tid })
    // 已结帖的文章是不允许删除的（能删除的是没有结帖的帖子），删除后，积分是不归还给用户的
    if (post.id === params.tid && post.isEnd === '0') {
      // 删除操作
      const result = await Post.deleteOne({ _id: params.tid })
      if (result.ok === 1) {
        ctx.body = {
          code: 200,
          msg: '删除成功'
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '执行删除失败！'
        }
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '删除失败，无权限！'
      }
    }
  }
}

export default new ContentController()
