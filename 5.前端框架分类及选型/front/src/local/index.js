import { Validator } from 'vee-validate'
// 自定义语言包
const dictionary = {
  zh: {
    messages: {
      required: field => '请输入' + field,
      email: () => '请输入正确的邮箱格式',
      min: '输入的值没有达到最短要求',
      length: () => '验证码长度要求4'
    },
    attributes: {
      email: '邮箱',
      password: '密码',
      name: '账号',
      code: '验证码',
      username: '用户名',
      repass: '一致密码'
    }
  }
}
Validator.localize(dictionary)
