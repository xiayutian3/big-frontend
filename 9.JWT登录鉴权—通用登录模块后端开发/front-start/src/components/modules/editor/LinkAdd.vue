<template>
  <transition name="fade">
    <div class="layui-layer layui-layer-page layui-layer-prompt edit-content" v-show="isShow">
      <div class="layui-layer-title">请输入合法链接</div>
      <div class="layui-layer-content">
        <input type="text" class="layui-layer-input" id="inputItem" v-model="link">
      </div>
      <span class="layui-layer-setwin" @click="cancel">
        <a href="###" class="layui-layer-ico layui-layer-close layui-layer-close1"></a>
      </span>
      <div class="layui-layer-btn">
        <a href="###" class="layui-layer-btn0" @click.prevent="submit">确定</a>
           <a href="###" class="layui-layer-btn" @click.prevent="cancel">取消</a>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'link-add',
  props: ['isShow'],
  data () {
    return {
      link: ''
    }
  },
  created () {},
  computed: {},
  methods: {
    submit () {
      if (this.link === '') {
        // input获得焦点事件
        document.getElementById('inputItem').focus()
        this.$pop('shake', '请输入合法的链接')
        return
      }
      this.$emit('addEvent')
      // 重置操作
      setTimeout(() => {
        this.$emit('closeEvent')
        this.link = ''
      })
    },
    cancel () {
      this.$emit('closeEvent')
      this.link = ''
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss">
</style>
