import mongoose from '../config/DBHelpler'
// 时间格式化插件 moment(体积大，功能多，有些用不到)  dayjs（体积小，移动端适合） 用法一样
import moment from 'dayjs'
const Schema = mongoose.Schema

const UserSchema = new Schema({

  // index 创建唯一索引(去重，防止重复的名称插入数据库)，sparse：该条数据要有这个属性username，不然就不检索
  username: { type: String, index: { unique: true }, sparse: true },
  password: { type: String },
  name: { type: String },
  create: { type: Date },
  update: { type: Date },
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
  }
}

const UserModel = mongoose.model('users', UserSchema)

export default UserModel
