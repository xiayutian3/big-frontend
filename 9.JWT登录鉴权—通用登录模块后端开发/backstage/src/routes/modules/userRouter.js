import Router from 'koa-router'
import userController from '../../api/UserController'
import contentController from '../../api/ContentController'
import errorController from '@/api/ErrorController'
const router = new Router()

router.prefix('/user')
// 用户签到模块
router.get('/fav', userController.userSign)

// 更新用户基本信息接口
router.post('/basic', userController.updateUserInfo)

// 更改密码接口（用户登陆成功后再个人中心那里修改密码）
router.post('/change-password', userController.changePasswd)

// 取消 设置收藏文章
router.get('/set-collect', userController.setCollect)

// 获取收藏列表
router.get('/collect', contentController.collect)

// 获取用户发帖记录
router.get('/post', contentController.getPostByUid)

// 删除发帖记录
router.get('/delete-post', contentController.deletePostByUid)

// 获取历史消息
router.get('/getmsg', userController.getMsg)

// 设置用户未读消息为已读
router.get('/setmsg', userController.setMsg)

// 保存错误日志
router.post('/addError', errorController.addError)

export default router
