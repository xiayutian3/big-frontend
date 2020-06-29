import axios from '@/utils/request'

// 获取文章评论列表接口
const getComments = params => axios.get('/public/comments', { params })

// 添加评论的接口
const addComment = data => axios.post('/comments/reply', data)

export {
  getComments,
  addComment
}
