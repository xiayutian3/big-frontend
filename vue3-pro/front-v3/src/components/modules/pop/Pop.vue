<template>
  <div class="tips animation" :class="{shake:type === 'shake'}" v-show="isShow" ref="tips">
    <div class="content">{{msg}}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'Pop',
  props: {
    type: {
      type: String,
      default: ''
    },
    msg: {
      type: String,
      default: ''
    },
    isShow: {
      type: Boolean,
      default: false
    },
    unmount: {
      type: Function,
      default: () => { console.log('unmount') }
    }
  },
  mounted () {
    // 3s 后关闭
    setTimeout(() => {
      // this.isShow = false
      // this.msg = ''
      // this.type = ''
      // console.log('this.unmount', this.unmount)
      this.unmount()
    }, 3000)
  },
  data () {
    return {}
  },
  watch: {
    isShow (newVal, oldVal) {
      console.log(123456789)
      if (newVal !== oldVal && newVal === true) {
        // 显示pop组件
        setTimeout(() => {
          const height = (this.$refs.tips as HTMLElement).clientHeight
          const width = (this.$refs.tips as HTMLElement).clientWidth as number
          (this.$refs.tips as HTMLElement).style.marginLeft = -width / 2 + 'px';
          (this.$refs.tips as HTMLElement).style.marginTop = -height / 2 + 'px'
        }, 0)
        // 3s 后关闭
        setTimeout(() => {
          // this.isShow = false
          // this.msg = ''
          // this.type = ''
          // console.log('this.unmount', this.unmount)
          this.unmount()
        }, 3000)
      }
    }
  }
})
</script>
<style lang="scss" scoped>
@keyframes shake{
  0%,100%{
    transform: translateX(0);
  }
  10%,30%,50%,70%,90%{
    transform: translateX(-10px);
  }
  20%,40%,60%,80%{
    transform: translateX(10px);
  }
}

.tips{
  position: fixed;
  left: 50%;
  top: 50%;
  z-index: 2000;
}
.animation{
  animation-fill-mode: both;
  animation-duration: .3s;
}
.content {
  background: rgba(0,0,0,.4);
  color: #fff;
  padding: 10px 15px;
  border-radius: 6px;
}
.shake{
  animation-name: shake;
}
</style>
