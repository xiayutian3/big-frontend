// 需使用单引号拼接（不能使用es6的模板字符串）  导入组件的函数
export default (dir) => () => import('@' + dir + '.vue')
