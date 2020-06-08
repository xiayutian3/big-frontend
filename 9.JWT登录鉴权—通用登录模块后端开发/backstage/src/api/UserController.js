import SignRecord from '../model/SignRecord'
import { getJWTPayload } from '../common/Utils'
import User from '../model/User'
import moment from 'dayjs'
// 发送邮箱
import send from '../config/MailConfig'
import { v4 as uuid } from 'uuid'
import { setValue } from '@/config/RedisConfig'
import config from '@/config/index'
import jwt from 'jsonwebtoken'

class UserController {
  // 用户签到接口
  async userSign (ctx) {
    // 取用户的id
    const obj = await getJWTPayload(ctx.header.authorization)
    // 查询用户上一次签到的记录
    const record = await SignRecord.findByUid(obj._id)
    // console.log('UserController -> userSign -> record', record)
    const user = await User.findByID(obj._id)
    let newRecord = {}
    let result = ''
    // 判断签到逻辑
    if (record !== null) {
      // 有历史签到数据
      // 1.判断用户上一次签到记录的created时间是否与今天相同
      //  如果当前的日期与上一次签到的日期相同，说明用户已经签到
      const created = moment(record.created).format('YYYY-MM-DD')
      const now = moment().format('YYYY-MM-DD')
      if (created === now) {
        ctx.body = {
          code: 500,
          favs: user.favs,
          count: user.count,
          msg: '用户已经签到',
          lastSign: record.created
        }
        // 如果不return 会被外边下面的ctx.body覆盖
        return
      } else {
        // 有上一次的签到记录，并且不与今天相同，进行连续签到的判断
        // 如果相同，代表用户实在连续签到
        let count = user.count
        let fav = 0
        // 判断签到的时间：用户上一次的签到时间等于，当前时间的前一天，说明，用户在连续签到
        // 注意第n+1天签到的时候，需要与第n天的created比较
        if (moment(record.created).format('YYYY-MM-DD') === moment().subtract(1, 'days').format('YYYY-MM-DD')) {
          // 连续签到的积分获得逻辑
          // 因为如果用户当前是4天，在签到就是第5天了，所以count + 1
          count += 1
          if (count < 5) {
            fav = 5
          } else if (count >= 5 && count < 15) {
            fav = 10
          } else if (count >= 15 && count < 30) {
            fav = 15
          } else if (count >= 30 && count < 100) {
            fav = 20
          } else if (count >= 100 && count < 365) {
            fav = 30
          } else if (count >= 365) {
            fav = 50
          }
          await User.updateOne(
            { _id: obj._id },
            {
              // user.favs += fav    user.count += 1
              $inc: { favs: fav, count: 1 } // 实现相应字段数据递增
            }
          )
          // 更新返回的数据
          result = {
            favs: user.favs + fav,
            count: user.count + 1 // 连续签到的天数
          }
        } else {
          // 用户中断了一次签到
          // 注意第n+1天签到的时候，需要与第n天的created比较,就知道是否中断了
          fav = 5
          await User.updateOne(
            { _id: obj._id },
            {
              $set: { count: 1 },
              $inc: { favs: fav }
            }
          )
          result = {
            favs: user.favs + fav,
            count: 1 // 连续签到的天数
          }
        }
        // 更新签到记录表(单次签到)  新增加一条（这个用户的）记录
        newRecord = new SignRecord({
          uid: obj._id,
          favs: fav
        })
        await newRecord.save()
      }
    } else {
      // 无签到记录(就设置首次签到)
      // 保存用户的签到数据，签到计数+积分数据
      await User.updateOne({
        _id: obj._id
      },
      {
        $set: { count: 1 }, // 设置count的值为1
        $inc: { favs: 5 } // fav积分增加5
      })
      // 保存用户的签到记录
      newRecord = new SignRecord({
        uid: obj._id,
        favs: 5
      })
      await newRecord.save()
      result = {
        favs: user.favs + 5,
        count: 1 // 连续签到的天数
      }
    }
    ctx.body = {
      code: 200,
      msg: '请求成功',
      ...result,
      lastSign: newRecord.created
    }
  }

  // 更新用户基本信息接口
  async updateUserInfo (ctx) {
    const { body } = ctx.request
    const obj = await getJWTPayload(ctx.header.authorization)
    // 判断用户是否修改了邮箱（需要验证邮箱）
    const user = await User.findOne({ _id: obj._id })
    if (body.username && body.username !== user.username) {
      // 用户修改邮箱
      // 发送reset邮件
      const key = uuid()
      // 设置token和他的过期时间( 存在redis中)
      setValue(key, jwt.sign({ _id: obj._id },
        config.JWT_SECRET, {
          expiresIn: '30m'
        }
      ))
      const result = await send({
        type: 'email',
        key: key,
        code: '', // 验证码(一般存在redis中)
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'), // 过期时间
        email: user.username, // 收件人邮箱(修改邮箱，是给旧的邮箱发送邮件确认)
        user: user.name // 收件人
      })
      ctx.body = {
        code: 500,
        data: result,
        msg: '发送验证码邮件成功，请点击链接确认修改邮件账号'
      }
    } else {
      // 过滤掉一些不可以让这个接口更新的字段（安全性更好）
      const arr = ['username', 'mobile', 'password']
      arr.map(item => delete body[item])
      const result = await User.updateOne({ _id: obj._id }, body)
      if (result.n === 1 && result.ok === 1) {
        ctx.body = {
          code: 200,
          msg: '更新成功'
        }
      } else {
        ctx.body = {
          code: 500,
          msg: '更新失败'
        }
      }
    }
  }
}

export default new UserController()
