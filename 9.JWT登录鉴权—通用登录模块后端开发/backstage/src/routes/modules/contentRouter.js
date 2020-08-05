import Router from 'koa-router'
import contentController from '../../api/ContentController'

const router = new Router()
router.prefix('/content')

// 上传图片
router.post('/upload', contentController.uploadImg)

// 发表新帖
router.post('/add', contentController.addPost)

// 更新帖子(前端项目，作者本人操作)
router.post('/update', contentController.updatePost)

// 更新帖子（iview 管理系统，管理员操作）
router.post('/update-id', contentController.updatePostByTid)

// 删除帖子
router.get('/delete', contentController.deletePost)

export default router
