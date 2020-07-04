import axios from '@/utils/request'
import store from '@/store'
import qs from 'qs' // 对get接口请求参数做的简化操作 query string的简称，做了字符串的转换，查询字符串拼接到url后边

// 没使用qs库之前
// const getList = options =>{
//   return axios.get('/public/list',{
//     params:{
//       // type:typeof options.type === 'undefined' || options.type === ""?"":options.type
//       // catalog:options.catalog
//       // ...
//     }
//   })
// }

// 使用npm 上的qs库后 ,qs可以做字符串的转换。后端字段的的频繁变化，，但是一定要再get请求url上加问好？
/**
 * 读取文章列表的接口
 * @param {obj} options
 */
const getList = options => {
  return axios.get('/public/list?' + qs.stringify(options))
}
/**
 * 温馨提示
 */
const getTips = () => {
  return axios.get('/public/tips')
}
/**
 * 本周热议
 */
const getTop = () => {
  return axios.get('/public/topWeek')
}

/**
 * 友情链接
 */
const getLinks = () => {
  return axios.get('/public/links')
}

// 图片上传接口
const uploadImg = formData => axios.post('/content/upload', formData)

// 发贴接口
const addPost = data => axios.post('/content/add', data)

// 获取文章详情
const getDetail = tid => {
  const token = store.state.token
  let headers = {}
  if (token !== '') {
    headers = {
      headers: {
        Authorization: 'Bearer ' + store.state.token
      }
    }
  }
  return axios.get('/public/content/detail?tid=' + tid, headers)
}

// 更新文章，编辑帖子
const updatePost = data => axios.post('/content/update', data)

export {
  getList,
  getTips,
  getLinks,
  getTop,
  uploadImg,
  addPost,
  getDetail,
  updatePost
}
