import axios from '@/libs/request'
// import Dispatch from '@/libs/dispatch'

// 用户管理列表接口
const getUserList = (params) => {
  return axios.get('/admin/users', {
    params
  })
}

// 更新用户
const updateUserById = (data) => axios.post('/admin/update-user', data)

// 批量设置用户数据（传递的是ids）
const updateUserBatchById = (data) => axios.post('/admin/update-user-settings', data)

// 删除用户
const deleteUserById = (ids) => axios.post('/admin/delete-user', { ids })

// 校验用户名是否已经存在
const checkUsername = (username) => axios.get('/admin/checkname?username=' + username)

// 添加用户的接口
const addUser = (data) => axios.post('/admin/add-user', data)

// 添加菜单
const addMenu = (data) => axios.post('/admin/addMenu', data)
// 获取菜单列表
const getMenu = () => axios.get('/admin/getMenu')
// 更新菜单列表
const updateMenu = (data) => axios.post('/admin/updateMenu', data)
// 删除菜单
const deleteMenu = (data) => axios.post('/admin/deleteMenu', data)
// export const menuDispatch = new Dispatch({
//   add: ['/admin/addMenu', 'post'],
//   get: ['/admin/getMenu', 'get'],
//   update: ['/admin/updateMenu', 'post'],
//   delete: ['/admin/deleteMenu', 'post']
// })

// 添加角色
const addRole = (data) => axios.post('/admin/addRole', data)
// 获取角色列表
const getRole = () => axios.get('/admin/getRole')
// 更新角色列表
const updateRole = (data) => axios.post('/admin/updateRole', data)
// 删除角色
const deleteRole = (data) => axios.post('/admin/deleteRole', data)

export {
  getUserList,
  updateUserById,
  updateUserBatchById,
  deleteUserById,
  checkUsername,
  addUser,
  addMenu,
  getMenu,
  updateMenu,
  deleteMenu,
  addRole,
  getRole,
  updateRole,
  deleteRole
}
