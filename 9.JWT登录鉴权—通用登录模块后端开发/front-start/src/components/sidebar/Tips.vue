<template>
  <div class="fly-panel">
    <h3 class="fly-panel-title">温馨通道</h3>
    <div class="fly-panel-main layui-row">
      <ul class="layui-clear imooc-quick">
        <li class="layui-col-xs6">
          <a href="###" target="_blank">欢迎Star</a>
        </li>
         <li class="layui-col-xs6">
          <a href="###" target="_blank">欢迎Star</a>
        </li>
         <li class="layui-col-xs6">
          <a href="###" target="_blank">欢迎Star</a>
        </li>
         <li class="layui-col-xs6">
          <a href="###" target="_blank">欢迎Star</a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'tips',
  props: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
$border-color:#f2f2f2;
.fly-panel-main {
  padding: 15px;
}
.imooc-quick{
  border: 1px solid $border-color;
  border-right: none;
  border-bottom: none;
  .layui-col-xs6{
    height: 40px;
    line-height: 40px;
    padding: 0 10px;
    border: 1px solid $border-color;
    text-align: center;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    border-left: none;
    border-top: none;
    a{
      display: block;
    }
  }
}
</style>
