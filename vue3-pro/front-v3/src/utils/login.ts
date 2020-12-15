import { reactive } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import store from '@/store'
import { getCode } from '@/api/login'
import { HttpResponse } from '@/common/interface'

export const loginUtils = () => {
  let sid = ''

  const state = reactive({
    username: '',
    password: '',
    code: '',
    svg: ''
  })
  const _getCode = async () => {
    // 产生唯一标识，用来跟检查对应用户验证码时效性

    if (localStorage.getItem('sid')) {
      sid = localStorage.getItem('sid') || ''
    } else {
      sid = uuidv4()
      // console.log('sid:', sid)
      localStorage.setItem('sid', sid)
      // 更新vuex的sid
      store.commit('setSid', sid)
    }

    // 指定类型  自定义 api接口返回的 Promise<HttpResponse>  HttpResponse
    const { data, code } = await getCode(sid) as HttpResponse
    if (code === 200) {
      state.svg = data
    }
  }
  return {
    _getCode,
    state
  }
}
