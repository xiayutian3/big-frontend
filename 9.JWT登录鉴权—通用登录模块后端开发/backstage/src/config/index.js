//这个是自己虚拟机mongodb的数据库
const DB_URL = 'mongodb://test:123456@192.168.169.129:27017/testdb'
//这个是我自己的虚拟机redis数据库库
const REDIS = {
  host: '192.168.169.129',
  port:15001,
  password: '123456',
}

export default {
  DB_URL,
  REDIS
}