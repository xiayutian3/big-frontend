require('./index.css')
// require('./index.scss')
//添加babel后，用import语法
import('./index.scss')
import afn from './a'
afn()

console.log('hello webpack123')


//环境变量设置
if(process.env.NODE_ENV === 'development'){
  console.log('base is develoment enviroment')
}else if(process.env.NODE_ENV === 'production'){
  console.log('base is production enviroment')
}