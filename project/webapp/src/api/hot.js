import axios from '@/utils/request'
import qs from 'qs'

// 获取热门文章
const getHotPost = (data) => axios.get('/public/hotPost?' + qs.stringify(data))
// 获取热门评论
const getHotComments = (data) => axios.get('/public/hotComments?' + qs.stringify(data))
// 获取签到排行
const getHotSignRecord = (data) => axios.get('/public/hotSignRecord?' + qs.stringify(data))

export {
  getHotPost,
  getHotComments,
  getHotSignRecord
}
