import axios from '@/utils/request'
import store from '@/store'
// console.log('http', store.state.token)
// 请求头带上token(在外边直接定了，一开始就执行，这个时候Authorization 的token是空值，登录成功后，这个变量Authorization的token还是空的，不随vuex中的token值变化而变化，所以要放在请求里面，每次发请求，动态去获取token)
// let headers = {
//   Authorization: 'Bearer ' + store.state.token,
//   'Content-Type': 'application/json'
// }

// 用户签到接口
const userSign = () => axios.get('/user/fav', {
  headers: {
    Authorization: 'Bearer ' + store.state.token,
    'Content-Type': 'application/json'
  }
})

export {
  userSign
}
