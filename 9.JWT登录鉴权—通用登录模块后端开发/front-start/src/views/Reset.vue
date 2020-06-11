<template>
   <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li>
            <router-link :to="{name: 'login'}">登入</router-link>
          </li>
          <li class="layui-this">重置密码</li>
        </ul>
        <div class="layui-form layui-tab-content" id="LAY_ucm" style="padding: 20px 0;">
          <div class="layui-tab-item layui-show">
            <div class="layui-form layui-form-pane">
              <validation-observer ref="observer">
                <form method="post">

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
                      @click="submit"
                      lay-submit
                    >提交</button>
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
import { updateUserPwd } from '@/api/user'
import { getCode } from '@/api/login'
// vee-validate3.x的使用
import { ValidationProvider, ValidationObserver } from 'vee-validate'
export default {
  name: 'reset',
  props: {},
  data () {
    return {
      password: '',
      repassword: '',
      code: '', // 要输入的图片验证码
      svg: '' // 验证码图片
    }
  },
  created () {
    this._getCode()
  },
  mounted () {
  },
  computed: {},
  methods: {
    _getCode () {
      // 会获取验证码,把sid传递过去，用来给redis sid->图形验证码做一一对应  ， 做与当前用户做一一对应，验证码时效性等
      let sid = this.$store.state.sid || localStorage.getItem('sid')
      getCode(sid).then(res => {
        // console.log(res)
        if (res.code === 200) {
          this.svg = res.data
        }
      })
    },
    async submit () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        // ABORT!!
        return
      }
      // 重置的请求
      let resetInfo = {
        key: this.$route.query.key,
        username: this.$route.query.username,
        password: this.password,
        code: this.code,
        sid: this.$store.state.sid || localStorage.getItem('sid')
      }
      let { code, msg } = await updateUserPwd(resetInfo)
      if (code === 200) {
        this.$alert(msg)
        setTimeout(() => {
          this.$router.push({ name: 'login' })
        }, 3000)
      }
    }
  },
  components: {
    ValidationProvider,
    ValidationObserver
  },
  watch: {}
}
</script>
<style lang="scss">
</style>
