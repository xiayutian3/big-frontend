// const Vue = require('vue')
const app = require('express')()
const { createBundleRenderer } = require('vue-server-renderer')
//文件路径，用fs模块读取
const fs = require('fs')
const path = require('path')
const resolve = file => path.resolve(__dirname, file)

//区分开发生产模式
const isProd = process.env.NODE_ENV === 'production'

const createRenderer = (bundle, options) => {
  return createBundleRenderer(bundle, Object.assign(options, {
    basedir: resolve('./dist'),
    runInNewContext: false, // 推荐
  }))
}


let renderer,readyPromise
// 模板html路径
const templatePath = resolve('./src/index.template.html')
if (isProd) {
  //生产模式

  //服务端，客户端的bundle
  const bundle = require('./dist/vue-ssr-server-bundle.json')
  const clientManifest = require('./dist/vue-ssr-client-manifest.json')

  //读取模板html
  const template = fs.readFileSync(templatePath, 'utf8')

   renderer = createRenderer(bundle, {
    template, // （可选）页面模板
    clientManifest // （可选）客户端构建 manifest
  })

} else {
  //开发模式

  //1.server -> bundle
  //2.client -> manifest
  //3.待 server,client 2个文件编译完成，就可以调用createBoundleRenderer -》 render -》renderToString -> promise( 等待操作完成时-》server,client 2个文件编译完成 )

  //1和2步可以合起来 -> setupServer -> webpack(都是webpack相关操作) -> readyPromise -> 调用createRender -》 创建renderer实例


  readyPromise = require('./config/setup-dev-server')(app,templatePath,(bundle,options)=>{
    renderer = createRenderer(bundle, options)
  })
  


}

//服务端渲染方法提取
const render = (req,res) =>{
  const context = {
    title: 'hello srr with webpack',
    meta: `
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    `,
    url:req.url  //注意，这个坑
  }
  // 这里无需传入一个应用程序，因为在执行 bundle 时已经自动创建过。
  // 现在我们的服务器与应用程序已经解耦！
  renderer.renderToString(context, (err, html) => {
    // 处理异常……
    // res.end(html)
    if (err) {
      if (err.code === 404) {
        res.status(404).end('Page not found')
      } else {
        res.status(500).end('Internal Server Error')
      }
    } else {
      res.end(html)
    }
  })
}



// 在服务器处理函数中……
// (req,res)=>render(req,res) 当请求参数一样是，可以简写 render
app.get('*', isProd? render :(req,res)=>{
  readyPromise.then(()=>render(req,res))
})

app.listen(8080)