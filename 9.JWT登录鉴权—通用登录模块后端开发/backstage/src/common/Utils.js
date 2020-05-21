import { getValue } from '../config/RedisConfig'
// 从redis中读取验证码，对比验证码的有效性，正确性
const checkCode = async (key, value) => {
  const redisData = await getValue(key)
  if (redisData != null) {
    if (redisData.toLowerCase() === value.toLowerCase()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}
export {
  checkCode
}
