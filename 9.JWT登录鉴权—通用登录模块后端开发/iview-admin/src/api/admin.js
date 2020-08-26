import axios from '@/libs/request'

// 用户管理列表接口
const getUserList = (params) => {
  return axios.get('/admin/users', {
    params
  })
}

// 更新用户
const updateUserById = (data) => axios.post('/admin/update-user', data)

// 删除用户
const deleteUserById = (id) => axios.get('/admin/delete-user?id=' + id)

// 校验用户名是否已经存在
const checkUsername = (username) => axios.get('/admin/checkname?username=' + username)

export {
  getUserList,
  updateUserById,
  deleteUserById,
  checkUsername
}
