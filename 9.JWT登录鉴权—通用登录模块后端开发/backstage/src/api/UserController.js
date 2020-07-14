import SignRecord from '../model/SignRecord'
// 引入自定义的对比函数
import { getJWTPayload, checkCode } from '../common/Utils'
import User from '../model/User'
import moment from 'dayjs'
// 发送邮箱
import send from '../config/MailConfig'
import { v4 as uuid } from 'uuid'
import { setValue, getValue } from '@/config/RedisConfig'
import config from '@/config/index'
import jwt from 'jsonwebtoken'
// 加密密码的库(捉着可以用bcryptjs，api一样，node版的bcrypt)
import bcrypt from 'bcrypt'
import UserCollect from '@/model/UserCollect'
import Comments from '@/model/Comments'
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
    let msg = ''
    if (body.username && body.username !== user.username) {
      // 用户修改邮箱
      // 发送reset邮件
      // 判断用户的新邮箱是否已经有人注册
      const tmpUser = await User.findOne({ username: body.username })
      if (tmpUser && tmpUser.password) {
        ctx.body = {
          code: 501,
          msg: '邮箱已经注册'
        }
        return
      }
      const key = uuid()
      // 设置token和他的过期时间( 存在redis中)
      setValue(key, jwt.sign({ _id: obj._id },
        config.JWT_SECRET, {
          expiresIn: '30m' // 30分钟过期时间
        }
      ))
      await send({
        type: 'email',
        data: {
          key: key,
          username: body.username
        },
        code: '', // 验证码(一般存在redis中)
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'), // 过期时间
        email: user.username, // 收件人邮箱(修改邮箱，是给旧的邮箱发送邮件确认)
        user: user.name // 收件人
      })
      msg = '更新基本资料成功，账号修改需要邮件确认，请查收邮件！'
    }
    // 邮件也发送，但是其他内容也要修改
    // 过滤掉一些不可以让这个接口更新的字段（安全性更好）
    const arr = ['username', 'mobile', 'password']
    arr.map(item => delete body[item])
    const result = await User.updateOne({ _id: obj._id }, body)
    if (result.n === 1 && result.ok === 1) {
      ctx.body = {
        code: 200,
        msg: msg === '' ? '更新成功' : msg
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '更新失败'
      }
    }
  }

  // 更新用户名(邮箱)
  async updateUsername (ctx) {
    const body = ctx.query
    if (body.key) {
      // 从redis中取出 客户端传过来的key  对应的token
      const token = await getValue(body.key)
      const obj = getJWTPayload('Bearer ' + token)
      await User.updateOne({ _id: obj._id }, {
        username: body.username
      })
      ctx.body = {
        code: 200,
        msg: '更新用户名成功'
      }
    }
  }

  // 更新用户密码（这个是我自己写的 用于登录得时候忘记密码，用户想修改密码用）
  async updateUserPwd (ctx) {
    const { body } = ctx.request
    const sid = body.sid
    const code = body.code
    // 对比客户端传过来的 sid code，是否与我们在redis中存的一致
    // 封装一个验证图片验证码的函数
    const ifSidcode = await checkCode(sid, code) // 返回了一个promise对象,让它变成异步方法，才能正确返回结果
    if (!ifSidcode) {
      ctx.body = {
        code: 401,
        msg: '图片验证码错误'
      }
      return
    }
    // 从redis中取出 客户端传过来的key  对应的token,如果存在，说明还有有效的30分钟内
    const token = await getValue(body.key)
    if (!token) {
      ctx.body = {
        code: 401,
        msg: '操作无效，您已超过30分钟'
      }
      return
    }
    // 加密密码
    body.password = await bcrypt.hash(body.password, 5)
    const updatePwd = { password: body.password }
    const result = await User.updateOne({ username: body.username }, updatePwd)
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

  // 修改密码接口（这个是老师得，用于，登陆成功后再个人中心那里想重新设置密码）
  async changePasswd (ctx) {
    const { body } = ctx.request
    const obj = await getJWTPayload(ctx.header.authorization)
    const user = await User.findOne({ _id: obj._id })
    // 密码比对，一个是 用户传过来的旧密码，第二个是数据库中存得密码
    // 对比成功后重新加密客户端传过来的密码，再存到数据库中
    if (await bcrypt.compare(body.oldpwd, user.password)) {
      const newpasswd = await bcrypt.hash(body.newpwd, 5)
      await User.updateOne({ _id: obj._id }, { $set: { password: newpasswd } })
      ctx.body = {
        code: 200,
        msg: '更新密码成功'
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '更新密码错误，请检查！'
      }
    }
  }

  // 取消设置收藏文章
  async setCollect (ctx) {
    const params = ctx.query
    // 取用户的id
    const obj = await getJWTPayload(ctx.header.authorization)
    // isFav 值是 0或 1
    if (parseInt(params.isFav)) {
      // 说明用户收藏了帖子U
      await UserCollect.deleteOne({ uid: obj._id, tid: params.tid })
      ctx.body = {
        code: 200,
        msg: '取消成功'
      }
    } else {
      const newCollect = new UserCollect({
        uid: obj._id,
        tid: params.tid,
        title: params.title
      })
      const result = await newCollect.save()
      if (result.uid) {
        ctx.body = {
          code: 200,
          data: result,
          msg: '收藏成功'
        }
      }
    }
  }

  // 获取用户基本信息
  async getBasicInfo (ctx) {
    const params = ctx.query
    const uid = params.uid
    let user = await User.findByID(uid)
    // 获取用户的签到记录 有没有 》 today 00：00:00
    // toJSON()后才能操作user
    user = user.toJSON()
    const date = moment().format('YYYY-MM-DD')
    const result = await SignRecord.findOne({ uid: uid, created: { $gte: (date + ' 00:00:00') } })
    if (result && result.uid) {
      user.isSign = true
    } else {
      user.isSign = false
    }
    ctx.body = {
      code: 200,
      data: user,
      msg: '查询成功'
    }
  }

  // 获取历史消息
  // 记录评论之后，给作者发送消息
  async getMsg (ctx) {
    const params = ctx.query
    const page = params.page ? params.page : 0
    // mongoose 传递的limit 是int类型，parseInt()转换
    const limit = params.limit ? parseInt(params.limit) : 0
    // 方法一：嵌套查询（聚合查询）-》 通过 aggregate
    // 取用户的id
    const obj = await getJWTPayload(ctx.header.authorization)
    const result = await Comments.getMsgList(obj._id, page, limit)

    // 方法二：通过冗余换时间

    ctx.body = {
      code: 200,
      data: result
    }
  }
}

export default new UserController()
