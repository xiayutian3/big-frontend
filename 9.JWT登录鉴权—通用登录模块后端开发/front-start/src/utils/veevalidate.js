// 检验的第三方插件（vee-validate3.x的使用）
// extend扩展规则的方法，localize设置语言的方法
import { extend, localize } from 'vee-validate'
import { required, email, min, length, confirmed } from 'vee-validate/dist/rules'

// 引入veevalidate自带的中文语言包
import zh from 'vee-validate/dist/locale/zh_CN.json'

// 扩展校验规则方法extend，第一个空的名字可以随便定义，后边使用的时候，填对应的名字就可以了
extend('email', email)
extend('required', required)
extend('min', min)
extend('length', length)
extend('confirmed', confirmed)

// 设置语言包为中文（默认是英文），
// zh_CN是veevalidate里边定义中文的名字，我们也要通过这个名字来设定中文语言
// localize('zh_CN', zh)

// 换种写法，作用是更改_field_显示的值，为中文
localize('zh_CN', {
  messages: {
    ...zh.messages,
    required: '请输入{_field_}'
  },
  names: {
    email: '邮箱',
    password: '密码',
    name: '昵称',
    username: '账号',
    code: '验证码',
    oldpassword: '旧密码',
    title: '文章标题'
  },
  // 可以做自定义的规则，和提示的信息内容
  // (需要在validation-provider加上 name="email"，才会显示自定义的信息。如
  //  <validation-provider name="email" rules="required|email" v-slot="{errors}">)
  fields: {
    email: {
      email: '请输入正确的{_field_}',
      required: '请输入{_field_}!!!'
    },
    name: {
      min: (field, { length }) => {
        return `请在${field}输入至少${length}个字符`
      }
    },
    password: {
      confirmed: (field, { target }) => {
      // console.log("target", target)
      // console.log("field", field)
        return `两次输入的${field}不一致`
      }
    }
  }
})
