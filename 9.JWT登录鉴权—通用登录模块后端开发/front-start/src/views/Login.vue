<template>
  <!-- 使用的是veevalidate@3.x版本 -->
  <div class="layui-container fly-marginTop">
    <div class="fly-panel fly-panel-user" pad20>
      <div class="layui-tab layui-tab-brief" lay-filter="user">
        <ul class="layui-tab-title">
          <li class="layui-this">登入</li>
          <li>
            <router-link :to="{name: 'reg'}">注册</router-link>
          </li>
        </ul>
        <div class="layui-form layui-tab-content" id="LAY_ucm" style="padding: 20px 0;">
          <div class="layui-tab-item layui-show">
            <div class="layui-form layui-form-pane">
              <!-- validation-observer v-slot="{validate}"   把validate方法从里边拿出来 -->
              <!-- <validation-observer ref="observer" v-slot="{validate}"> -->
                <!-- 下面这种也可以，不需要v-slot -->
                <validation-observer ref="observer">
                <form method="post">
                  <div class="layui-form-item">
                    <label for="L_email" class="layui-form-label">用户名</label>
                    <!-- 使用veevalidate@3.x版本形式，rules，对应扩展时候的extend定义的名字 -->
                    <!-- name="用户名" 对应显示{file}的内容，但是不推荐直接在标签上边添加-->
                    <!-- <validation-provider name="邮箱" rules="required|email" v-slot="{errors}"> -->
                    <validation-provider name="email" rules="required|email" v-slot="{errors}">
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
                      <div class="layui-form-mid">
                        <span style="color: #c00;">{{errors[0]}}</span>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="layui-form-item">
                    <label for="L_pass" class="layui-form-label">密码</label>
                    <validation-provider name="password" rules="required|min:6" v-slot="{errors}">
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
                      <div class="layui-form-mid">
                        <span style="color: #c00;">{{errors[0]}}</span>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="layui-form-item">
                    <validation-provider name="code" ref="codeFileld" rules="required|length:4" v-slot="{errors}">
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
                      <div class="layui-form-mid">
                        <span style="color: #c00;">{{errors[0]}}</span>
                      </div>
                    </validation-provider>
                  </div>
                  <div class="layui-form-item">
                    <!-- validation-observer 的validate方法验证通过，才会执行submit -->
                    <!-- <button class="layui-btn" type="button" @click="validate().then(submit)">立即登录</button> -->
                    <!-- 下面这种也可以，不需要validate方法 -->
                    <button class="layui-btn" type="button" @click="submit">立即登录</button>
                    <span style="padding-left:20px;">
                      <router-link :to="{name: 'forget'}">忘记密码？</router-link>
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
import { getCode, login } from '@/api/login'
// vee-validate3.x的使用
import { ValidationProvider, ValidationObserver } from 'vee-validate'
// uuid 生成唯一的id
// import uuidv4 from 'uuid/v4'  //也可以写成这样
import { v4 as uuidv4 } from 'uuid'
export default {
  name: 'login',
  data () {
    return {
      username: '',
      password: '',
      code: '',
      svg: ''
    }
  },
  mounted () {
    // 测试vue 的小技巧
    // window.vue = this

    // 产生唯一标识，用来跟检查对应用户验证码时效性

    let sid = ''
    if (localStorage.getItem('sid')) {
      sid = localStorage.getItem('sid')
    } else {
      sid = uuidv4()
      // console.log('sid:', sid)
      localStorage.setItem('sid', sid)
      // 更新vuex的sid
      this.$store.commit('setSid', sid)
    }

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
    async submit () {
      const isValid = await this.$refs.observer.validate()
      if (!isValid) {
        // ABORT!!
        return
      }
      login({
        username: this.username,
        password: this.password,
        code: this.code,
        sid: this.$store.state.sid || localStorage.getItem('sid')
      }).then(res => {
        if (res.code === 200) {
          // 同步vuex的用户信息
          this.$store.commit('setUserInfo', res.data)
          this.$store.commit('setIsLogin', true)
          // 登录成功 后重置数据
          this.username = ''
          this.password = ''
          this.code = ''
          // 重置表单项
          // this.$refs.observer.reset()
          // 或者像下面这样
          requestAnimationFrame(() => {
            this.$refs.observer.reset()
            this.$router.push({ name: 'index' })
          })
          // this.$router.push({ name: 'index' })
          // console.log(res)
        } else if (res.code === 401) {
          // 图片验证码验证失败(validate插件以数组的形式返回，所以设置的时候也得用数组的形式)
          this.$refs.codeFileld.setErrors([res.msg])
        }
      }).catch(err => {
        // 从err中把data取出来
        const data = err.response.data
        if (data.code === 500) {
          this.$alert('用户名密码校验失败，请检查！')
        } else {
          this.$alert('服务器出错误')
        }
      })
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
