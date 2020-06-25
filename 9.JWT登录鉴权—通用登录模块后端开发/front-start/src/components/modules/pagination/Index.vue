<template>
  <div
    class="d-flex"
    :class="{'flex-center':align === 'center','flex-left':align === 'left','flex-right':align === 'right'}"
  >
    <div class="layui-box layui-laypage layui-laypage-default">
      <a @click.prevent="home" class="layui-laypage-pre" v-show="showEnd" :class="{'layui-disabled': current === 0}">
        <i class="layui-icon layui-icon-prev" v-if="showType === 'icon'"></i>
        <template v-else>首页</template>
      </a>
      <a @click.prevent="prev" :class="{'layui-disabled': current === 0}">
        <i class="layui-icon layui-icon-left" v-if="showType === 'icon'"></i>
        <template v-else>上一页</template>
      </a>
      <!-- <a href="###" :class="[true?theme:'',true?'active':'']">1</a> -->

      <!-- current + 2 < page.length 显示 ...    current从0开始，但是页码没有第0页，所以current+1 表示第一页 -->
      <!-- current - 2 > 1 显示 ...    current从0开始，但是页码没有第0页，所以current+1 表示第一页-->
      <a v-if="pages.length > 5 && (current+1 -2)>1" href="###" class="layui-disabled">...</a>
      <template v-for="(item,index) in pages">
        <a
          v-if="item>=(current+1-2)&& item<=(current+1+2)"
          href="###"
          :class="[current === index?theme:'',current === index?'active':'']"
          :key="'page'+index"
          @click.prevent="changeIndex(index)"
        >{{item}}</a>
      </template>
      <a v-if="pages.length > 5 && (current+1 +2)<pages.length" href="###" class="layui-disabled">...</a>

      <a @click.prevent="next" :class="{'layui-disabled': current === pages.length-1}">
        <i class="layui-icon layui-icon-right" v-if="showType === 'icon'"></i>
        <template v-else>下一页</template>
      </a>
      <a @click.prevent="end" class="layui-laypage-next" v-show="showEnd" :class="{'layui-disabled': current === pages.length-1}">
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
import _ from 'lodash'
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
    },
    total: {
      type: Number,
      default: 0
    },
    current: {
      type: Number,
      default: 0
    },
    size: {
      type: Number,
      default: 10
    }
  },
  data () {
    return {
      isSelect: false,
      optIndex: 0,
      options: [10, 20, 30, 50, 100],
      pages: [], // 页码集合
      limit: 10 // 每页条数
    }
  },
  created () {},
  mounted () {
    // 设置select的内容
    this.limit = this.size
    // 初始化分页的长度
    this.initPages()
    // lodash中 ：uniq 数组去重 sortBy 数组排序 concat数组合并
    this.options = _.uniq(_.sortBy(_.concat(this.options, this.size)))
    this.optIndex = this.options.indexOf(this.size)
  },
  computed: {},
  methods: {
    initPages () {
      const len = Math.ceil(this.total / this.limit)
      // 5 -> [1,2,3,4,5] lodsh的range  可以做到
      this.pages = _.range(1, len + 1)
    },
    chooseFav (item, index) {
      if (this.optIndex !== index) {
        // 当页面上的limit发生变化之后，调整current的数值
        this.$emit('changeCurrent', Math.floor(this.limit * this.current / this.options[index]))
      }
      // 选择每页显示的条数后，重新划分页码
      this.optIndex = index
      this.limit = this.options[this.optIndex]
      this.initPages()
    },
    home () {
      this.$emit('changeCurrent', 0)
    },
    end () {
      this.$emit('changeCurrent', this.pages.length - 1)
    },
    prev () {
      let cur = 0
      if (this.current - 1 < 0) {
        cur = 0
      } else {
        cur = this.current - 1
      }
      this.$emit('changeCurrent', cur)
    },
    next () {
      let cur = 0
      if (this.current + 1 > this.pages.length) {
        cur = this.pages.length - 1
      } else {
        cur = this.current + 1
      }
      this.$emit('changeCurrent', cur)
    },
    changeIndex (val) {
      // 点击相应的页码的时候
      this.$emit('changeCurrent', val)
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
.layui-input {
  height: 30px;
  line-height: 30px;
}
.layui-form-select {
  width: 80px;
  position: relative;
  top: -2.5px;
  margin-left: 10px;
}
</style>
