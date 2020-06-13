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
    ctx.body = {
      code: 200,
      data: result,
      msg: '获取文章列表成功'
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
}

export default new ContentController()
