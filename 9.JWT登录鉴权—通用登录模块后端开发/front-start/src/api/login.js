// 没使用class封装axios(第一种方式封装)
// import axios from '@/utils/axios'

// 使用class来封装axios(第二种方式封装)
import axios from '@/utils/request'

/**
 * 获取图形验证码接口，
 * @param {*} sid 是唯一的标识
 */
const getCode = (sid) => {
// 等价于下面这个
  // axios.request({
  //   method:'get',
  //   url:'/getCaptcha'
  // })
  return axios.get('/public/getCaptcha', {
    params: {
      sid
    }
  })
}
/**
 * 忘记密码接口
 * @param {*} option 用户信息，邮箱，验证码
 */
const forget = (option) => {
  return axios.post('/login/forget', {
    ...option
  })
}

/**
 * 用户登录接口
 * @param {*} loginInfo 用户的登录信息
 */
const login = loginInfo => {
  return axios.post('/login/login', {
    ...loginInfo
  })
}

/**
 *
 * @param {*} regInfo 用户的注册信息
 */
const reg = regInfo => {
  return axios.post('/login/reg', {
    ...regInfo
  })
}

export { getCode, forget, login, reg }
