import send from '../config/MailConfig'
import moment from 'moment'
//可以产生和验证token
import jsonwebtoken from 'jsonwebtoken'
//获取配置的JWT_SECRET
import config from '../config'
//引入自定义的对比函数
import { checkCode } from '../common/Utils'
//User模型
import User from '../model/User'

class LoginController {
  constructor() { }
  async forget(ctx) {
    const { body } = ctx.request
    console.log(body)
    try {
      //一般还要做一些操作(查找数据库拿到email)  body.username -> database ->email
      let result = await send({
        code: 1234,   //验证码(一般存在redis中)
        expire: moment().add(30, 'minutes').format('YYYY-MM-DD HH:mm:ss'), //过期时间
        email: body.username,  //收件人邮箱
        user: 'xyt'      //收件人
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
  //用户登录接口
  async login(ctx) {
    // 接受用户的数据
    // 验证图片验证码的时效性，正确性
    // 验证用户账号密码是否正确
    // 返回token

    const body = ctx.request.body
    // console.log('body',ctx.request.body)
    let sid = body.sid
    let code = body.code
    //对比客户端传过来的 sid code，是否与我们在redis中存的一致
    //封装一个验证图片验证码的函数
    let result = await checkCode(sid, code)  //返回了一个promise对象,让它变成以部方法，才能正确返回结果
    if (result) {
      //接下来去mongodb数据库查找用户名，密码，对比是否正确
      let checkUserPasswd = false
      let user = await User.findOne({ username: body.username })
      // console.log('pwd', user.password, body.password)
      if (user.password === body.password) {
        checkUserPasswd = true
      }
      if (checkUserPasswd) {
        // 验证通过，返回Token数据

        // 生成有时效性的token 。  payload,是明文，不要放敏感的信息，exp：过期时间，为1天，后边 JWT_SECRET 是密钥
        // let token = jsonwebtoken.sign({_id:'brian',exp:Math.floor(Date.now()/1000) + 60*60*24},config.JWT_SECRET)
        //另一种方式设置token过期时间的方式
        let token = jsonwebtoken.sign({ _id: 'brian' }, config.JWT_SECRET, {
          expiresIn: '1d'
        })
        // ***一般客户端鉴权，请求头Authorization，值为：Bearer+空格+token  ***
        ctx.body = {
          code: 200,
          token: token
        }
        //重置checkUserPasswd（为下一个用户重新验证）
        checkUserPasswd = false
      } else {
        //用户名或密码验证失败，返回提示
        ctx.body = {
          code: 401,
          msg: '用户名或密码错误'
        }
      }
    } else {
      //图片验证码校验失败
      ctx.body = {
        code: 401,
        msg: '图片验证码不正确，请检查！'
      }
    }

  }
}

export default new LoginController()