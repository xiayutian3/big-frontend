<template>
  <!-- 修改密码 -->
  <div class="layui-form layui-form-pane layui-tab-item layui-show">
    <validation-observer ref="observer">
      <form>
        <div class="layui-form-item">
          <validation-provider name="oldpassword" rules="required|min:6|max:16" v-slot="{ errors }">
            <div class="layui-row">
              <label for="L_nowpass" class="layui-form-label">当前密码</label>
              <div class="layui-input-inline">
                <input type="password" class="layui-input" v-model="oldpassword" />
              </div>
            </div>
            <div class="layui-row">
              <span style="color: #c00">{{ errors[0] }}</span>
            </div>
          </validation-provider>
        </div>
        <div class="layui-form-item">
          <validation-provider name="password" rules="required|min:6|max:16" v-slot="{ errors }">
            <div class="layui-row">
              <label for="L_pass" class="layui-form-label">新密码</label>
              <div class="layui-input-inline">
                <input type="password" v-model="password" class="layui-input" />
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
                <input type="password" v-model="repassword" class="layui-input" />
              </div>
            </div>
            <div class="layui-row">
              <span style="color: #c00;">{{errors[0]}}</span>
            </div>
          </validation-provider>
        </div>
        <div class="layui-form-item">
          <button class="layui-btn" @click="submit">确认修改</button>
        </div>
      </form>
    </validation-observer>
  </div>
</template>

<script>
// vee-validate3.x的使用
import { ValidationProvider, ValidationObserver } from 'vee-validate'
import { changePasswd } from '@/api/user'
export default {
  name: 'password',
  props: {},
  data () {
    return {
      oldpassword: '',
      password: '',
      repassword: ''
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    async submit () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        // ABORT!!
        return
      }
      // 如果输入得新旧密码相同给用户一个提示
      if (this.oldpassword === this.password) {
        this.$alert('新旧密码不得相同，请确认！')
        return
      }
      // 提交的请求
      changePasswd({
        oldpwd: this.oldpassword,
        newpwd: this.password
      }).then(res => {
        if (res.code === 200) {
          this.$alert('密码修改成功')
          this.oldpassword = ''
          this.password = ''
          this.repassword = ''
          // 重置表单
          requestAnimationFrame(() => {
            this.$refs.observer.reset()
          })
        } else {
          this.$alert(res.msg)
        }
      })
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
