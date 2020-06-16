<template>
<transition name="fade">
  <div v-show="isShow" class="layui-layer layui-layer-tips layui-edit-face edit-content">
    <div class="layui-layer-content">
      <ul class="layui-clear">
        <li v-for="(item,key) in lists" :key="key" @click="handleFaceClick(key)">
          <img :src="item" alt="">
        </li>
      </ul>
    </div>
  </div>
</transition>
</template>

<script>
import faces from '@/assets/js/face'
export default {
  name: 'face',
  props: {
    isShow: {
      type: Boolean,
      default: false
    },
    ctrl: {
      type: HTMLSpanElement
    }
  },
  data () {
    return {
      lists: faces
    }
  },
  created () {},
  mounted () {
    // 点击body 触发表情框的关闭事件
    this.$nextTick(() => {
      document.querySelector('body').addEventListener('click', this.handleBodyClick)
    })
  },
  // 全局绑定bodyclick事件很危险，多次使用这个组件 body上会多次绑定，所以不用使用要清除掉
  // 离开当前的url就会触发销毁事件
  beforeDestroy () {
    document.querySelector('body').removeEventListener('click', this.handleBodyClick)
  },
  computed: {},
  methods: {
    handleFaceClick (item) {
      this.$emit('addEvent', item)
      // 关闭弹窗事件
      this.$emit('closeEvent')
    },
    handleBodyClick (e) {
      // 防止事件冒泡
      e.stopPropagation()
      // 如果没有 ctrl传入。直接返回
      if (typeof this.ctrl === 'undefined') return
      // 触发隐藏本组件的关闭事件，改变isShow的状态
      // 判断是否点击到了非控制ICON以外的地方
      // js的contains方法用来查看dom元素的包含关系，
      if (!this.ctrl.contains(e.target)) {
        this.$emit('closeEvent')
      }
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss">
</style>
