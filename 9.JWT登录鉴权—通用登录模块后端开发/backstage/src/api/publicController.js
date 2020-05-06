//图形验证码功能
import svgCaptcha from 'svg-captcha'
//redis相关的操作（redis是安装在虚拟机上的，要开启虚拟机）
import {setValue,getValue} from '../config/RedisConfig'
// import {setValue,getValue} from '@/config/RedisConfig'

class PublicController {
  constructor(){}

  //图形验证码
  async getCaptcha(ctx){
    //获取前端传过来的sid(唯一值)，用来与图像验证码做对应,用来确定是哪个用户
    const body = ctx.request.query
    // console.log(body.sid)
    const captcha = svgCaptcha.create({
      size:4,
      ignoreChars:'0o1il',
      color:true,
      noise:Math.floor(Math.random()*5),
      width:150,
      height:38
    })
    // console.log(captcha)
    //存到redis服务中
    //保存图片验证码数据，设置超时时间，单位：s，一般为10分钟
    setValue(body.sid,captcha.text,10*60)
    // getValue(body.sid).then(res=>{
    //   console.log(res)
    // })
    ctx.body = {
      code:200,
      data: captcha.data
    }
  }


}

export default new PublicController()