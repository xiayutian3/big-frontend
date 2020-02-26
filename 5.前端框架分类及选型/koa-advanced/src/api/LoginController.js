import send from '../config/MailConfig'
import moment from 'moment'

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
}

export default new LoginController()