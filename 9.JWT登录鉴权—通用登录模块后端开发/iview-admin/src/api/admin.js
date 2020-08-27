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
const deleteUserById = (ids) => axios.post('/admin/delete-user', { ids })

// 校验用户名是否已经存在
const checkUsername = (username) => axios.get('/admin/checkname?username=' + username)

// 添加用户的接口
const addUser = (data) => axios.post('/admin/add-user', data)

export {
  getUserList,
  updateUserById,
  deleteUserById,
  checkUsername,
  addUser
}
