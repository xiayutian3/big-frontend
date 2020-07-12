const redis =require('redis') 
// 使用bluebird转换所有关于get的方法为promise方法
const { promisifyAll } = require('bluebird') 
const redisConfig = require('./index') 

const options = {
  host: redisConfig.REDIS.host,
  port: redisConfig.REDIS.port,
  // password: redisConfig.REDIS.password, //连接redis的密码
  detect_buffers: true, // 设置为true，处理数据完后，返回bufer，为不是转化为string
  retry_strategy: function (options) { // 相当于timeout功能
    if (options.error && options.error.code === 'ECONNREFUSED') {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error('The server refused the connection')
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error('Retry time exhausted')
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000)
  }
}
// 不使用bluebird
// const client = redis.createClient(options)

// 使用bluebird的promisifyAll
const client = promisifyAll(redis.createClient(options))

// 监听client连接出错的情况
client.on('error', (err) => {
  console.log('redis client error:' + err)
})

// 添加time设置过期时间(会自动删除)以秒为单位
const setValue = (key, value, time) => {
  // 还需考虑，key不存在，或者value是对象呢，就需要转换，消耗一定的性能，（可以使用哈希表来存）
  if (typeof value === 'undefined' || value == null || value === '') {
    return
  }
  if (typeof value === 'string') {
    if (typeof time !== 'undefined') {
      // 设置过期时间
      client.set(key, value, 'EX', time)
    } else {
      client.set(key, value)
    }
  }
  if (typeof value === 'object') {
    Object.keys(value).forEach(item => {
      client.hset(key, item, value[item], redis.print) // redis返回的日志信息
    })
  }
}

// //第一种，手动转换成关于get方法成promise方法
// const { promisify } = require("util");
// const getAsync = promisify(client.get).bind(client);
// const getValue = (key)=>{
//   return getAsync(key)
// }

// //获取 hset 存的信息
// const getHValue = (key)=>{
//   return promisify(client.hgetall).bind(client)(key)
// }

// 第二种使用bluebird转换get方法为promise

const getValue = (key) => {
  return client.getAsync(key)
}
const getHValue = (key) => {
  // v8 Promisify methods use util,must node > 8
  return client.hgetallAsync(key)
}

// 删除key方法
const delValue = (key) => {
  client.del(key, (err, res) => {
    if (res === 1) {
      console.log('delete key success')
    } else {
      console.log('delete key error' + err)
    }
  })
}

//检查key是否存在的方法 bluebird 代理redis的原生方法 exists 为existsAsync
const existKey = async function(key){
  const result = await client.existsAsync(key)
  return result
}

//删除key  bluebird代理redis的原生方法
const deleteKey = async function(key){
  const result = await client.delAsync(key)
  return result
}

module.exports =  {
  client,
  setValue,
  getValue,
  getHValue,
  delValue,
  existKey,
  deleteKey
}
