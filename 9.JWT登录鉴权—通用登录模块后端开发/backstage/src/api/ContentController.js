// 文章列表
import Post from '../model/Post'

class ContentController {
  // 获取文章列表
  async getPostList (ctx) {
    const body = ctx.query

    // *************************************
    // 测试数据
    // const post = new Post({
    //   title: 'test title share',
    //   content: 'test content share',
    //   catalog: 'share',
    //   fav: 20,
    //   isEnd: '0',
    //   reads: '0',
    //   answer: '0',
    //   status: '0',
    //   isTop: '0',
    //   sort: '0',
    //   tags: [
    //     // {
    //     //   name: '精华',
    //     //   class: ''
    //     // }
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
}

export default new ContentController()
