const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
// 客户端热更新
const middleware = require('webpack-dev-middleware')
const HMR = require('webpack-hot-middleware')
//将数据写入内存（webpack默认是将数据写入磁盘的，在没有webpack-dev-middleware的情况下）
const MFS = require("memory-fs");


//可以监视文件的变化
const chokidar = require('chokidar');
const clientConfig = require('./webpack.client.config')
const serverConfig = require('./webpack.server.config')

//读取文件 客户端打包好的文件  vue-ssr-client-manifest
const readFile = (fs, file) => {
  try {
    return fs.readFileSync(path.join(clientConfig.output.path, file), 'utf8')
  } catch (error) {

  }
}


const setupServer = (app, templatePath, cb) => {
  //服务端 bundle
  let bundle
  //客户端 bundle
  let clientManifest
  //html 模板
  let template

  //什么时候通知（标识）
  let ready
  //promise成功的回调 r 让ready = r
  const readyPromise = new Promise(r => ready = r)
  //读取template模板
  template = fs.readFileSync(templatePath, 'utf8')
  const update = () => {
    if (bundle && clientManifest) {
      //通知server 进行渲染(当这两个文件都存在的时候)
      //执行createRenderer -》 renderToString
      ready()
      cb(bundle, {
        template,
        clientManifest
      })
    }
  }
  //webpack -> entry-server -> bundle
  const mfs = new MFS();
  const serverCompiler = webpack(serverConfig);

  serverCompiler.outputFileSystem = mfs;
  //自带的watch方法，监视文件变化，第一个参数传{}，表示监视入口文件的变化
  serverCompiler.watch({}, (err, stats) => {
    // 之后读取输出：
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return
    //对输出文件
    bundle = JSON.parse(readFile(mfs,
      'vue-ssr-server-bundle.json'
    ))
    //更新文件
    update()
  });

  //webpack -> entry-client -> clientManifest
  //hot-middleware（对客户端侧的文件进行更新）
  clientConfig.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  )
  clientConfig.entry.app = ['webpack-hot-middleware/client', clientConfig.entry.app]

  clientConfig.output.filename = '[name].js'

  //客户端的compiler
  const clientCompiler = webpack(clientConfig);
  const devMiddleware = middleware(clientCompiler, {
    noInfo: true, publicPath: clientConfig.output.publicPath,
    logLevel: 'silent' //不输出日志
  })
  app.use(devMiddleware);
  app.use(HMR(clientCompiler));

  //什么时候读取编译完成的clientManifest
  //他的钩子函数 ，第一参数 名字（随便取）第二是回调函数
  clientCompiler.hooks.done.tap('clientsBuild', stats => {
    stats = stats.toJson()
    stats.errors.forEach(err => console.error(err))
    stats.warnings.forEach(err => console.warn(err))
    if (stats.errors.length) return
    // 从webpack-dev-middleware中拿到生成好的 放在  内存中 的 vue-ssr-client-manifest.json
    clientManifest = JSON.parse(readFile(
      //它自己的文件系统
      devMiddleware.fileSystem,
      'vue-ssr-client-manifest.json'
    ))
    //再次调用update方法
    update()
  })



  // fs -> templatePath -> template
  chokidar.watch(templatePath).on('change', () => {
    template = fs.readFileSync(templatePath, 'utf8')
    console.log('template is update')
    update()
  })

  return readyPromise
}

//导出
module.exports = setupServer