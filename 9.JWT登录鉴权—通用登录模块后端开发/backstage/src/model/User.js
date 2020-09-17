import mongoose from '../config/DBHelpler'
// 时间格式化插件 moment(体积大，功能多，有些用不到)  dayjs（体积小，移动端适合） 用法一样
import moment from 'dayjs'
const Schema = mongoose.Schema

const UserSchema = new Schema({

  // index 创建唯一索引(去重，防止重复的名称插入数据库)，sparse：该条数据要有这个属性username，不然就不检索
  username: { type: String, index: { unique: true }, sparse: true },
  password: { type: String },
  name: { type: String },
  created: { type: Date },
  updated: { type: Date },
  favs: { type: Number, default: 100 },
  gender: { type: String, default: '' },
  roles: { type: Array, default: ['user'] }, // default,默认值
  pic: { type: String, default: '/img/header.png' }, // 入口文件index，js已经设置了静态资源目录，这里可以直接用绝对路径来获取 / 代表public目录
  mobile: { type: String, match: /^1[3-9](\d{9})$/, default: '' }, // match 正则表达式
  status: { type: String, default: '0' },
  regmark: { type: String, default: '' },
  location: { type: String, default: '' },
  isVip: { type: String, default: '0' },
  count: { type: Number, default: 0 }

})

// 定义保存前的钩子函数，用于保存创建时间，中间件  创建的时候
UserSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

// 更新时候的钩子函数
UserSchema.pre('update', function (next) {
  this.updated = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

// 保存时的钩子，防止插入相同的数据，比如邮箱，用户名相同，就不给插入
UserSchema.post('save', function (error, doc, next) {
  // mongoose官网提供的，错误name ‘MongoError’还有code 11000，用来判断出现重复的key，发生的错误
  if (error.name === 'MongoError' && error.code === 11000) {
    // 调用next（）方法，koa才能捕获到错误
    next(new Error('Error: Mongoose has a duplicate key '))
  } else {
    // 调用next（）方法，koa才能捕获到错误
    next(error)
  }
})

// 定义一些常用的静态方法
// 查找操作
UserSchema.statics = {
  findByID: function (id) {
    // 第一个筛选条件,第二个对象，对数据的一些字段进行过滤，0是不显示（通常用于敏感信息）
    return this.findOne({ _id: id }, {
      password: 0,
      username: 0,
      mobile: 0
    })
  },
  // 获取用户列表
  getList: function (options, sort, page, limit) {
    // json格式转换为object
    options = JSON.parse(options)
    // 1.(查询的时间段)datepicker -> item: string,search -> array starttime,endtime
    // 2.（单选）radio -> key -value $in
    // 3.（多选）select -> key-array $in
    // 查询的sql
    let query = {}
    // 有search字段而且不为空才进行如下的判断
    if (typeof options.search !== 'undefined' && options.search.trim() !== '') {
      // 如果是时间段
      if (options.item === 'created') {
        const start = options.search[0]
        const end = options.search[1]
        query = { created: { $gte: new Date(start), $lt: new Date(end) } }
      } else if (options.item === 'roles') {
        // console.log(options.item)
        query = { roles: { $in: options.search } }
      } else if (['name', 'username'].includes(options.item)) {
        // 模糊匹配
        // $regex mongodb 查询关键字
        // 类似于 {name:{$regex:new RegExp(/admin/)}}  =》 mysql like %admin%
        query[options.item] = { $regex: new RegExp(options.search) }
      } else {
        // radio类型
        query[options.item] = options.search
      }
    }
    // console.log('query', query)
    return this.find(query, { password: 0, mobile: 0 }) // 筛选的一些参数,password:0,mobile:0 排除这些字段
      .sort({ [sort]: -1 }) // -1倒序进行排列
      .skip(page * limit) // 跳过多少页数据
      .limit(limit) // 获取多少条数据
  },
  // 获取查到的总数
  countList: function (options) {
    return this.find(options).countDocuments() // mongoose自带的方法，计算查询回来的list总数
  }
}

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
