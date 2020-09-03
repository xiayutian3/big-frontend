const path = require('path')

exports.resolve = function resolve(dir){
  return path.join(__dirname,'..',dir)
}

exports.APP_PATH = exports.resolve('src')
exports.DIST_PATH = exports.resolve('dist')

//自定义webpack路径映射函数
exports.getWebpackResolveConfig = function (customAlias={}){
  const appPath = exports.APP_PATH
  return {
    // 告诉 webpack 解析模块时应该搜索的目录。
    modules:[appPath,'node_modules'],
    // 自动解析确定的扩展
    extensions:['.js','json'],
    // 创建 import 或 require 的别名，来确保模块引入变得更简单。
    alias:{
      '@':appPath,
      ...customAlias
    }
  }
}