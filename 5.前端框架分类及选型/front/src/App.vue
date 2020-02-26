<template>
  <div id="app">
    <imooc-header></imooc-header>
    <router-view></router-view>
    <imooc-footer></imooc-footer>
  </div>
</template>

<script>
import Header from '@/components/Header'
import Footer from '@/components/Footer'
export default {
  name: 'app',
  components: {
    'imooc-header': Header,
    'imooc-footer': Footer
  }
}
</script>

<style lang="scss">
//本次使用的  dart-sass
// CSS loader 会把把非根路径的url解释为相对路径， 加~前缀才会解释成模块路径。
  @import '~@/assets/layui/css/layui.css';
  @import "~@/assets/css/global.css";
  // @import "~@/assets/layui/css/modules/layer/default/layer.css";
</style>
