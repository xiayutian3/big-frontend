<template>
  <transition name="fade">
    <div id="preview" class=" layui-layer-page layui-layer-prompt edit-content" v-show="isShow">
      <div class="layui-layer-title">预览</div>
      <div class="layui-layer-content">
        <div class="detail-body" v-html="replaceContent"></div>
      </div>
      <span class="layui-layer-setwin" @click="cancel">
        <a href="###" class="layui-layer-ico layui-layer-close layui-layer-close1"></a>
      </span>
    </div>
  </transition>
</template>

<script>
import { escapeHtml } from '@/utils/escapeHtml'
export default {
  name: 'preview',
  props: ['isShow', 'content'],
  data () {
    return {
    }
  },
  created () {},
  computed: {
    replaceContent () {
      // 根据content的内容，转义成为html代码
      if (typeof this.content === 'undefined' || this.content.trim() === '') {
        return
      }
      return escapeHtml(this.content)
    }
  },
  methods: {
    cancel () {
      this.$emit('closeEvent')
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
#preview{
  position: fixed;
  width: 100%;
  height: 100%;
  background: #fff;
  top: 0;
  left: 0;
  z-index: 10000;
  box-shadow: 0 0 20px rgba(0,0,0,.2);
}
</style>
