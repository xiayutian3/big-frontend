// 这个是自己虚拟机mongodb的数据库
const DB_URL = 'mongodb://test:123456@192.168.169.129:27017/testdb'
// 这个是我自己的虚拟机redis数据库库
const REDIS = {
  host: '192.168.169.129',
  port: 15001,
  password: '123456'
}
// koa jwt secret(随机字符串，尽量长些)
const JWT_SECRET = 'ere%4324@$&*ghg*dfsdgfgth!W#323F$T%g5G@Fedf@@45'

// baseUrl  QQ邮箱不能打开localhost的地址，要换成'http://127.0.0.1:3000' 就可以了
const baseUrl = process.env.NODE_ENV === 'production' ? 'http://www.toimc.com' : 'http://127.0.0.1:3000'
export default {
  DB_URL,
  REDIS,
  JWT_SECRET,
  baseUrl
}
