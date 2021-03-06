import Router from 'koa-router'
import publicController from '../../api/PublicController'
import ContentController from '../../api/ContentController'
import userController from '@/api/UserController'
import commentsController from '@/api/CommentsController'

const router = new Router()
router.prefix('/public')
// 图形验证码
router.get('/getCaptcha', publicController.getCaptcha)
// 文章列表
router.get('/list', ContentController.getPostList)
// 友情链接
router.get('/links', ContentController.getLinks)
// 温馨提醒
router.get('/tips', ContentController.getTips)
// 回复周榜
router.get('/topWeek', ContentController.getTopWeek)

// 确认修改邮件（修改username）
router.get('/reset-email', userController.updateUsername)

// 更新用户password密码（改密码）
router.post('/pwd', userController.updateUserPwd)

// 获取文章详情
router.get('/content/detail', ContentController.getPostDetail)

// 获取评论列表
router.get('/comments', commentsController.getComments)

// 获取用户基本信息
router.get('/info', userController.getBasicInfo)

// 获取用户最近的评论记录
router.get('/latest-comment', commentsController.getCommentPublic)

// webApp 添加

// 获取热门帖子
router.get('/hotPost', publicController.getHotPost)
// 获取热门评论
router.get('/hotComments', publicController.getHotComments)
// 获取热门排行
router.get('/hotSignRecord', publicController.getHotSignRecord)

export default router
