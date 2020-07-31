import axios from '@/libs/request'
import qs from 'qs' // 对get接口请求参数做的简化操作 query string的简称，做了字符串的转换，查询字符串拼接到url后边

/**
 * 读取文章列表的接口
 * @param {obj} options
 */
const getList = options => {
  return axios.get('/public/list?' + qs.stringify(options))
}

export {
  getList
}
