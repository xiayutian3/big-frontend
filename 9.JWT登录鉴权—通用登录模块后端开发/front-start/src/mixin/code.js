import { getCode } from '@/api/login'
// vee-validate3.x的使用
import { ValidationProvider, ValidationObserver } from 'vee-validate'
// uuid 生成唯一的id
// import uuidv4 from 'uuid/v4'  //也可以写成这样
import { v4 as uuidv4 } from 'uuid'

const CodeMix = {
  data () {
    return {
      code: '',
      svg: ''
    }
  },
  created () {
    // 产生唯一标识，用来跟检查对应用户验证码时效性

    let sid = ''
    if (localStorage.getItem('sid')) {
      sid = localStorage.getItem('sid')
    } else {
      sid = uuidv4()
      // console.log('sid:', sid)
      localStorage.setItem('sid', sid)
      // 更新vuex的sid
      this.$store.commit('setSid', sid)
    }

    this._getCode()
  },
  methods: {
    _getCode () {
      // 会获取验证码,把sid传递过去，用来做与当前用户做一一对应，验证码时效性等
      let sid = this.$store.state.sid || localStorage.getItem('sid')
      getCode(sid).then(res => {
        // console.log(res)
        if (res.code === 200) {
          this.svg = res.data
        }
      })
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  }
}
export default CodeMix
