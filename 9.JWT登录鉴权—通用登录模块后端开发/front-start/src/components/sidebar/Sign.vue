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
      <span class="fly-signin-days" v-show="isSign || isLogin">
        已连续签到
        <cite>{{count}}</cite>天
      </span>
    </div>
    <div class="fly-panel-main fly-signin-main">
      <template v-if="!isSign">
        <button class="layui-btn layui-btn-danger" id="LAY_signin" @click="sign">今日签到</button>
        <span>
          可获得
          <cite>{{favs}}</cite>飞吻
        </span>
      </template>

      <!-- 已签到状态 -->

      <template v-else>
        <button class="layui-btn layui-btn-disabled">今日已签到<span>{{formatted}}</span></button>
        <span>
          获得了
          <cite>{{favs}}</cite>飞吻
        </span>
      </template>
    </div>
    <SignInfo :isShow="isShow" @closeModal="close" />
    <SignList :isShow="showList" @closeModal="close" />
  </div>
</template>

<script>
import SignInfo from './SignInfo'
import SignList from './SignList'
import { userSign } from '@/api/user'
import moment from 'moment'
let timer = ''
export default {
  name: 'sign',
  props: {},
  data () {
    return {
      isShow: false,
      showList: false,
      current: 0,
      isSign: false,
      formatted: '' // 签到的剩余时间
    }
  },
  created () {},
  mounted () {
    // 刷新，倒计时同步的问题
    if (localStorage.getItem('timeLeft')) {
      this.countDown()
    }

    // 解决刷新的时候isSign的问题，因为是取localstore，过了24小时再刷新，localstorage还是不变，除非token过期重新请求
    // 判断用户上一次签到时间与签到状态
    // 如果用户上一次签到时间与当天的签到日期相差1天，允许用户经行签到
    const isSign = this.$store.state.userInfo.isSign
    const lastSign = this.$store.state.userInfo.lastSign
    const nowDate = moment().format('YYYY-MM-DD')
    const lastDate = moment(lastSign).format('YYYY-MM-DD')
    // 当前时间用上一次签到时间对比（以天为单位）
    const diff = moment(nowDate).diff(moment(lastDate), 'day')
    if (diff > 0 && isSign) {
      this.isSign = false
    } else {
      this.isSign = isSign
    }
  },
  computed: {
    isLogin () {
      return this.$store.state.isLogin
    },
    favs () {
      let count = parseInt(this.count)
      let result = 0
      // 积分
      if (count < 5) {
        result = 5
      } else if (count >= 5 && count < 15) {
        result = 10
      } else if (count >= 15 && count < 30) {
        result = 15
      } else if (count >= 30 && count < 100) {
        result = 20
      } else if (count >= 100 && count < 365) {
        result = 30
      } else if (count >= 365) {
        result = 50
      }
      return result
    },
    count () {
      if (this.$store.state.userInfo !== {}) {
        if (typeof this.$store.state.userInfo.count !== 'undefined') {
          return this.$store.state.userInfo.count
        } else {
          return 0
        }
      } else {
        return 0
      }
    }
  },
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
    },
    sign () {
      // 判断是否登录
      if (!this.isLogin) {
        this.$pop('shake', '请先登录')
        return
      }
      userSign().then(res => {
        let user = this.$store.state.userInfo
        // 用户签到
        if (res.code === 200) {
          user.favs = res.favs
          user.count = res.count
          this.$pop('', '签到成功')
          // 签到倒计时
          this.countDown()
        } else {
          // 用户已经签到
          this.$pop('', '您已经签到了')
        }
        this.isSign = true
        user.lastSign = res.lastSign
        user.isSign = true
        this.$store.commit('setUserInfo', user)
      })
    },
    countDown () {
      // 签到倒计时
      // create the timestamp here. I use the end of the day here as an example
      let end = moment().endOf('day')
      // console.log(moment().format('YYYY-MM-DD HH:mm:ss'))
      // console.log(end.format('YYYY-MM-DD HH:mm:ss'))
      // console.log(moment(end.diff(moment())).format('HH:mm:ss'))
      timer = setInterval(() => {
        let timeLeft = moment(end.diff(moment())) // get difference between now and timestamp
        localStorage.setItem('timeLeft', timeLeft)
        // utcOffset(0)解决显示多8个小时的问题
        let formatted = moment(timeLeft).utcOffset(0).format('HH:mm:ss') // make pretty
        this.formatted = formatted // or do your jQuery stuff here
        if (timeLeft <= 0) {
          // 重置操作
          this.isSign = false
          clearInterval(timer)
        }
      }, 1000)
    }
  },
  components: {
    SignInfo,
    SignList
  },
  watch: {
    '$store.state.isLogin' (newVal, oldVal) {
      if (!newVal) {
        this.isSign = false
        clearInterval(timer)
      }
    }
  }
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
