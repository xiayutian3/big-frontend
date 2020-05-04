import Vue from 'vue'
import VueI18n from 'vue-i18n'
// 引入veevalidate自带的中文语言包
import zh from 'vee-validate/dist/locale/zh_CN.json'

Vue.use(VueI18n)

// 设置语言包为中文（默认是英文），
// zh_CN是veevalidate里边定义中文的名字，我们也要通过这个名字来设定中文语言
const i18n = new VueI18n({
  // 去掉警告
  silentTranslationWarn: true,
  locale: 'zh_CN',
  messages: {
    zh_CN: {
      // 对应names的内容
      fields: {
        email: '邮箱',
        password: '密码',
        name: '昵称',
        username: '账号',
        code: '验证码'
      },
      // validation: zh.messages
      // 扩展提示内容（第一种方式）
      validation: {
        ...zh.messages,
        required: '请输入{_field_}',
        email: '请输入正确的{_field_}'
      }
    }
  }
})
export {
  i18n
}
