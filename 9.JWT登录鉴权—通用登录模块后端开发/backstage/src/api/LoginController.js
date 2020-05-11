import send from '../config/MailConfig'
//加密密码的库(捉着可以用bcryptjs，api一样，node版的bcrypt)
import bcrypt from 'bcrypt'
//时间库moment
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
    // console.log(body)
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
    let result = await checkCode(sid, code)  //返回了一个promise对象,让它变成异步方法，才能正确返回结果
    if (result) {
      //接下来去mongodb数据库查找用户名，密码，对比是否正确
      let checkUserPasswd = false
      let user = await User.findOne({ username: body.username })
      // console.log('pwd', user.password, body.password)
      //因为使用bcrypt加密，所以他的方法进行解密比对，第一个参数，我们传过来的密码，第二个 数据库中加密的密码
      if (await bcrypt.compare(body.password,user.password)) {
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

  //用户注册接口
  async reg(ctx){
    //接收客户端的数据
    const {body} = ctx.request
    //存放错误信息
    let msg = {}
  
    //校验验证码的内容（时效性，有效性）
    let sid = body.sid
    let code = body.code
    //对比客户端传过来的 sid code，是否与我们在redis中存的一致
    //封装一个验证图片验证码的函数
    let result = await checkCode(sid, code)  //返回了一个promise对象,让它变成异步方法，才能正确返回结果
    let check = true
    if(result){
    //查库，看username是否被注册
    let user1 = await User.findOne({username:body.username})
    if(user1 && typeof user1.username != 'undefined'){
      msg.username = ['此邮箱已经注册，可以通过邮箱找回密码']
      check = false
    }
    //查库，看name是否被注册
    let user2 = await User.findOne({name:body.name})
    if(user2 && typeof user2.name != 'undefined'){
      msg.name = ['此昵称已经注册，请重新输入昵称']
      check = false
    }
    //写入数据到数据库
    //通常来讲我们不直接存放用户的密码到数据库中，所以进行密码加密
    if(check){
      //加密密码
      body.password = await bcrypt.hash(body.password,5)
      let user = new User({
        username:body.username,
        name:body.name,
        password:body.password,
        created:moment().format('YYYY-MM-DD HH:mm:ss')
      })
      let result = await user.save()
      ctx.body = {
        code:200,
        data:result,
        mag:'注册成功'
      }
      return
    }

    }else{
      //veevalidate 显示错误
      msg.code = ['验证码已经失效，请重新获取']
    }

    ctx.body = {
      code:500,
      msg:msg
    }
  }
}

export default new LoginController()