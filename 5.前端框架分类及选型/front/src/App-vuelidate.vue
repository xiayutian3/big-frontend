<template>
<!-- 使用vuelidate校验表单参数 两种方法 -->
  <div id="app">
    <div class="layui-container">
      <form class="layui-form layui-form-pane" action>
        <div class="layui-form-item" :class="{ 'form-group--error': $v.name.$error }">
          <label class="layui-form-label">用户名</label>
          <div class="layui-input-inline">
            <!-- <input
              type="text"
              name="title"
              v-model.trim="$v.name.$model"
              placeholder="请输入用户名"
              autocomplete="off"
              class="layui-input"
            /> -->
            <input
              type="text"
              name="title"
              v-model.trim="name"
              @input="setName($event.target.value)"
              placeholder="请输入用户名"
              autocomplete="off"
              class="layui-input"
            />
          </div>
          <div class="error layui-form-mid" v-if="!$v.name.required">用户名不得为空</div>
          <div class="error layui-form-mid" v-if="!$v.name.email">邮箱输入错误</div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">密码</label>
          <div class="layui-input-inline">
            <input
              type="password"
              name="title"
              required
              v-model="password"
              lay-verify="required"
              placeholder="请输入密码"
              autocomplete="off"
              class="layui-input"
            />
          </div>
        </div>
        <div class="layui-form-item">
          <label class="layui-form-label">验证码</label>
          <div class="layui-input-inline">
            <input
              type="text"
              name="title"
              required
              v-model="code"
              lay-verify="required"
              placeholder="请输入验证码"
              autocomplete="off"
              class="layui-input"
            />
          </div>
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
import { required, email } from 'vuelidate/lib/validators'
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
  validations: {
    name: {
      required,
      email
    },
    password: {
      required
    },
    code: {
      required
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
    },
    setName (value) {
      this.name = value
      this.$v.name.$touch()
    }
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
.svg{
  position: relative;
  top: -15px;
}
.error{
  display: none;
}
.form-group--error{
  .error{
    display: block;
  }
}
</style>
