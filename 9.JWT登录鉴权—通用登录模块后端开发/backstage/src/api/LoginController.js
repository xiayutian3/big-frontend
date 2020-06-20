import send from '../config/MailConfig'
// 加密密码的库(捉着可以用bcryptjs，api一样，node版的bcrypt)
import bcrypt from 'bcrypt'
// 时间库moment（大，功能多）  dayjs（小） 一样的用法
// import moment from 'moment'
import moment from 'dayjs'

// 可以产生和验证token
import jsonwebtoken from 'jsonwebtoken'
// 获取配置的JWT_SECRET
import config from '../config'
// 引入自定义的对比函数(对比redis中存的验证码)
import { checkCode } from '../common/Utils'
// User模型
import User from '../model/User'
// 签到模型
import SignRecord from '../model/SignRecord'
import { v4 as uuid } from 'uuid'
import { setValue } from '@/config/RedisConfig'

class LoginController {
  // constructor () { }
  async forget (ctx) {
    const { body } = ctx.request
    // console.log(body)
    const user = await User.findOne({ username: body.username })
    const key = uuid()
    // 设置token和他的过期时间( 存在redis中)
    setValue(key, jsonwebtoken.sign({ _id: user._id },
      config.JWT_SECRET, {
        expiresIn: '30m' // 30分钟过期时间
      }
    ))
    try {
      // 一般还要做一些操作(查找数据库拿到email)  body.username -> database ->email
      const result = await send({
        type: '',
        data: {
          key: key,
          username: body.username
        },
        code: '', // 验证码(一般存在redis中)
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'), // 过期时间
        email: body.username, // 收件人邮箱
        user: user.name // 收件人
      })
      ctx.body = {
        code: 200,
        data: result,
        msg: '邮件发送成功'
      }
    } catch (e) {
      console.log(e)
    }
  }

  // 用户登录接口
  async login (ctx) {
    // 接受用户的数据
    // 验证图片验证码的时效性，正确性
    // 验证用户账号密码是否正确
    // 返回token

    const body = ctx.request.body
    // console.log('body',ctx.request.body)
    const sid = body.sid
    const code = body.code
    // 对比客户端传过来的 sid code，是否与我们在redis中存的一致
    // 封装一个验证图片验证码的函数
    const result = await checkCode(sid, code) // 返回了一个promise对象,让它变成异步方法，才能正确返回结果
    if (result) {
      // 接下来去mongodb数据库查找用户名，密码，对比是否正确
      let checkUserPasswd = false
      const user = await User.findOne({ username: body.username })
      // console.log('pwd', user.password, body.password)
      // 因为使用bcrypt加密，所以他的方法进行解密比对，第一个参数，我们传过来的密码，第二个 数据库中加密的密码
      if (await bcrypt.compare(body.password, user.password)) {
        checkUserPasswd = true
      }
      if (checkUserPasswd) {
        // 验证通过，返回Token数据

        // ***一般客户端鉴权，请求头Authorization，值为：Bearer+空格+token  ***
        // 除了token还要返回用户信息
        // toJSON（） mongoose提供的方法,拿到用户信息
        const userObj = user.toJSON()
        const arr = ['password', 'username', 'roles']
        // 删除user里边不需要返回的字段
        arr.map(item => {
          delete userObj[item]
        })
        // 生成有时效性的token 。  payload,是明文，不要放敏感的信息，exp：过期时间，为1天，后边 JWT_SECRET 是密钥
        // let token = jsonwebtoken.sign({_id:'brian',exp:Math.floor(Date.now()/1000) + 60*60*24},config.JWT_SECRET)
        // 另一种方式设置token过期时间的方式
        const token = jsonwebtoken.sign({ _id: userObj._id }, config.JWT_SECRET, {
          expiresIn: '7d' // 7d：表示7天的时长
        })

        // 加入isSign属性给用户，前端需要，判断是否到签到问题
        const signRecord = await SignRecord.findByUid(userObj._id)
        if (signRecord !== null) {
          if (moment(signRecord.created).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')) {
            userObj.isSign = true
          } else {
            userObj.isSign = false
          }
          // 用户签到情况(返回的时候添加一个属性lastSign)
          userObj.lastSign = signRecord.created
        } else {
          // 用户无签到记录
          userObj.isSign = false
        }

        ctx.body = {
          code: 200,
          // 返回的用户信息，字段少的时候可以这么做
          // data: {
          //   name: user.name,
          //   pic: user.pic,
          //   isVip: user.isVip
          // },
          // 返回的用户信息，字段多的情况
          data: userObj,
          token: token
        }
        // 重置checkUserPasswd（为下一个用户重新验证）
        checkUserPasswd = false
      } else {
        // 用户名或密码验证失败，返回提示
        ctx.body = {
          code: 401,
          msg: '用户名或密码错误'
        }
      }
    } else {
      // 图片验证码校验失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确，请检查！'
      }
    }
  }

  // 用户注册接口
  async reg (ctx) {
    // 接收客户端的数据
    const { body } = ctx.request
    // 存放错误信息
    const msg = {}

    // 校验验证码的内容（时效性，有效性）
    const sid = body.sid
    const code = body.code
    // 对比客户端传过来的 sid code，是否与我们在redis中存的一致
    // 封装一个验证图片验证码的函数
    const result = await checkCode(sid, code) // 返回了一个promise对象,让它变成异步方法，才能正确返回结果
    let check = true
    if (result) {
    // 查库，看username是否被注册
      const user1 = await User.findOne({ username: body.username })
      if (user1 && typeof user1.username !== 'undefined') {
        msg.username = ['此邮箱已经注册，可以通过邮箱找回密码']
        check = false
      }
      // 查库，看name是否被注册
      const user2 = await User.findOne({ name: body.name })
      if (user2 && typeof user2.name !== 'undefined') {
        msg.name = ['此昵称已经注册，请重新输入昵称']
        check = false
      }
      // 写入数据到数据库
      // 通常来讲我们不直接存放用户的密码到数据库中，所以进行密码加密
      if (check) {
      // 加密密码
        body.password = await bcrypt.hash(body.password, 5)
        const user = new User({
          username: body.username,
          name: body.name,
          password: body.password,
          created: moment().format('YYYY-MM-DD HH:mm:ss')
        })
        const result = await user.save()
        ctx.body = {
          code: 200,
          data: result,
          mag: '注册成功'
        }
        return
      }
    } else {
      // veevalidate 显示错误
      msg.code = ['验证码已经失效，请重新获取']
    }

    ctx.body = {
      code: 500,
      msg: msg
    }
  }
}

export default new LoginController()
