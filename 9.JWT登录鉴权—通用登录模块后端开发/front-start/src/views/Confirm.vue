<template>
<div class="layui-container flex">
  <div class="layui-row font pb3">确定更新账号为：{{username}}吗？</div>
    <div class="layui-row">
    <button type="button" class="layui-btn" :class="{'layui-btn-disabled':isSend}" @click="submit">确定更新账号吗</button>
    <router-link class="layui-btn layui-btn-primary" to="/">返回首页</router-link>
  </div>
</div>

</template>

<script>
import { updateUsername } from '@/api/user'
let obj
export default {
  name: 'confirm',
  props: {},
  data () {
    return {
      username: '',
      isSend: false
    }
  },
  created () {},
  mounted () {
    // 把查询字符串，问好前边的内容去掉
    let queryStr = window.location.href.replace(/.*\?/, '')
    // 转换为对象
    obj = Object.fromEntries(queryStr.split('&').map(v => v.split('=')))
    // console.log('mounted -> obj', obj)
    // 转义邮箱的@符号，防止乱码
    this.username = decodeURIComponent(obj.username)
  },
  computed: {},
  methods: {
    submit () {
      // 转义邮箱的@符号，防止乱码
      obj.username = this.username
      updateUsername(obj).then(res => {
        if (res.code === 200) {
          this.isSend = true
          this.$alert(res.msg)
          requestAnimationFrame(() => {
            this.$router.push('/')
          })
        }
      })
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.flex{
  display: flex;
  flex-flow: column nowrap;
  justify-content: center;
  align-items: center;
  min-height: 260px;
}
.font{
  font-size: 16px;
  color: #333;
}
</style>
