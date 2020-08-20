import axios from '@/libs/request'

// 用户管理列表接口
const getUserList = (params) => {
  return axios.get('/admin/users', {
    params
  })
}

export {
  getUserList
}
