<template>
  <div class="fly-panel fly-signin">
    <div class="fly-panel-title">
      签到
      <i class="fly-mid"></i>
      <a href="javascript:;" class="fly-link" id="LAY_signinHelp" @click="showInfo">说明</a>
      <i class="fly-mid"></i>
      <a href="javascript:;" class="fly-link" id="LAY_signinTop" @click="showTop">
        活跃榜
        <span class="layui-badge-dot"></span>
      </a>
      <span class="fly-signin-days">
        已连续签到
        <cite>16</cite>天
      </span>
    </div>
    <div class="fly-panel-main fly-signin-main">
      <button class="layui-btn layui-btn-danger" id="LAY_signin">今日签到</button>
      <span>
        可获得
        <cite>5</cite>飞吻
      </span>

      <!-- 已签到状态 -->
      <!--
          <button class="layui-btn layui-btn-disabled">今日已签到</button>
          <span>获得了<cite>20</cite>飞吻</span>
      -->
    </div>
    <SignInfo :isShow="isShow" @closeModal="close"/>
    <SignList :isShow="showList" @closeModal="close"/>
  </div>
</template>

<script>
import SignInfo from './SignInfo'
import SignList from './SignList'
export default {
  name: 'sign',
  props: {},
  data () {
    return {
      isShow: false,
      showList: false,
      current: 0
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    showInfo () {
      this.isShow = true
    },
    showTop () {
      this.showList = true
    },
    close () {
      this.isShow = false
      this.showList = false
    },
    choose (num) {
      this.current = num
    }
  },
  components: {
    SignInfo,
    SignList
  },
  watch: {}
}
</script>
<style lang="scss">
@keyframes bounceIn {
  0% {
    opacity: 0;
    transform: scale(0.5);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20000;
  background-color: rgba(0, 0, 0, 0.8);
}
.layui-layer {
  position: fixed;
  width: 300px;
  height: 480px;
  top: 50%;
  left: 50%;
  margin-top: -240px;
  margin-left: -150px;
  background: #fff;
  z-index: 21000;
  &.active {
    animation-fill-mode: both;
    animation-duration: 0.2s;
    animation-name: bounceIn;
  }
  .layui-layer-title {
    height: 42px;
    line-height: 42px;
    padding: 0 20px;
    color: #333;
    background-color: #f8f8f8;
  }
  .layui-layer-content {
    padding: 20px;
  }
  .layui-tab-content {
    padding: 0 10px;
  }
  .layui-tab-item {
    line-height: 45px;
    li {
      &:last-child {
        border-bottom: none;
      }
      border-bottom: 1px dotted #dcdcdc;
    }
    img {
      width: 30px;
      height: 30px;
      border-radius: 2px;
    }
  }
}
</style>
