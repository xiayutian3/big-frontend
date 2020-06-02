// 签到相关
import mongoose from '../config/DBHelpler'
// 时间格式化插件 moment(体积大，功能多，有些用不到)  dayjs（体积小，移动端适合） 用法一样
// import moment from 'moment'
import moment from 'dayjs'

const Schema = mongoose.Schema
const SignRecordSchema = new Schema({
  uid: { type: String, ref: 'users' }, // 这个字段与user表相关联，引用
  created: { type: Date },
  favs: { type: Number },
  lastSign: { type: Date }
})

// 保存前触发的钩子函数，注意里边不要用箭头函数（照着官方来写）
SignRecordSchema.pre('save', function (next) {
  this.created = moment().format('YYYY-MM-DD HH:mm:ss')
  next()
})

// 定义静态方法
SignRecordSchema.statics = {
  findByUid: function (uid) {
    return this.findOne({ uid: uid }).sort({ created: -1 }) // 以created字段，-1倒序排列
  }
}

const SignRecord = mongoose.model('sign_record', SignRecordSchema)
export default SignRecord
