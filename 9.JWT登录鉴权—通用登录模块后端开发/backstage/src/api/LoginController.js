import send from '../config/MailConfig'
import moment from 'moment'
//可以产生和验证token
import jsonwebtoken from 'jsonwebtoken'
//获取配置的JWT_SECRET
import config from '../config'

class LoginController {
  constructor(){}
  async forget(ctx){
    const {body} = ctx.request
    console.log(body)
    try{
      //一般还要做一些操作(查找数据库拿到email)  body.username -> database ->email
      let result = await send({
        code:1234,   //验证码(一般存在redis中)
        expire:moment().add(30,'minutes').format('YYYY-MM-DD HH:mm:ss'), //过期时间
        email:body.username,  //收件人邮箱
        user:'xyt'      //收件人
      })
      ctx.body = {
        code:200,
        data:result,
        msg:'邮件发送成功'
      }
    }catch(e){
      console.log(e)
    }
  }
  //用户登录接口
  async login(ctx){
    // 接受用户的数据
    // 验证图片验证码的时效性，正确性
    // 验证用户账号密码是否正确
    // 返回token

    // 生成有时效性的token 。  payload,是明文，不要放敏感的信息，exp：过期时间，为1天，后边 JWT_SECRET 是密钥
    // let token = jsonwebtoken.sign({_id:'brian',exp:Math.floor(Date.now()/1000) + 60*60*24},config.JWT_SECRET)
    //另一种方式设置token过期时间的方式
    let token = jsonwebtoken.sign({_id:'brian'},config.JWT_SECRET,{
      expiresIn: '1d'
    })
// ***一般客户端鉴权，请求头Authorization，值为：Bearer+空格+token  ***
    ctx.body = {
      code:200,
      token:token
    }
  }
}

export default new LoginController()