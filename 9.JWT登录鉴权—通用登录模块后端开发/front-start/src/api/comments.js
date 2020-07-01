import axios from '@/utils/request'
import store from '@/store'

// 获取文章评论列表接口
const getComments = params => axios.get('/public/comments',
  {
    params,
    headers: {
      Authorization: 'Bearer ' + store.state.token
    }
  }
)

// 添加评论的接口
const addComment = data => axios.post('/comments/reply', data)

// 更新评论的接口
const updateComment = data => axios.post('/comments/update', data)

// 设置为最佳答案接口
const setCommentBest = params => axios.get('/comments/accept', { params })

// 给评论点赞
const setHands = params => axios.get('/comments/hands', { params })

export {
  getComments,
  addComment,
  updateComment,
  setCommentBest,
  setHands
}
