import mongoose from '../config/DBHelpler'
import moment from 'dayjs'

const Schema = mongoose.Schema

const CommentsSchema = new Schema({
  tid: { type: String, ref: 'post' },
  uid: { type: String, ref: 'users' },
  cuid: { type: String, ref: 'users' },
  content: { type: String },
  created: { type: Date },
  hands: { type: Number, default: 0 },
  status: { type: String, default: '1' },
  isRead: { type: String, default: '0' },
  isBest: { type: String, default: '0' }
}, { toJSON: { virtuals: true } })

CommentsSchema.pre('save', function (next) {
  this.created = new Date()
  next()
})

CommentsSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next(error)
  }
})

CommentsSchema.statics = {
  // 通过帖子id去查评论
  findByTid: function (id) {
    return this.find({ tid: id })
  },
  // 通过一条评论的id去查这条评论
  findByCid: function (id) {
    return this.findOne({ _id: id })
  },
  getCommentsList: function (id, page, limit) {
    return this.find({ tid: id }).populate({
      path: 'cuid', //  填充 指向user表
      select: '_id name pic isVip',
      match: { status: { $eq: '0' } } // status 查找匹配未被禁用的用户的帖子返回，0为被禁用，1禁用
    }).populate({
      path: 'tid', // 填充 指向post表
      select: '_id title status' // status 是否打开或者关闭回复
    }).skip(page * limit).limit(limit) // 分页操作
  },
  queryCount: function (id) {
    return this.find({ tid: id }).countDocuments() // mogoose自带的方法countDocuments，计算查到的条数
  },
  getCommetsPublic: function (id, page, limit) {
    return this.find({ cuid: id })
      .populate({
        path: 'tid',
        select: '_id title'
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: -1 })
  },
  getMsgList: function (id, page, limit) {
    return this.find({
      uid: id,
      cuid: { $ne: id }, // cuid 不等于 uid ，$ne 不等于 （排除评论是作者本人）
      isRead: { $eq: '0' }, // 未读状态， $eq 是等于
      status: { $eq: '1' } // 是否显示， $eq 是等于
    })
      .populate({
        path: 'tid',
        select: '_id title content'
      })
      .populate({
        path: 'uid',
        select: '_id name'
      })
      .populate({
        path: 'cuid',
        select: '_id name'
      })
      .skip(limit * page)
      .limit(limit)
      .sort({ created: -1 })
  },
  getTotal: function (id) {
    // 查询作者，没有阅读的评论条数
    // isRead: '0'未阅读的，status: '1'可以显示的  .countDocuments() 计数  mongoose自带方法
    return this.find({ uid: id, isRead: '0', status: '1' }).countDocuments()
  },
  getCommentsOptions: function (options, page, limit) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        // radio
        query[options.item] = options.search
      }

      /**
       * 创建视图：
       * db.createView('comments_users', 'comments', [
          { '$lookup': {
              from: 'posts', let: { pid: { '$toObjectId': '$tid' } },
              pipeline: [ { '$match': { '$expr': { '$eq': [ '$_id', '$$pid' ] } } },
              { '$project': { _id: 1, uid: 1, title: 1 } } ], as: 'tid' } },
              { '$replaceRoot': { newRoot: { '$mergeObjects': [ { '$arrayElemAt': [ '$tid', 0 ] }, '$$ROOT' ] } } },
              { '$unwind': '$tid' },
              { '$addFields': { userId: { '$toObjectId': '$uid' } } },
              { '$lookup': {
                  from: 'users', localField: 'userId', foreignField: '_id', as: 'uid' } },
              { '$unwind': '$uid' }, { '$addFields': { fuserId: { '$toObjectId': '$cuid' } } },
              { '$lookup': { from: 'users', localField: 'fuserId', foreignField: '_id', as: 'cuid' } },
              { '$unwind': '$cuid' },
          { '$project': { tid: 1, cuid: { name: 1, _id: 1 }, uid: { name: 1, _id: 1 }, isBest: 1, status: 1, content: 1, created: 1 } },
          { '$sort': { created: -1 } }],
          {})
       */
      if (['uid', 'tid', 'cuid'].includes(options.item)) {
        let arr = [
          {
            $lookup: {
              from: 'posts',
              let: { pid: { $toObjectId: '$tid' } },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },
                { $project: { _id: 1, uid: 1, title: 1 } }
              ],
              as: 'tid'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ $arrayElemAt: ['$tid', 0] }, '$$ROOT']
              }
            }
          },
          { $unwind: '$tid' }
        ]
        if (options.item === 'tid') {
          arr.push({
            $match: { title: { $regex: options.search, $options: 'i' } }
          })
        }
        arr = arr.concat([
          { $addFields: { userId: { $toObjectId: '$uid' } } },
          { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'uid' } }])
        if (options.item === 'uid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'uid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr.push({ $unwind: '$uid' })
        arr = arr.concat([
          { $addFields: { fuserId: { $toObjectId: '$cuid' } } },
          { $lookup: { from: 'users', localField: 'fuserId', foreignField: '_id', as: 'cuid' } }
        ])
        if (options.item === 'cuid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'cuid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr = arr.concat([
          { $unwind: '$cuid' },
          { $project: { tid: 1, cuid: { name: 1, _id: 1 }, uid: { name: 1, _id: 1 }, isBest: 1, status: 1, content: 1, created: 1 } },
          { $skip: limit * page },
          { $limit: limit },
          { $sort: { created: -1 } }
        ])
        return this.aggregate(arr)
      }
      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
      return this.find(query)
        .populate({
          path: 'tid',
          select: '_id title'
        })
        .populate({
          path: 'cuid',
          select: '_id name'
        })
        .populate({
          path: 'uid',
          select: '_id name'
        })
        .skip(page * limit)
        .limit(limit)
        .sort({ created: -1 })
    }
  },
  getCommentsOptionsCount: function (options) {
    let query = {}
    if (typeof options.search !== 'undefined') {
      if (typeof options.search === 'string' && options.search.trim() !== '') {
        // radio
        query[options.item] = options.search
      }
      if (['uid', 'tid', 'cuid'].includes(options.item)) {
        let arr = [
          {
            $lookup: {
              from: 'posts',
              let: { pid: { $toObjectId: '$tid' } },
              pipeline: [
                { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },
                { $project: { _id: 1, uid: 1, title: 1 } }
              ],
              as: 'tid'
            }
          },
          {
            $replaceRoot: {
              newRoot: {
                $mergeObjects: [{ $arrayElemAt: ['$tid', 0] }, '$$ROOT']
              }
            }
          },
          { $unwind: '$tid' }
        ]
        if (options.item === 'tid') {
          arr.push({
            $match: { title: { $regex: options.search, $options: 'i' } }
          })
        }
        arr = arr.concat([
          { $addFields: { userId: { $toObjectId: '$uid' } } },
          { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'uid' } }])
        if (options.item === 'uid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'uid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr.push({ $unwind: '$uid' })
        arr = arr.concat([
          { $addFields: { fuserId: { $toObjectId: '$cuid' } } },
          { $lookup: { from: 'users', localField: 'fuserId', foreignField: '_id', as: 'cuid' } }
        ])
        if (options.item === 'cuid' && options.search.trim() !== '') {
          arr.push({
            $match: { 'cuid.name': { $regex: options.search, $options: 'i' } }
          })
        }
        arr.push({ $unwind: '$cuid' })
        arr.push({ $project: { tid: 1, cuid: { name: 1, _id: 1 }, uid: { name: 1, _id: 1 }, isBest: 1, status: 1, content: 1, created: 1 } })
        arr.push({ $group: { _id: null, count: { $sum: 1 } } })
        return this.aggregate(arr)
      }

      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      }
      return this.find(query).countDocuments()
    }
    return this.find(query).countDocuments()
  },
  // getMsgList: function (id, page, limit) {
  //   return this.aggregate([
  // {
  //   $lookup: {
  //     from: 'posts',
  //     let: { pid: { $toObjectId: '$tid' } },
  //     pipeline: [
  //       { $match: { $expr: { $eq: ['$_id', '$$pid'] } } },  // 使用$expr运算符联合多个运算，选出_idt值等于pid值的数据
  //       { $project: { _id: 1, uid: 1, content: 1 } }
  //     ],
  //     as: 'post'
  //   }
  // },
  // {
  //   $replaceRoot: {
  //     newRoot: {
  //       $mergeObjects: [{ $arrayElemAt: ['$post', 0] }, '$$ROOT']
  //     }
  //   }
  // },
  // { $addFields: { userId: { $toObjectId: '$uid' } } },
  // { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'tuid' } },
  // { $unwind: '$tuid' },
  // { $addFields: { fuserId: { $toObjectId: '$cuid' } } },
  // { $lookup: { from: 'users', localField: 'fuserId', foreignField: '_id', as: 'fuid' } },
  // { $unwind: '$fuid' },
  // { $project: { post: 0, tuid: { username: 0, password: 0 }, fuid: { username: 0, password: 0 }, userId: 0, fuserId: 0, tid: 0, cuid: 0 } },
  //     { $match: { uid: id, status: '1', isRead: '0' } }
  //   ])
  //     .skip(limit * page)
  //     .limit(limit)
  //     .sort({ created: -1 })
  // }

  // 热门评论
  getHotComments: function (page, limit, index) {
    if (index === '0') {
      // 总评论记数 -> aggregate聚合查询
      return this.aggregate([
        // 匹配30天内的评论数据 (x需要new Date（）转化为iso的时间格式)
        { $match: { created: { $gte: new Date(moment().subtract(30, 'day')) } } }, // 匹配
        { $group: { _id: '$cuid', count: { $sum: 1 } } }, // // $group 聚合查询的字段：cuid ，计数（各个分类） count ：$sum累加
        { $addFields: { userId: { $toObjectId: '$_id' } } }, // 添加一个字段userId  将聚合$_id转化为 ObjectId，mongodb需要通过objId查询
        { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'cuid' } }, // 查找用户表 ，结果作为 cuid
        { $unwind: '$cuid' }, // 将查询出来的数组转换为对象
        { $project: { cuid: { name: 1, _id: 1, pic: 1 }, count: 1 } }, // $project 过滤掉 cuid不必要的字段 只要name，_id,pic. 以及计数 count
        { $skip: page * limit },
        { $limit: limit },
        { $sort: { count: -1 } }
      ])
    } else if (index === '1') {
      // 最新评论
      return this.find({})
        // populate
        .populate({
          path: 'cuid',
          select: 'name pic _id'
        })
        .skip(page * limit)
        .limit(limit)
        .sort({ created: -1 })
    }
  },
  getHotCommentsCount: async function (index) {
    if (index === '0') {
      // 总评论记数 -> aggregate聚合查询
      const result = await this.aggregate([
        // 匹配30天内的评论数据 (x需要new Date（）转化为iso的时间格式)
        { $match: { created: { $gte: new Date(moment().subtract(30, 'day')) } } },
        { $group: { _id: '$cuid', count: { $sum: 1 } } },
        { $group: { _id: 'null', total: { $sum: 1 } } } // _id为空，统计整个返回来的结果
      ])
      // console.log('result', result)
      return result[0].total
    } else if (index === '1') {
      // 最新评论
      return this.find({}).countDocuments()
    }
  }
}

const Comments = mongoose.model('comments', CommentsSchema)

export default Comments
