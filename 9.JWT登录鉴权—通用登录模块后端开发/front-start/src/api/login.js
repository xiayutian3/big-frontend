// 没使用class封装axios(第一种方式封装)
// import axios from '@/utils/axios'

// 使用class来封装axios(第二种方式封装)
import axios from '@/utils/request'

const getCode = () => {
// 等价于下面这个
  // axios.request({
  //   method:'get',
  //   url:'/getCaptcha'
  // })
  return axios.get('/getCaptcha')
}

const forget = (option) => {
  return axios.post('/forget', {
    ...option
  })
}

export { getCode, forget }
