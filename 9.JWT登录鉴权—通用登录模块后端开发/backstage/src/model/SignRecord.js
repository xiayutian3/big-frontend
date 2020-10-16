// 签到相关
import mongoose from '../config/DBHelpler'
// 时间格式化插件 moment(体积大，功能多，有些用不到)  dayjs（体积小，移动端适合） 用法一样
// import moment from 'moment'
import moment from 'dayjs'

const Schema = mongoose.Schema
const SignRecordSchema = new Schema({
  uid: { type: String, ref: 'users' }, // 这个字段与user表相关联，子引用
  created: { type: Date },
  favs: { type: Number }
})

// 保存前触发的钩子函数，注意里边不要用箭头函数（照着官方来写）
SignRecordSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

// 定义静态方法
SignRecordSchema.statics = {
  findByUid: function (uid) {
    // （一个用户签到记录是列表，有很多条签到记录）倒序以后，查找到用户最新签到的记录（只有一条）findOne方法
    return this.findOne({ uid: uid }).sort({ created: -1 }) // 以created字段，-1倒序排列
  },
  // 最新签到列表
  getLatestSign (page, limit) {
    return this.find({})
      .populate({
        path: 'uid',
        select: '_id name pic'
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: -1 })
  },
  // 今日签到最快
  getTopSign (page, limit) {
    return this.find({
      created: {
        $gte: moment().format('YYYY-MM-DD 00:00:00')
      }
    })
      .populate({
        path: 'uid',
        select: '_id name pic'
      })
      .skip(page * limit)
      .limit(limit)
      .sort({ created: 1 }) // 正序排列 》 每天的00：00：00
  },
  // 今日签到最快数量
  getTopSignCount () {
    return this.find({
      created: {
        $gte: moment().format('YYYY-MM-DD 00:00:00')
      }
    }).countDocuments()
  },
  // 最新签到列表总数
  getSignCount () {
    return this.find({}).countDocuments()
  }
}

const SignRecord = mongoose.model('sign_record', SignRecordSchema)
export default SignRecord
