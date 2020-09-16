// 引入菜单模型
import Menu from '@/model/Menus'
// 引入角色模型
import Roles from '@/model/Roles'
import User from '@/model/User'
// 结构进行改造 菜单数据 从而获得动态路由数据
import { getMenuData, sortObj, getRights } from '@/common/Utils'

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
}

export default new AdminController()
