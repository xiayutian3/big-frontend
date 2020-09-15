// 查询用户中的超级管理员(查询到以后设置到redis缓存中,每次初始化应用都会用到)
import config from '@/config'
import User from '@/model/User'
// redis设置缓存
import { setValue } from '@/config/RedisConfig'

export const run = async () => {
  if (config.adminEmail && config.adminEmail.length > 0) {
    const emails = config.adminEmail
    const arr = []
    for (const email of emails) {
      const user = await User.findOne({ username: email })
      arr.push(user._id)
    }
    setValue('admin', JSON.stringify(arr))
  }
}
