<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li class="layui-this">登入</li>
          <li>
            <router-link :to="{ name: 'reg' }">注册</router-link>
          </li>
        </ul>
        <div
          class="layui-form layui-tab-content"
          id="LAY_ucm"
          style="padding: 20px 0"
        >
          <div class="layui-tab-item layui-show">
            <div class="layui-form layui-form-pane">
              <!-- <Form @submit="submit" v-slot="{validate,errors}"> -->
                 <Form @submit="submit" v-slot="{errors}">
                  <div class="layui-form-item">
                    <label for="L_email" class="layui-form-label">用户名</label>
                    <!-- <validation-provider name="email" rules="required|email" v-slot="{errors}"> -->
                    <div class="layui-input-inline">
                      <Field
                        type="text"
                        as="input"
                        rules="required|email"
                        name="username"
                        v-model="state.username"
                        placeholder="请输入用户名"
                        autocomplete="off"
                        class="layui-input"
                      />
                    </div>
                    <div class="layui-form-mid">
                      <span style="color: #c00">{{ errors.username }}</span>
                    </div>
                    <!-- </validation-provider> -->
                  </div>
                  <div class="layui-form-item">
                    <label for="L_pass" class="layui-form-label">密码</label>
                    <!-- <validation-provider name="password" rules="required|min:6" v-slot="{errors}"> -->
                    <div class="layui-input-inline">
                      <Field
                        type="password"
                        as="input"
                        rules="required|min:6"
                        name="password"
                        v-model="state.password"
                        placeholder="请输入密码"
                        autocomplete="off"
                        class="layui-input"
                      />
                    </div>
                    <div class="layui-form-mid">
                      <span style="color: #c00">{{ errors.password }}</span>
                    </div>
                    <!-- </validation-provider> -->
                  </div>
                  <div class="layui-form-item">
                    <!-- <validation-provider name="code" ref="codeFileld" rules="required|length:4" v-slot="{errors}"> -->
                    <div class="layui-row">
                      <label for="L_vercode" class="layui-form-label"
                        >验证码</label
                      >
                      <div class="layui-input-inline">
                        <Field
                          type="text"
                          as="input"
                          rules="required|length:4"
                          name="code"
                          v-model="state.code"
                          placeholder="请输入验证码"
                          autocomplete="off"
                          class="layui-input"
                        />
                      </div>
                      <div class>
                        <span
                          class="svg"
                          style="color: #c00"
                          @click="_getCode()"
                          v-html="state.svg"
                        ></span>
                      </div>
                    </div>
                    <div class="layui-form-mid">
                      <span style="color: #c00">{{ errors.code }}</span>
                    </div>
                    <!-- </validation-provider> -->
                  </div>
                  <div class="layui-form-item">
                    <!-- <button class="layui-btn" type="button" @click="validate().then(submit)"> -->
                       <button class="layui-btn" type="submit">
                      立即登录
                    </button>
                    <span style="padding-left: 20px">
                      <a :to="{ name: 'forget' }"
                        >忘记密码？</a
                      >
                    </span>
                  </div>
                  <div class="layui-form-item fly-form-app">
                    <span>或者使用社交账号登入</span>
                    <a
                      href
                      onclick="layer.msg('正在通过QQ登入', {icon:16, shade: 0.1, time:0})"
                      class="iconfont icon-qq"
                      title="QQ登入"
                    ></a>
                    <a
                      href
                      onclick="layer.msg('正在通过微博登入', {icon:16, shade: 0.1, time:0})"
                      class="iconfont icon-weibo"
                      title="微博登入"
                    ></a>
                  </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Field, Form } from 'vee-validate'
import { defineComponent, onMounted } from 'vue'
// import { defineComponent, onMounted, reactive } from 'vue'
// import { v4 as uuidv4 } from 'uuid'
// import store from '@/store'
// import { getCode } from '@/api/login'
// import { HttpResponse } from '@/common/interface'

// 功能函数抽离了出来后，封装后，函数有自己的作用域
import { loginService } from '@/common/provides/login'
import { HttpResponse } from '@/common/interface'

export default defineComponent({
  name: 'login',
  setup () {
    // const state = reactive({
    //   username: '',
    //   password: '',
    //   code: '',
    //   svg: ''
    // })
    // const _getCode = async () => {
    //   // 产生唯一标识，用来跟检查对应用户验证码时效性

    //   let sid = ''
    //   if (localStorage.getItem('sid')) {
    //     sid = localStorage.getItem('sid') || ''
    //   } else {
    //     sid = uuidv4()
    //     // console.log('sid:', sid)
    //     localStorage.setItem('sid', sid)
    //     // 更新vuex的sid
    //     store.commit('setSid', sid)
    //   }

    //   // 指定类型  自定义 api接口返回的 Promise<HttpResponse>  HttpResponse
    //   const { data, code } = await getCode(sid) as HttpResponse
    //   if (code === 200) {
    //     state.svg = data
    //   }
    // }

    // 封装后的函数
    const { _getCode, state, loginHandle } = loginService()

    // 点击登录
    const submit = async (values: any, actions: any) => {
      // console.log('submit ~ actions', actions)
      // console.log('submit ~ values', values)
      // 自定义错误消息设置
      const { setErrors, resetForm } = actions
      // 登录请求

      const res = await loginHandle()
      const { code, msg } = res as HttpResponse
      if (code === 200) {
        // 延迟设置 重置表单
        requestAnimationFrame(() => {
          resetForm()
        })
      } else if (typeof msg === 'string') {
        setErrors({
          code: msg
        })
      }
      // // 自定义错误消息设置
      // const { setErrors } = actions
      // setErrors({
      //   code: '图形验证码错误'
      // })
    }
    onMounted(async () => {
      await _getCode()
    })
    return {
      // ...state, // 会让state中的响应式，失去响应式的属性（不能使用...state）
      state,
      submit,
      _getCode
    }
  },
  components: {
    Field,
    Form
  }
})
</script>

<style lang="scss" scoped>
</style>
