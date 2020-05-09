<template>
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li>
            <router-link :to="{name: 'login'}">登入</router-link>
          </li>
          <li class="layui-this">注册</li>
        </ul>
        <div class="layui-form layui-tab-content" id="LAY_ucm" style="padding: 20px 0;">
          <div class="layui-tab-item layui-show">
            <div class="layui-form layui-form-pane">
              <validation-observer ref="observer">
                <form method="post">
                  <div class="layui-form-item">
                    <validation-provider name="email" rules="required|email" v-slot="{errors}">
                      <div class="layui-row">
                        <label for="L_email" class="layui-form-label">用户名</label>
                        <div class="layui-input-inline">
                          <input
                            type="text"
                            name="username"
                            v-model="username"
                            placeholder="请输入用户名"
                            autocomplete="off"
                            class="layui-input"
                          />
                        </div>
                        <div class="layui-form-mid layui-word-aux">将会成为您唯一的登入名</div>
                      </div>
                      <div class="layui-row">
                        <span style="color: #c00;">{{errors[0]}}</span>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="layui-form-item">
                    <label for="L_username" class="layui-form-label">昵称</label>
                    <validation-provider name="name" rules="required|min:4" v-slot="{errors}">
                      <div class="layui-input-inline">
                        <input
                          type="text"
                          name="name"
                          v-model="name"
                          placeholder="请输入昵称"
                          autocomplete="off"
                          class="layui-input"
                        />
                      </div>
                      <div class="layui-form-mid">
                        <span style="color: #c00;">{{errors[0]}}</span>
                      </div>
                    </validation-provider>
                  </div>

                  <div class="layui-form-item">
                    <validation-provider
                      name="password"
                      rules="required|min:6|max:16"
                      v-slot="{ errors }"
                    >
                      <div class="layui-row">
                        <label for="L_pass" class="layui-form-label">密码</label>
                        <div class="layui-input-inline">
                          <input
                            type="password"
                            name="password"
                            v-model="password"
                            ref="password"
                            placeholder="请输入密码"
                            autocomplete="off"
                            class="layui-input"
                          />
                        </div>
                        <div class="layui-form-mid layui-word-aux">6到16个字符</div>
                      </div>
                      <div class="layui-row">
                        <span style="color: #c00">{{ errors[0] }}</span>
                      </div>
                    </validation-provider>
                  </div>

                  <div class="layui-form-item">
                    <validation-provider
                      name="repassword"
                      rules="required|min:6|max:16|confirmed:password"
                      v-slot="{errors}"
                    >
                      <div class="layui-row">
                        <label for="L_repass" class="layui-form-label">确认密码</label>
                        <div class="layui-input-inline">
                          <input
                            type="password"
                            name="repassword"
                            v-model="repassword"
                            placeholder="请输入密码"
                            autocomplete="off"
                            class="layui-input"
                          />
                        </div>
                      </div>
                      <div class="layui-row">
                        <span style="color: #c00;">{{errors[0]}}</span>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="layui-form-item">
                    <validation-provider name="code" rules="required|length:4" v-slot="{errors}">
                      <div class="layui-row">
                        <label for="L_vercode" class="layui-form-label">验证码</label>
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
                        <div class>
                          <span class="svg" style="color: #c00;" @click="_getCode()" v-html="svg"></span>
                        </div>
                      </div>
                      <div class="layui-row">
                        <span style="color: #c00;">{{errors[0]}}</span>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="layui-form-item">
                    <button
                      class="layui-btn"
                      lay-filter="*"
                      type="button"
                      @click="register"
                      lay-submit
                    >立即注册</button>
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
                </form>
              </validation-observer>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCode, reg } from '@/api/login'
// vee-validate3.x的使用
import { ValidationProvider, ValidationObserver } from 'vee-validate'
export default {
  name: 'reg',
  data () {
    return {
      username: '',
      name: '',
      password: '',
      repassword: '',
      code: '',
      svg: ''
    }
  },
  mounted () {
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
    },
    async register () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        // ABORT!!
        return
      }
      // 注册的请求
      let regInfo = {
        username: this.username,
        name: this.name,
        password: this.password,
        code: this.code,
        sid: this.$store.state.sid || localStorage.getItem('sid')
      }
      let res = await reg(regInfo)
      if (res.code === 200) {
        this.username = ''
        this.name = ''
        this.password = ''
        this.repassword = ''
        this.code = ''
        // 重置表单
        requestAnimationFrame(() => {
          this.$refs.observer.reset()
        })
        // 跳转到登录界面，让用户登录
        this.$router.push('/login')
      } else {
        // 设置返回的错误提示
        // username -> '用户名已经注册'
        // res.msg = {usernam:[],name:[],code:[]}
        this.$refs.observer.setErrors(res.msg)
      }
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  }
}
</script>
<style lang="scss" scoped>
// 公用样式可以放在App.vue中
</style>
