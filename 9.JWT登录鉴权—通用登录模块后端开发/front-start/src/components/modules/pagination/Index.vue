<template>
  <div
    class="d-flex"
    :class="{'flex-center':align === 'center','flex-left':align === 'left','flex-right':align === 'right'}"
  >
    <div class="layui-box layui-laypage layui-laypage-default">
      <a href="###" class="layui-laypage-pre layui-disabled" data-page="0" v-show="showEnd">
        <i class="layui-icon layui-icon-prev" v-if="showType === 'icon'"></i>
        <template v-else>首页</template>
      </a>
      <a href="###" data-page="2">
        <i class="layui-icon layui-icon-left" v-if="showType === 'icon'"></i>
        <template v-else>上一页</template>
      </a>
      <a href="###" :class="[true?theme:'',true?'active':'']">1</a>
      <a href="###">2</a>
      <a href="###">3</a>
      <a href="###">4</a>
      <a href="###">5</a>
      <a href="###">
        <i class="layui-icon layui-icon-right" v-if="showType === 'icon'"></i>
        <template v-else>下一页</template>
      </a>
      <a href="###" data-page="2" class="layui-laypage-next" v-show="showEnd">
        <i class="layui-icon layui-icon-next" v-if="showType === 'icon'"></i>
        <template v-else>尾页</template>
      </a>
    </div>
    <div class="total" v-if="hasTotal">
      到第
      <input type="text" class="imooc-input" />页 共 total 页
    </div>
    <div class="layui-input-inline" style="width:190px;" v-if="hasSelect">
      <div
        class="layui-unselect layui-form-select"
        @click="isSelect = !isSelect"
        :class="{'layui-form-selected':isSelect}"
      >
        <div class="layui-select-title">
          <input
            type="text"
            placeholder="请选择"
            readonly
            v-model="options[optIndex]"
            class="layui-input layui-unselect"
          />
          <i class="layui-edge"></i>
        </div>
        <dl class="layui-anim layui-anim-upbit">
          <dd
            v-for="(item,index) in options"
            :key="'favList'+ index"
            @click="chooseFav(item,index)"
            :class="{'layui-this':index === optIndex}"
          >{{item}}</dd>
        </dl>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'pagination',
  props: {
    align: {
      type: String,
      default: 'center'
    },
    showType: {
      type: String,
      default: 'icon'
    },
    showEnd: {
      type: Boolean,
      default: false
    },
    theme: {
      type: String,
      default: 'layui-bg-green'
    },
    hasTotal: {
      type: Boolean,
      default: false
    },
    hasSelect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isSelect: false,
      optIndex: 0,
      options: [10, 20, 30, 50, 100]
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    chooseFav (item, index) {
      this.optIndex = index
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.layui-laypage {
  a {
    margin-left: -1px !important;
    &.active {
      border-radius: 2px;
      position: relative;
      z-index: 100;
    }
    // &:first-child {
    //   border-right: 0;
    // }
    // &:last-child {
    //   // border-left: 0;
    // }
  }
}
.layui-bg-green {
  border-color: #009688;
}
.total {
  color: rgba(51, 51, 51, 1);
  margin-left: 20px;
  position: relative;
  top: -2px;
}
.imooc-input {
  text-align: center;
  width: 30px;
  padding: 0 5px;
  height: 28px;
  line-height: 28px;
}
.layui-input{
  height: 30px;
  line-height: 30px;
}
.layui-form-select{
  width: 80px;
  position: relative;
  top: -2.5px;
  margin-left: 10px;
}
</style>
