import axios from '@/utils/request'

// 获取文章评论列表接口
const getComments = tid => axios.get('/public/comments?tid=' + tid)

export {
  getComments
}
