// 自己封装的axios请求
import axios from './http'
const getCode = async () => {
  let result = ''
  try {
    result = await axios.get('/getCaptcha')
    if (result.status === 200) {
    // 这一层的data是axios默认有的
      // console.log(111, result.data)
      return result.data
    }
  } catch (error) {
    console.log(error)
  }
  return result
}

export { getCode }
