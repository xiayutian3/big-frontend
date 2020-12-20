<template>
    <div class="modal" v-show="isShow">
      <div class="mask" @click="close"></div>
      <div class="layui-layer layui-layer-page info" :class="{active:isShow}">
        <div class="layui-layer-title">
          签到活跃榜 - TOP
          <i class="layui-icon layui-icon-close pull-right" @click="close"></i>
        </div>
        <div class="layui-layer-content pd0">
          <div class="layui-tab layui-tab-brief">
            <ul class="layui-tab-title">
              <li :class="{'layui-this':state.current===0}" @click="choose(0)">最新签到</li>
              <li :class="{'layui-this':state.current===1}" @click="choose(1)">今日热议</li>
              <li :class="{'layui-this':state.current===2}" @click="choose(2)">总签到榜</li>
            </ul>
            <div class="layui-tab-content">
              <ul class="layui-tab-item layui-show">
                <li v-for="(item,index) in state.lists" :key="'sign'+index">
                  <img src="/img/bear.jpg" alt class="mr1" />
                  <cite class="fly-link">{{item.name}}</cite>
                  <span class="fly-grey" v-if="state.current !== 2">签到于 {{hours(item.created)}}</span>
                  <span class="fly-grey" v-else>
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

<script lang="ts">
import { hours } from '@/utils/formatDate'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'sign-list',
  props: {
    isShow: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    const state = reactive({
      current: 0,
      lists: []
    })
    const close = () => {
      emit('close-modal')
    }
    const choose = (num: number) => {
      state.current = num
    }
    return {
      state,
      close,
      choose,
      hours
    }
  }

  // vue2 改造前
  // data () {
  //   return {
  //     current: 0,
  //     lists: []
  //   }
  // },
  // methods: {
  //   choose (num) {
  //     this.current = num
  //   },
  //   close () {
  //     this.$emit('close-modal')
  //   }
  // },
})
</script>
<style lang="scss">
</style>
