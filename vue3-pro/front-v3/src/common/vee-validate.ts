/* eslint-disable @typescript-eslint/camelcase */
import { configure, defineRule } from 'vee-validate'
import { required, email, min, length, max, confirmed, is_not } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import zh from '@vee-validate/i18n/dist/locale/zh_CN.json'

defineRule('required', required)
defineRule('email', email)
defineRule('min', min)
defineRule('length', length)
defineRule('max', max)
defineRule('confirmed', confirmed)
defineRule('is_not', is_not)

const config: any = {
  messages: {
    ...zh.messages,
    required: '请输入{field}',
    min: '请在{field}输入最少0:{length}个字符'
  },
  names: {
    email: '邮箱',
    password: '密码',
    name: '昵称',
    username: '账号',
    code: '验证码',
    oldpassword: '旧密码',
    title: '文章标题',
    catalog: '分类'
  },
  // 可以做自定义的规则，和提示的信息内容
  // (需要在validation-provider加上 name="email"，才会显示自定义的信息。如
  //  <validation-provider name="email" rules="required|email" v-slot="{errors}">)
  fields: {
    catalog: {
      is_not: '请选择{field}'
    },
    email: {
      email: '请输入正确的{field}',
      required: '请输入{field}!!!'
    },
    name: {
      min: (field: any, { length }: any) => {
        return `请在${field}输入至少${length}个字符`
      }
    },
    password: {
      confirmed: (field: any, { target }: any) => {
        console.log('target', target)
        // console.log("field", field)
        return `两次输入的${field}不一致`
      }
    }
  }
}
// vue3中的使用方法，配置中文语言
configure({
  generateMessage: localize('zh_CN', config)
})
