<template>
    <div v-show="isShow" class="modal">
      <div class="mask" @click="close"></div>
      <div class="layui-layer layui-layer-page info" :class="{active:isShow}">
        <div class="layui-layer-title">
          签到活跃榜 - TOP
          <i class="layui-icon layui-icon-close pull-right" @click="close"></i>
        </div>
        <div class="layui-layer-content pd0">
          <div class="layui-tab layui-tab-brief">
            <ul class="layui-tab-title">
              <li :class="{'layui-this':current===0}" @click="choose(0)">最新签到</li>
              <li :class="{'layui-this':current===1}" @click="choose(1)">今日热议</li>
              <li :class="{'layui-this':current===2}" @click="choose(2)">总签到榜</li>
            </ul>
            <div class="layui-tab-content">
              <ul class="layui-tab-item layui-show">
                <li v-for="(item,index) in lists" :key="'sign'+index">
                  <img src="/img/bear.jpg" alt class="mr1" />
                  <cite class="fly-link">{{item.name}}</cite>
                  <span v-if="current !== 2" class="fly-grey">签到于 {{item.created}}</span>
                  <span v-else class="fly-grey">
                    已经连续签到
                    <i class="orange">{{item.count}}</i>天
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
export default {
  name: 'SignList',
  components: {},
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      current: 0,
      lists: []
    }
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {
    choose (num) {
      this.current = num
    },
    close () {
      this.$emit('closeModal')
    }
  }
}
</script>
<style lang="scss">
.wrapper{}
</style>
