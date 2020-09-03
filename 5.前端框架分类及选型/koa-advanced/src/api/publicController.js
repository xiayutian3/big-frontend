//图形验证码功能
import svgCaptcha from 'svg-captcha'

class PublicController {
  constructor(){}
  async getCaptcha(ctx){
    const captcha = svgCaptcha.create({
      size:4,
      ignoreChars:'0o1il',
      color:true,
      noise:Math.floor(Math.random()*5),
      width:150,
      height:38
    })
    // console.log(captcha)
    ctx.body = {
      code:200,
      data: captcha.data
    }
  }
}

export default new PublicController()