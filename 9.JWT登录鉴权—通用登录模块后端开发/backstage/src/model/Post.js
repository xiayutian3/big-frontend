import mongoose from '../config/DBHelpler'
// 文章的module

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
  isEnd: { type: String, default: '0' },
  reads: { type: Number, default: 0 },
  answer: { type: Number, default: 0 },
  status: { type: String, default: '0' },
  isTop: { type: String, default: '0' },
  sort: { type: Number, default: 100 }, // 0 ,1 - 100,采取倒序，0 ，1变成第一个数据
  tags: {
    type: Array,
    default: [
      // {
      //   name: '',
      //   class: ''
      // }
    ]
  }
})

// 定义保存前的钩子函数，用于保存创建时间，中间件
// moment().format('YY-MM-DD HH:mm:ss') 产生出来的是字符串，要跟schema里的类型型对应，才能添加上相应的字段
// new Date() 产生的是 Date类型，schema定义要定义成Date，才能添加上相应的字段
PostSchema.pre('save', function (next) {
  // console.log(new Date())
  // console.log(typeof new Date())
  this.created = new Date() // 产生的是Date类型，返回给前端，前端在进行时间格式化（就可以显示，多少天前，多少个小时前，之类的时间格式）
  // this.created = moment().format('YY-MM-DD HH:mm:ss') // 产生的是字符串类型 （因为前端对时间进行格式化了，这里后端就不需要了）

  // 也可以这种写法，但是shema要定义 String类型
  // if (!this.created) {
  // this.created = moment().format('YY-MM-DD HH:mm:ss')
  // }
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
  },
  getTopWeek: function () {
    return this.find({
      created: { // 根据创建时间来筛选
        // 大于等于，现在的时间-7天的时间（向前 7天内的文章）//近7天内的数据
        $gte: moment().subtract(7, 'days')
      }
    }, {
      answer: 1, // 第二个对象，告诉mongodb，哪些显示的字段 1是显示 0不显示
      title: 1
    }).sort({ answer: -1 }).limit(15) // 排序 按照answer这个字段进行（-1）倒序排列，（0）正序排列，长度限制15条
  },
  // 使用populate从另一个表中获取数据（取想要的字段）
  findByTid: function (id) {
    return this.findOne({ _id: id }).populate({
      path: 'uid', // 通过‘uid’-》映射user表
      select: 'name pic isVip _id' // 获取相应的字段 ，之间用空格隔开，_id要加上，不然uid会被替换掉
    })
  }

}

const PostModel = mongoose.model('post', PostSchema)

export default PostModel
