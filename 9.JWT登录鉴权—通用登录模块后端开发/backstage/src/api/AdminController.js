// 引入菜单模型
import Menu from '@/model/Menus'
// 引入角色模型
import Roles from '@/model/Roles'
import User from '@/model/User'
import Post from '../model/Post'
import Comments from '../model/Comments'
import SignRecord from '../model/SignRecord'
// 结构进行改造 菜单数据 从而获得动态路由数据
import { getMenuData, sortObj, getRights } from '@/common/Utils'
// 时间库moment（大，功能多）  dayjs（小） 一样的用法
// import moment from 'moment'
import moment from 'dayjs'
// 一个星期内的时间（dayjs）
var weekday = require('dayjs/plugin/weekday')
moment.extend(weekday)

class AdminController {
  // 添加菜单
  async addMenu (ctx) {
    const { body } = ctx.request
    const menu = new Menu(body)
    const result = await menu.save()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 获取菜单
  async getMenu (ctx) {
    const result = await Menu.find({})
    ctx.body = {
      code: 200,
      data: sortObj(result, 'sort')
    }
  }

  // 删除菜单
  async deleteMenu (ctx) {
    const { body } = ctx.request
    const result = await Menu.deleteOne({ _id: body._id })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 更新菜单
  async updateMenu (ctx) {
    const { body } = ctx.request
    const data = { ...body }
    delete data._id
    const result = await Menu.updateOne({ _id: body._id }, { ...data })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 添加角色
  async addRole (ctx) {
    const { body } = ctx.request
    const role = new Roles(body)
    const result = await role.save()
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 获取角色
  async getRole (ctx) {
    const result = await Roles.find({})
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 删除角色
  async deleteRole (ctx) {
    const { body } = ctx.request
    const result = await Roles.deleteOne({ _id: body._id })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 更新角色
  async updateRole (ctx) {
    const { body } = ctx.request
    const data = { ...body }
    delete data._id
    const result = await Roles.updateOne({ _id: body._id }, { ...data })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  /// / 获取角色
  // 获取角色列表（use的index组件那里使用的接口）
  async getRoleNames (ctx) {
    // menu 不显示的字段 取0,desc也不需要
    const result = await Roles.find({}, { menu: 0, desc: 0 })
    ctx.body = {
      code: 200,
      data: result
    }
  }

  // 获取用户 -》 角色 -》 动态菜单信息
  async getRoutes (ctx) {
    // 1. onj -> _id -> roles
    // roles设置为1，只显示roles这个字段，设置为0 为不显示
    const user = await User.findOne({ _id: ctx._id }, { roles: 1 })
    const { roles } = user
    // 2.通过角色 -》 menus -》 可以访问的菜单数据
    // 2.1 用户的角色可能有多个
    // 2.2 角色 menus可能重复 -》 去重
    let menus = []
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i]
      // 只需要menu字段信息，其他不要 ，1是获取，0是不要，{ menu: 1 }只返回menu字段信息
      const rights = await Roles.findOne({ role }, { menu: 1 })
      menus = menus.concat(rights.menu)
    }
    menus = Array.from(new Set(menus))

    // 3.menus -> 可以访问的菜单数据
    const treeData = await Menu.find({})
    // 递归查询 type = “menu”  && _id 包含在menus中
    // 结构进行改造  ctx.isAdmin是否是超级管理员用户
    const routes = getMenuData(treeData, menus, ctx.isAdmin)

    ctx.body = {
      code: 200,
      data: routes
    }
  }

  // 获取用户 -》 角色 -》 动态菜单信息-》的操作权限
  async getOperations (ctx) {
    // 1. onj -> _id -> roles
    // roles设置为1，只显示roles这个字段，设置为0 为不显示
    const user = await User.findOne({ _id: ctx._id }, { roles: 1 })
    const { roles } = user
    // 2.通过角色 -》 menus -》 可以访问的菜单数据
    // 2.1 用户的角色可能有多个
    // 2.2 角色 menus可能重复 -》 去重
    let menus = []
    for (let i = 0; i < roles.length; i++) {
      const role = roles[i]
      // 只需要menu字段信息，其他不要 ，1是获取，0是不要，{ menu: 1 }只返回menu字段信息
      const rights = await Roles.findOne({ role }, { menu: 1 })
      menus = menus.concat(rights.menu)
    }
    menus = Array.from(new Set(menus))

    // 3.menus -> 可以执行的操作 -
    const treeData = await Menu.find({})
    // 递归查询 type = “menu”  && _id 包含在menus中
    // 结构进行改造  ctx.isAdmin是否是超级管理员用户
    const operations = getRights(treeData, menus)
    return operations
  }

  // 首页统计相关的接口
  async getStats (ctx) {
    let result = {}
    // 时间常量 0小时0分0秒0毫秒（当天的0点）
    const nowZero = new Date().setHours(0, 0, 0, 0)
    // 1.顶部的card
    const inforCardData = []
    // 每天新增用户数 $gte大于等于当前的0时 countDocuments mongodb提供的计数方法
    // moment库 的当天时间  = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 })
    // dayjs库的当天时间 = moment().format('YYYY-MM-DD 00:00:00')
    const time = moment().format('YYYY-MM-DD 00:00:00')
    const userNewCount = await User.find({ created: { $gte: time } }).countDocuments()
    const postCount = await Post.find().countDocuments()
    const commentNewCount = await Comments.find({ created: { $gte: time } }).countDocuments()

    // 一周的时间，周一到下周一，一共7天
    const starttime = moment(new Date().setHours(0, 0, 0, 0)).weekday(1).format()
    const endtime = moment(new Date().setHours(0, 0, 0, 0)).weekday(8).format()
    // 一周采纳条数
    const weekEndCount = await Comments.find({ created: { $gte: starttime, $lte: endtime }, isBest: '1' }).countDocuments()
    const signWeekCount = await SignRecord.find({ created: { $gte: starttime, $lte: endtime } }).countDocuments()
    const postWeekCount = await Post.find({ created: { $gte: starttime, $lte: endtime } }).countDocuments()
    inforCardData.push(userNewCount)
    inforCardData.push(postCount)
    inforCardData.push(commentNewCount)
    inforCardData.push(weekEndCount)
    inforCardData.push(signWeekCount)
    inforCardData.push(postWeekCount)
    // 2.左侧的饼图数据（使用聚合查询 aggregate 方法 mongodb）组合查询
    // https://docs.mongodb.com/manual/core/aggregation-pipeline/
    // 返回的结果：例如
    // [
    //  { _id: 'discuss', count: 2 },
    //  { _id: 'advice', count: 3 },
    //  ...
    // ]
    const postsCatalogCount = await Post.aggregate([
      {
        $group: {
          // $group 聚合查询的字段：catalog ，计数（各个分类） count ：$sum累加
          _id: '$catalog',
          count: { $sum: 1 }
        }
      }
    ])
    // 结构化数据
    const pieData = {}
    postsCatalogCount.forEach(item => {
      pieData[item._id] = item.count
    })

    // 3.本周的右侧统计数据
    // 3.1计算6个月前的时间：1号 00：00：00
    // 3.2查询数据库中对应时间内的数据 $gte >=
    // 3.3group组合 ->sum -> sort排序
    // 这是一种获取时间的方式，比较粗糙
    // const startMonth = moment('2019-10-31').subtract(6, 'M').format()
    // 获取前面5个月的时间，从1号开始
    const startMonth = moment(nowZero).subtract(5, 'M').date(1).format()
    // 获取该月的最后一天(只能获取到31号 00：00：00) 月份最大时31号,会自动处理
    // const endMonth = moment('2019-10-31').date(31).format()
    // const endMonth = moment('2019-10-31').date(31).format('YYYY-MM-DD 23:59:59')
    const endMonth = moment(nowZero).add(1, 'M').date(1).format()
    let monthData = await Post.aggregate([
      { $match: { created: { $gte: new Date(startMonth), $lte: new Date(endMonth) } } },
      // 格式化，初始化month字段， 以年月，=以月为时间段， date 查询的字段 ‘created’
      // $project 相当于初始了一个 $month 的变量
      { $project: { month: { $dateToString: { format: '%Y-%m', date: '$created' } } } },
      // $group 聚合查询的字段：$month （如果没有$month,就以month字段），计数（各个月） count ：$sum累加
      { $group: { _id: '$month', count: { $sum: 1 } } },
      // 以id数据正序排列
      { $sort: { _id: 1 } }
    ])
    monthData = monthData.reduce((obj, item) => {
      return {
        ...obj,
        [item._id]: item.count
      }
    }, {})

    // 4.底部的数据
    result = {
      inforCardData,
      pieData,
      monthData
    }
    ctx.body = {
      code: 200,
      data: result
    }
  }
}

export default new AdminController()
