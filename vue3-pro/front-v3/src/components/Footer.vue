<template>
  <div class="fly-footer">
    <p>
      <a href="http://fly.layui.com/" target="_blank">Imooc社区</a> 2017 &copy;
      <a href="http://www.layui.com/" target="_blank">Imooc.com 出品</a>
    </p>
    <p>
      <a href="http://fly.layui.com/jie/3147/" target="_blank">付费计划</a>
      <a href="http://www.layui.com/template/fly/" target="_blank">获取Fly社区模版</a>
      <a href="http://fly.layui.com/jie/2461/" target="_blank">微信公众号</a>
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import toggleUtils from '@/utils/toggle'

export default defineComponent({
  setup () {
    // const on = ref(false)
    // const toggle = () => {
    //   setTimeout(() => {
    //     on.value = !on.value
    //   }, 500)
    // }
    // return {
    //   on,
    //   toggle
    // }

    // 提取，逻辑复用
    const { toggle, on } = toggleUtils(false, 500)
    return {
      toggle,
      on
    }
  }
})
</script>

<style scoped>

</style>
