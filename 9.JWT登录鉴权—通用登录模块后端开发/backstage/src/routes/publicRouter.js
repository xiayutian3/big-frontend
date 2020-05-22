import Router from 'koa-router'
import publicController from '../api/PublicController'
import ContentController from '../api/ContentController'

const router = new Router()
router.prefix('/public')
// 图形验证码
router.get('/getCaptcha', publicController.getCaptcha)
// 文章列表
router.get('/list', ContentController.getPostList)

export default router
