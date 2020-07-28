<template>
  <Form ref="loginForm" :model="form" :rules="rules" @keydown.enter.native="handleSubmit">
    <FormItem prop="userName">
      <Input v-model="form.userName" placeholder="请输入用户名">
        <span slot="prepend">
          <Icon :size="16" type="ios-person"></Icon>
        </span>
      </Input>
    </FormItem>
    <FormItem prop="password">
      <Input type="password" v-model="form.password" placeholder="请输入密码">
        <span slot="prepend">
          <Icon :size="14" type="md-lock"></Icon>
        </span>
      </Input>
    </FormItem>
        <FormItem prop="code">
      <Input class="imooc-input" type="text" v-model="form.code" placeholder="请输入验证码">
        <span slot="prepend">
          <Icon :size="14" type="md-image"></Icon>
        </span>
         <span class="imooc-code" slot="append" v-html="svg" @click="_getCode"></span>
      </Input>
    </FormItem>
    <FormItem>
      <Button @click="handleSubmit" type="primary" long>登录</Button>
    </FormItem>
  </Form>
</template>
<script>
import axios from 'axios'
export default {
  name: 'LoginForm',
  props: {
    userNameRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '账号不能为空', trigger: 'blur' }
        ]
      }
    },
    passwordRules: {
      type: Array,
      default: () => {
        return [
          { required: true, message: '密码不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  data () {
    return {
      svg: '',
      form: {
        userName: '',
        password: '',
        code: ''
      }
    }
  },
  computed: {
    rules () {
      return {
        userName: this.userNameRules,
        password: this.passwordRules
      }
    }
  },
  mounted () {
    // 获取验证码
    this._getCode()
  },
  methods: {
    handleSubmit () {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.$emit('on-success-valid', {
            userName: this.form.userName,
            password: this.form.password
          })
        }
      })
    },
    // 获取图片验证码
    _getCode () {
      const sid = 'toimc'
      axios.get('http://localhost:3000/public/getCaptcha', {
        params: {
          sid
        }
      }).then(res => {
        const obj = res.data
        if (res.status === 200) {
          this.svg = obj.data
        }
      })
    }
  }
}
</script>
<style lang="less">
.imooc-input{
  .ivu-input-group-append{
    padding: 0;
  }
  .ivu-input-group-prepend{
    width: 32px;
  }
}

.imooc-code{
  display: inline-block;
  padding: 0;
  height: 28px;
  overflow: hidden;
  svg{
    width: 120px;
    position: relative;
    top: -12px;
  }
}
</style>
