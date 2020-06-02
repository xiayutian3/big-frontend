import { getValue } from '../config/RedisConfig'
import jwt from 'jsonwebtoken'
import config from '../config/index'

// 获取token中的payload信息(解密token)
const getJWTPayload = token => {
  return jwt.verity(token.split(' ')[1], config.JWT_SECRET)
}

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
  checkCode,
  getJWTPayload
}
