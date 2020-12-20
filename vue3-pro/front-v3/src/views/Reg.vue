<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li>
            <router-link :to="{ name: 'login' }">登入</router-link>
          </li>
          <li class="layui-this">注册</li>
        </ul>
        <div
          class="layui-form layui-tab-content"
          id="LAY_ucm"
          style="padding: 20px 0"
        >
          <div class="layui-tab-item layui-show">
            <div class="layui-form layui-form-pane">
              <Form @submit="submit" v-slot="{ errors }">
                <div class="layui-form-item">
                  <!-- <validation-provider name="username" rules="required|email" v-slot="{errors}"> -->
                  <div class="layui-row">
                    <label for="L_email" class="layui-form-label">用户名</label>
                    <div class="layui-input-inline">
                      <Field
                        as="input"
                        type="text"
                        name="username"
                        rules="required|email"
                        v-model="state.username"
                        placeholder="请输入用户名"
                        autocomplete="off"
                        class="layui-input"
                      />
                    </div>
                    <div class="layui-form-mid layui-word-aux">
                      将会成为您唯一的登入名
                    </div>
                  </div>
                  <div class="layui-row">
                    <span style="color: #c00">{{ errors.username }}</span>
                  </div>
                  <!-- </validation-provider> -->
                </div>
                <div class="layui-form-item">
                  <label for="L_username" class="layui-form-label">昵称</label>
                  <!-- <validation-provider name="name" rules="required|min:4" v-slot="{errors}"> -->
                  <div class="layui-input-inline">
                    <Field
                      type="text"
                      as="input"
                      name="name"
                      rules="required|min:4"
                      v-model="state.name"
                      placeholder="请输入昵称"
                      autocomplete="off"
                      class="layui-input"
                    />
                  </div>
                  <div class="layui-form-mid">
                    <span style="color: #c00">{{ errors["name"] }}</span>
                  </div>
                  <!-- </validation-provider> -->
                </div>

                <div class="layui-form-item">
                  <!-- <validation-provider
                      name="password"
                      rules="required|min:6|max:16"
                      v-slot="{ errors }"
                    > -->
                  <div class="layui-row">
                    <label for="L_pass" class="layui-form-label">密码</label>
                    <div class="layui-input-inline">
                      <Field
                        as="input"
                        type="password"
                        name="password"
                        rules="required|min:6|max:16"
                        v-model="state.password"
                        ref="password"
                        placeholder="请输入密码"
                        autocomplete="off"
                        class="layui-input"
                      />
                    </div>
                    <div class="layui-form-mid layui-word-aux">6到16个字符</div>
                  </div>
                  <div class="layui-row">
                    <span style="color: #c00">{{ errors["password"] }}</span>
                  </div>
                  <!-- </validation-provider> -->
                </div>

                <div class="layui-form-item">
                  <!-- <validation-provider
                      name="repassword"
                      rules="required|min:6|max:16|confirmed:password"
                      v-slot="{errors}"
                    > -->
                  <div class="layui-row">
                    <label for="L_repass" class="layui-form-label"
                      >确认密码</label
                    >
                    <div class="layui-input-inline">
                      <Field
                        as="input"
                        type="password"
                        name="repassword"
                        rules="confirmed:@password"
                        v-model="state.repassword"
                        placeholder="请输入密码"
                        autocomplete="off"
                        class="layui-input"
                      />
                    </div>
                  </div>
                  <div class="layui-row">
                    <span style="color: #c00">{{ errors["repassword"] }}</span>
                  </div>
                  <!-- </validation-provider> -->
                </div>
                <div class="layui-form-item">
                  <!-- <validation-provider name="code" rules="required|length:4" v-slot="{errors}"> -->
                  <div class="layui-row">
                    <label for="L_vercode" class="layui-form-label"
                      >验证码</label
                    >
                    <div class="layui-input-inline">
                      <Field
                        as="input"
                        type="text"
                        name="code"
                        rules="required|length:4"
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
                  <div class="layui-row">
                    <span style="color: #c00">{{ errors["code"] }}</span>
                  </div>
                  <!-- </validation-provider> -->
                </div>
                <div class="layui-form-item">
                  <!-- <button
                      class="layui-btn"
                      lay-filter="*"
                      type="button"
                      @click="register"
                      lay-submit
                    >立即注册</button> -->
                  <button class="layui-btn" lay-filter="*" lay-submit>
                    立即注册
                  </button>
                </div>
                <div class="layui-form-item fly-form-app">
                  <span>或者直接使用社交账号快捷注册</span>
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
import { loginService } from '@/common/provides/login'
import { HttpResponse } from '@/common/interface'
import { alert } from '@/components/modules/alert/index.tsx'

export default defineComponent({
  name: 'reg',
  setup () {
    // const state = reactive({
    //   username: '',
    //   name: '',
    //   password: '',
    //   repassword: '',
    //   code: '', // 要输入的图片验证码
    //   svg: '' // 验证码图片
    // })
    const { state, _getCode, regHandle } = loginService()

    const submit = async (values: any, actions: any) => {
      // console.log('submit ~ actions', actions)
      // console.log('submit ~ values', values)
      // 自定义错误消息设置
      const { setErrors, resetForm } = actions
      // 登录请求

      const res = await regHandle()
      const { code, msg } = res as HttpResponse
      if (code === 200) {
        // 成功提示
        alert('注册成功')
        // 延迟设置 重置表单
        requestAnimationFrame(() => {
          console.log('重置表单')
          resetForm()
        })
      } else if (typeof msg === 'object') {
        setErrors({
          ...msg
        })
      } else {
        setErrors({
          code: msg
        })
      }
    }
    onMounted(async () => {
      await _getCode()
    })
    return {
      submit,
      state,
      _getCode
    }
  },
  components: {
    Field,
    Form
  }
})
</script>

<style scoped>
</style>
