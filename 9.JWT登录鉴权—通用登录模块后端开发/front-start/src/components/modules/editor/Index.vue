<template>
  <div class="edit-wrap">
    <div class="layui-form-item layui-form-text">
      <div class="layui-input-block">
        <div class="layui-unselect fly-edit">
          <span>
            <i class="iconfont icon-yxj-expression"></i>
          </span>
          <span>
            <i class="iconfont icon-tupian"></i>
          </span>
          <span>
            <i class="iconfont icon-lianjie"></i>
          </span>
          <span class="quote">
            “
          </span>
          <span>
            <i class="iconfont icon-emwdaima"></i>
          </span>
            <span>
            hr
          </span>
           <span>
            <i class="iconfont icon-yulan1"></i>
          </span>
        </div>
        <textarea class="layui-textarea fly-editor" name="content"></textarea>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'editor',
  props: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {},
  watch: {}
}
</script>
<style lang="scss">
.edit-wrap{
  .fly-editor{
    height: 260px;
  }
  .quote{
    font-size: 22px;
    vertical-align: middle;
    position: relative;
    top: 4px;
  }
}
</style>
