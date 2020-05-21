import mongoose from '../config/DBHelpler'
// 测试mongoose
import moment from 'moment'
const Schema = mongoose.Schema

const PostSchema = new Schema({
  uid: String,
  title: String,
  content: String,
  created: Date,
  catalog: String,
  fav: String,
  isEnd: String,
  reads: Number,
  answer: Number,
  status: String,
  isTop: String,
  sort: String,
  tags: String

})

// 定义保存前的钩子函数，用于保存创建时间，中间件
PostSchema.pre('save', function (next) {
  this.created = moment().format('YY-MM-DD HH:mm:ss')
  next()
})

// 定义静态方法
PostSchema.statics = {
  /**
   * 获取文章列表数据
   * @param {Object}} options 筛选条件
   * @param {String} sort 排序方式
   * @param {Number} page 分页页数
   * @param {Number} limit 分页条数
   */
  // options查询的参数，筛选的选项，sort 排序，按什么来排序（时间。。），page查到的数据很多，需告诉查询语句是第几页的数据 ，lilmit限制每页查询的数量
  getList: function (options, sort, page, limit) {
    return this.find(options) // 筛选的一些参数
      .sort({ [sort]: -1 }) // -1倒序进行排列
      .skip(page * limit) // 跳过多少页数据
      .limit(limit) // 获取多少条数据
  }
}

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
