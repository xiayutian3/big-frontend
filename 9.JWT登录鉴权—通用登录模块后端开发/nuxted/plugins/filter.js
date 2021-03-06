import Vue from 'vue'
// moment库的用法
// 也可以使用 moment（库比较大）
// import moment from 'moment'
// 使用中文提示（moment库里边的）
// import 'moment/locale/zh-cn'

// ******dayjs库的用法*******
import relativeTime from 'dayjs/plugin/relativeTime'// 按需加载插件
import moment from 'dayjs'
// 使用中文提示（dayjs库里边的）
// import zh from 'dayjs/locale/zh-cn'
// moment.locale(zh)
// 也可以这样设置语言 dayjs
import 'dayjs/locale/zh-cn'
moment.locale('zh-cn')
// dayjs扩展相对时间用的
moment.extend(relativeTime)

const formatDate = (date) => {
  // 超过7天，显示日期
  if (moment(date).isBefore(moment().subtract(7, 'days'))) {
    return moment(date).format('YYYY-MM-DD')
  } else {
    // 1小时前，xx小时前，x天前
    return moment(date).from(moment())
  }
}
const filters = {
  moment: formatDate
}
// 注册全局过滤器(一次性注册)
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})
