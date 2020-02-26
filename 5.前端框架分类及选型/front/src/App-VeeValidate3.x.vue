<template>
  <!-- 表单验证 VeeValidate 3.x版本-->
  <div id="app">
    <div class="layui-container">
      <form class="layui-form layui-form-pane" action>
        <div class="layui-form-item">
          <label class="layui-form-label">用户名</label>
          <ValidationProvider name="用户名" rules="required|email" v-slot="{errors}">
            <div class="layui-input-inline">
              <input
                type="text"
                name="name"
                v-model.trim="name"
                placeholder="请输入用户名"
                autocomplete="off"
                class="layui-input"
              />
            </div>
            <span class="error layui-form-mid">{{errors[0]}}</span>
          </ValidationProvider>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">密码</label>
          <ValidationProvider name="密码" rules="required|min:6" v-slot="{errors}">
            <div class="layui-input-inline">
              <input
                type="password"
                name="password"
                v-model="password"
                placeholder="请输入密码"
                autocomplete="off"
                class="layui-input"
              />
            </div>
            <span class="error layui-form-mid">{{errors[0]}}</span>
          </ValidationProvider>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">验证码</label>
          <ValidationProvider name="验证码" rules="required|length:4" v-slot="{errors}">
            <div class="layui-input-inline">
              <input
                type="text"
                name="code"
                v-model="code"
                placeholder="请输入验证码"
                autocomplete="off"
                class="layui-input"
              />
            </div>
            <span class="error layui-form-mid">{{errors[0]}}</span>
          </ValidationProvider>
          <div class="layui-form-mid svg" v-html="svg" @click="getCaptcha"></div>
        </div>
        <button type="button" class="layui-btn">点击登陆</button>
        <a href="http://www.layui.com" class="imooc-link">忘记密码</a>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
// 表单验证 VeeValidate 3.x版本
import { ValidationProvider, extend } from 'vee-validate'

// 规则 全部引入
import * as rules from 'vee-validate/dist/rules'
// 从外边引入的语言包
import zh from 'vee-validate/dist/locale/zh_CN.json'
for (const rule in rules) {
  extend(rule, {
    ...rules[rule],
    message: zh.messages[rule]
  })
}

// 规则 单个引入
// import { required, email, length, min } from 'vee-validate/dist/rules'

// extend('required', {
//   ...required,
//   message: '请输入内容'
//   // message: (filed) => `请输入${filed}内容`  //filed与input中name属性对应
// })
// // extend('email', email)
// extend('email', {
//   ...email,
//   message: '输入的邮箱不正确'
// })
// extend('min', {
//   ...min,
//   message: '输入的长度不够，请从新输入'
// })
// extend('length', {
//   ...length,
//   message: '输入的验证码长度4'
// })

export default {
  name: 'app',
  data () {
    return {
      svg: '',
      name: '',
      password: '',
      code: ''
    }
  },
  mounted () {
    this.getCaptcha()
  },
  methods: {
    getCaptcha () {
      axios.get('http://192.168.0.118:3000/getCaptcha').then(res => {
        if (res.status === 200) {
          const obj = res.data
          if (obj.code === 200) {
            this.svg = obj.data
          }
        }
      })
    }
  },
  components: {
    ValidationProvider
  }
}
</script>

<style lang="scss" scoped>
#app {
  background: #f2f2f2;
}
.layui-container {
  background: #fff;
}
input {
  width: 190px;
}
.imooc-link {
  margin-left: 10px;
  &:hover {
    color: #009688;
  }
}
.svg {
  position: relative;
  top: -15px;
}
.error {
  color: red;
}
</style>
