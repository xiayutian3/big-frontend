import { getValue } from '../config/RedisConfig'
import jwt from 'jsonwebtoken'
import config from '../config/index'
import fs from 'fs'
import path from 'path'

// 获取token中的payload信息(验证token,解析获得payload),
// Bearer+空格+token形式
const getJWTPayload = token => {
  // console.log(token)
  return jwt.verify(token.split(' ')[1], config.JWT_SECRET)
}

// 从redis中读取验证码，对比验证码的有效性，正确性
const checkCode = async (key, value) => {
  const redisData = await getValue(key)
  if (redisData != null) {
    if (redisData.toLowerCase() === value.toLowerCase()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

// 判断路径是否存在(使用node的fs模块自带的方法)  stats 对象提供了关于文件的信息。
const getState = path => {
  return new Promise(resolve => {
    // fs.stat(path, (err, stats) => {
    //   if (err) {
    //     resolve(false)
    //   } else {
    //     resolve(stats)
    //   }
    // })
    // 也可以这么写
    fs.stat(path, (err, stats) => err ? resolve(false) : resolve(stats))
  })
}

// 创建文件夹函数
const mkdir = dir => {
  return new Promise(resolve => {
    fs.mkdir(dir, err => err ? resolve(false) : resolve(true))
  })
}

// 循环遍历，递归判断如果上级目录不存在，则产生上级目录
const dirExists = async (dir) => {
  const isExists = await getState(dir)
  // 如果路径存在且不是文件，返回true
  if (isExists && isExists.isDirectory()) {
    return true
  } else if (isExists) {
    // 创建的地方路径存在，可能有相同的文件的名字，则就不能创建相同名字的文件夹，就创建失败，返回false
    // 路径存在，但是是文件，返回false
    return false
  }

  // 如果路径不存在,创建该路径（获得上级目录路径）
  const tempDir = path.parse(dir).dir
  // 循环遍历，递归判断如果上级目录不存在，则产生上级目录
  const status = await dirExists(tempDir)
  if (status) {
    // 上级目录存在才创建文件夹
    const result = await mkdir(dir)
    console.log('dirExists -> result', result)
    return result
  } else {
    return false
  }
}

// 替换原有的key，换成新的key
const rename = (obj, key, newKey) => {
  if (Object.keys(obj).indexOf(key) !== -1) {
    obj[newKey] = obj[key]
    // 删除旧的key
    delete obj[key]
  }
  return obj
}

/**
 *
 * @param {*} arr 要排序的数组
 * @param {*} property 按什么属性来排序
 */
const sortObj = (arr, property) => {
  return arr.sort((m, n) => m[property] - n[property])
}

// 获取菜单权限 对应的路由(动态路由) 或者是超级管理员
const getMenuData = (tree, rights, flag) => {
  const arr = []
  for (let i = 0; i < tree.length; i++) {
    const item = tree[i]

    // 把mongoodb的-id转换成string
    if (rights.includes(item._id + '') || flag) {
      if (item.type === 'menu') {
        // _id 包含在menus中
        // 结构进行改造,删除opertaions，等无用的属性
        arr.push({
          _id: item._id,
          path: item.path,
          meta: {
            title: item.title,
            hideInBread: item.hideInBread,
            hideInMenu: item.hideInMenu,
            notCache: item.notCache,
            icon: item.icon
          },
          component: item.component,
          children: getMenuData(item.children, rights)
        })
      } else if (item.type === 'link') {
        // 等于link的情况
        arr.push({
          _id: item._id,
          path: item.path,
          meta: {
            title: item.title,
            href: item.link,
            icon: item.icon
          }
        })
      }
    }
  }
  // 排序 sortObj
  return sortObj(arr, 'sort')
}

export {
  checkCode,
  getJWTPayload,
  dirExists,
  rename,
  sortObj,
  getMenuData
}
