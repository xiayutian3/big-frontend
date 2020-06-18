<template>
  <transition name="fade">
    <div class="layui-layer layui-layer-page layui-layer-prompt edit-content" v-show="isShow">
      <div class="layui-layer-title">请输入内容</div>
      <div class="layui-layer-content">
        <textarea v-model="text" id="content" class="layui-textarea fly-editor" name="content"></textarea>
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
  name: 'Emwdaima',
  props: ['isShow'],
  data () {
    return {
      text: ''
    }
  },
  created () {},
  computed: {},
  methods: {
    submit () {
      if (this.text === '') {
        // 输入框内容获得焦点事件
        document.getElementById('content').focus()
        this.$pop('shake', '请输入内容')
        return
      }
      this.$emit('addEvent', this.text)
      // 重置操作
      setTimeout(() => {
        this.$emit('closeEvent')
        this.text = ''
      })
    },
    cancel () {
      this.$emit('closeEvent')
      this.text = ''
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.edit-content{
  z-index: 1;
}
.fly-editor {
  // width: 700px;
  // height: 260px;
}
</style>
