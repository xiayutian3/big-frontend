// 图形验证码功能
import svgCaptcha from 'svg-captcha'
// redis相关的操作（redis是安装在虚拟机上的，要开启虚拟机）
import { setValue } from '../config/RedisConfig'
// import {setValue,getValue} from '@/config/RedisConfig'
import moment from 'dayjs'
import PostModel from '@/model/Post'
import Comments from '@/model/Comments'
import User from '@/model/User'
import SignRecord from '@/model/SignRecord'

class PublicController {
  // constructor () {}

  // 图形验证码
  async getCaptcha (ctx) {
    // 获取前端传过来的sid(唯一值)，用来与图像验证码做对应,用来确定是哪个用户
    const body = ctx.request.query
    // console.log(body.sid)
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1il',
      color: true,
      noise: Math.floor(Math.random() * 5),
      width: 150,
      height: 38
    })
    // console.log(captcha)
    // 存到redis服务中
    // 保存图片验证码数据，设置超时时间，单位：s，一般为10分钟
    setValue(body.sid, captcha.text, 10 * 60)
    // getValue(body.sid).then(res=>{
    //   console.log(res)
    // })
    ctx.body = {
      code: 200,
      data: captcha.data
    }
  }

  // webApp 添加

  // 获取热门帖子
  async getHotPost (ctx) {
    // page、limit、index
    // index 0-3日内 ，1-7日内，2-30日内，3-全部

    const params = ctx.query
    // mongodb查询用 int类型
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 0
    const index = params.index ? params.index : '0'

    let startTime = ''
    let endTime = ''

    if (index === '0') {
      // 3日内
      // 前2天的0点
      startTime = moment().subtract(2, 'day').format('YYYY-MM-DD 00:00:00')
    } else if (index === '1') {
      startTime = moment().subtract(6, 'day').format('YYYY-MM-DD 00:00:00')
    } else if (index === '2') {
      startTime = moment().subtract(29, 'day').format('YYYY-MM-DD 00:00:00')
    }
    // 后一天的0点 = 今天的24点
    endTime = moment().add(1, 'day').format('YYYY-MM-DD 00:00:00')
    const result = await PostModel.getHotPost(page, limit, startTime, endTime)
    const total = await PostModel.getHotPostCount(page, limit, startTime, endTime)
    ctx.body = {
      code: 200,
      data: result,
      total,
      msg: '获取热门文章成功'
    }
  }

  // 获取热门评论
  async getHotComments (ctx) {
    // 0-热门评论，1-最新评论
    const params = ctx.query
    // mongodb查询用 int类型
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 0
    const index = params.index ? params.index : '0'
    const result = await Comments.getHotComments(page, limit, index)
    const total = await Comments.getHotCommentsCount(index)
    ctx.body = {
      code: 200,
      data: result,
      total,
      msg: '获取热门评论成功'
    }
  }

  // 获取签到排行
  async getHotSignRecord (ctx) {
    // 0-总签到榜 ，通过user查询比较快 ，1-最新签到 - 通过sign modal
    const params = ctx.query
    // mongodb查询用 int类型
    const page = params.page ? parseInt(params.page) : 0
    const limit = params.limit ? parseInt(params.limit) : 0
    const index = params.index ? params.index : '0'
    let result
    let total = 0
    if (index === '0') {
      result = await User.getTotalSign(page, limit)
      total = await User.getTotalSignCount()
    } else if (index === '1') {
      result = await SignRecord.getLatestSign(page, limit)
      total = await SignRecord.getSignCount()
    }
    ctx.body = {
      code: 200,
      data: result,
      total,
      msg: '获取热门排行成功'
    }
  }
}

export default new PublicController()
