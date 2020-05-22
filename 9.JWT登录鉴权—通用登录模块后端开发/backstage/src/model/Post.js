import mongoose from '../config/DBHelpler'
// 测试mongoose
// 时间格式化插件 moment(体积大，功能多，有些用不到)  dayjs（体积小，移动端适合） 用法一样
// import moment from 'moment'
import moment from 'dayjs'

const Schema = mongoose.Schema

const PostSchema = new Schema({
  // 可以取到user的数据 ref 指向 users 集合 ，引用数据
  uid: { type: String, ref: 'users' },
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
  tags: Array

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
      .populate({ // （填充）过滤筛选（排除一些不必要的字段，或者是敏感字段）
        path: 'uid', // 对哪个字段进行过滤筛选，（原Schema） 填充到那个字段下
        select: 'name isVip pic' // 从相应的数据中拿到相应的字段（指向引用的集合中）填充回来
      })
  }
}

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
