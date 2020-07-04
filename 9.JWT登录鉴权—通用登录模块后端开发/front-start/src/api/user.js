import axios from '@/utils/request'
import qs from 'qs'

// token已经放到请求封装那里了
// 请求头带上token(在外边直接定了，一开始就执行，这个时候Authorization 的token是空值，登录成功后，这个变量Authorization的token还是空的，不随vuex中的token值变化而变化，所以要放在请求里面，每次发请求，动态去获取token)
// let headers = {
//   Authorization: 'Bearer ' + store.state.token,
//   'Content-Type': 'application/json'
// }

// 用户签到接口
const userSign = () => axios.get('/user/fav')

// 更新用户基本资料
const updateUserInfo = (data) => axios.post('/user/basic', data)

// 确认修改用户名(邮箱，username字段对应的是 =》 邮箱)
const updateUsername = data => axios.get('/public/reset-email?' + qs.stringify(data))

// 更新用户密码
const updateUserPwd = (data) => axios.post('/public/pwd', data)

// 修改用户密码
const changePasswd = data => axios.post('/user/change-password', data)

// 文章的收藏或取消
const addCollect = (params) => axios.get('/user/set-collect', { params })

// 获取收藏列表
const getCollect = (params) => axios.get('/user/collect', { params })

export {
  userSign,
  updateUserInfo,
  updateUsername,
  updateUserPwd,
  changePasswd,
  addCollect,
  getCollect
}
