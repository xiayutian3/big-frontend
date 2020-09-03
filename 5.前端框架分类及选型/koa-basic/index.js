const Koa = require('koa')
//处理路由
const Router = require('koa-router')
//处理post等提交的数据
const koaBody = require('koa-body')
// 处理跨域请求
const cors = require('@koa/cors')
//json格式化
const json = require('koa-json')

const app = new Koa();
const router = new Router();

app.use(cors())
app.use(koaBody())
//关闭pretty，当使用到参数的时候，才会格式化
app.use(json({pretty:false,param:'pretty'}))
//添加请求前缀   /api+url
router.prefix('/api')

router.get('/', async ctx=>{
  console.log(ctx)
  console.log(ctx.request)
  ctx.body = 'hello world'
});
router.get('/api', async ctx=>{
  const params = ctx.request.query
  console.log(params)
  console.log(params.name)
  ctx.body = {
    ...params
  }
});

router.get('/async',async ctx=>{
  let result = await new Promise((resolve)=>{
    setTimeout(function(){
      resolve('hello world 2s later!')
    },2000)
  })
  ctx.body = result
})
router.post('/post',async ctx=>{
  let {body} = ctx.request
  console.log(body)
  console.log(ctx.request)
  //相当于ctx.respose，返回数据
  ctx.body = { 
    ...body
  }
})


//1.request,methods,response
//2.api url => function ,router
//3.ctx,async
// app.use(async ctx => {
  // console.log(ctx)
  // console.log(ctx.request)
//   ctx.body = 'hello app'
// });
app.use(router.routes()).use(router.allowedMethods());//类似于一个拦截器，查看请求中有没有这个方法

app.listen(3000,()=>{
  console.log('server is started at port 3000')
})