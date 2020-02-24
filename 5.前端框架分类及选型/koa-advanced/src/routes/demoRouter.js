import Router from 'koa-router'
import demoController from '../api/demoController'

const router = new Router()

router.get('/getCaptcha',demoController.getCaptcha)

export default router