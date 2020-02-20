
//gulp上的一些方法 src 文件路径 ，dest处理文件后，把文件放到哪里去
// series 串行的去执行   watch 监视文件的执行
const {src,dest,series,watch} = require('gulp')

//gulp-uglify => plugins.uglify = require('gulp-uglify')
const plugins = require('gulp-load-plugins')()
const del = require('del')
//浏览器刷新插件，上有刷新的方法
const browserSync = require('browser-sync').create();
const reload = browserSync.reload


//压缩js uglifyjs
function js(cb){
  src('js/*.js')
    //下一个处理环节
    .pipe(plugins.uglify())
    .pipe(dest('./dist/js'))  //输出
    .pipe(reload({stream: true}))  //注入serve服务器中
    cb()
}

//对html部分
function html(cb){
  src('./index.html')
    .pipe(dest('./dist'))
    .pipe(reload({stream: true}))  //注入serve服务器中
    cb()
}

//对scss/less编译，压缩，输出css文件
function css(cb){
  src('css/*.scss')
    //对输出后的样式进行压缩
    .pipe(plugins.sass({outputStyle:'compressed'}))
    .pipe(plugins.autoprefixer({
      cascade:false,    //是否美化属性值
      remove:false      //是否去掉不必要的前缀 默认：true
    }))
    .pipe(dest('./dist/css'))
    .pipe(reload({stream: true}))  //注入serve服务器中
  cb()
}
//监听这些文件的变换,不需要cb
function watcher(){
  watch('js/*.js',js)
  watch('css/*.scss',css)
  watch('./index.html',html)
}
//删除dist目录中的内容
function clean(cb){
  del('./dist')
  cb()
}


//serve任务
function serve(cb){
  browserSync.init({
    // server:{           //也可以这样
    //   baseDir:'./dist'
    // }
    server: "./dist"
  })
  cb()
}

//单独执行 gulp scripts
exports.scripts = js
//单独执行 gulp styles
exports.styles = css
exports.html = html
exports.clean = clean
// 默认任务
exports.default = series([
  clean,
  js,
  css,
  html,
  serve,
  watcher
])