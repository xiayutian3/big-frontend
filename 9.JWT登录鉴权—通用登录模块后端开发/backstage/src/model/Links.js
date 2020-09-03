import mongoose from '../config/DBHelpler'
// 时间格式化插件 moment(体积大，功能多，有些用不到)  dayjs（体积小，移动端适合） 用法一样
// import moment from 'moment'
// import moment from 'dayjs'

const Schema = mongoose.Schema

const LinksSchema = new Schema({
  title: { type: String, default: '' },
  link: { type: String, default: '' },
  type: { type: String, default: 'links' }, // 区分温馨提醒还是友情链接
  pic: { type: String, default: '' },
  isTop: { type: String, default: '' },
  sort: { type: String, default: '' },
  created: { type: Date }

})

// 定义保存前的钩子函数，用于保存创建时间，中间件
// moment().format('YY-MM-DD HH:mm:ss') 产生出来的是字符串，要跟schema里的类型型对应，才能添加上相应的字段
// new Date() 产生的是 Date类型，schema定义要定义成Date，才能添加上相应的字段
LinksSchema.pre('save', function (next) {
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

const LinksModel = mongoose.model('links', LinksSchema)

export default LinksModel
