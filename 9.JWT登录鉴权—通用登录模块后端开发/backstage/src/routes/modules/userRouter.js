import Router from 'koa-router'
import userController from '../../api/UserController'

const router = new Router()

router.prefix('/user')
// 用户签到模块
router.get('/fav', userController.userSign)

// 更新用户基本信息接口
router.post('/basic', userController.updateUserInfo)

// 更改密码接口（用户登陆成功后再个人中心那里修改密码）
router.post('/change-password', userController.changePasswd)

export default router
