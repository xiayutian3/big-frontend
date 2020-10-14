<template>
  <div>
    <ul class="links">
      <li><router-link to="/hot/post">热门帖子</router-link></li>
      <li><router-link to="/hot/comments">热门评论</router-link></li>
      <li><router-link to="/hot/sign">签到排行</router-link></li>
    </ul>
    <!-- <router-view></router-view> -->
    <div class="wrapper">
      <ul class="ctrls" v-if="localType === 'post'">
        <li :class="{ active: current === 0 }" @click="setIndex(0)">3日内</li>
        <li :class="{ active: current === 1 }" @click="setIndex(1)">7日内</li>
        <li :class="{ active: current === 2 }" @click="setIndex(2)">30日内</li>
        <li :class="{ active: current === 3 }" @click="setIndex(3)">全部</li>
      </ul>
      <ul class="ctrls" v-else-if="localType === 'comments'">
        <li :class="{ active: current === 0 }" @click="setIndex(0)">
          热门评论
        </li>
        <li :class="{ active: current === 1 }" @click="setIndex(1)">
          最新评论
        </li>
      </ul>
      <ul class="ctrls" v-else-if="localType === 'sign'">
        <li :class="{ active: current === 0 }" @click="setIndex(0)">
          总签到榜
        </li>
        <li :class="{ active: current === 1 }" @click="setIndex(1)">
          今日签到榜
        </li>
      </ul>
    </div>
    <div class="content">
      <ul class="content-box" v-if="localType === 'post'">
        <li class="content-item">
          <div class="num first">01</div>
          <div class="column">
            <div class="title">如何哦基础自学web前端开发 接着</div>
            <div class="read">3.2k 评论</div>
          </div>
          <div class="img">
            <img src="/img/bear-200-200.jpg" alt="" />
          </div>
        </li>
      </ul>
      <ul
        class="content-box"
        v-if="localType === 'comments' || localType === 'sign'"
      >
        <li class="content-item">
          <div class="num first">01</div>
          <img class="user" src="/img/bear-200-200.jpg" alt="" />
          <div class="column no-between">
            <div class="title">如何哦基础自学web前端开发 接着</div>
            <div class="read" v-if="localType === 'comments'">
              <span>228</span> 条评论
            </div>
            <div class="read" v-if="localType === 'sign'">
              2020-10-13 00:00:00
            </div>
          </div>
        </li>
      </ul>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
import {
  getHotPost,
  getHotComments,
  getHotSignRecord
} from '@/api/hot'
export default {
  name: 'hot',
  props: ['type'],
  data () {
    return {
      localType: 'post',
      current: 0,
      page: 0,
      limit: 10,
      hotList: [],
      hotComments: [],
      hotSigns: []
    }
  },
  created () {},
  mounted () {
    // 刷新的时候
    this.localType = this.type
    this._getHotPost()
  },
  computed: {},
  methods: {
    // 策略模式
    dispatch () {
      const strategies = {
        post: () => {
          this._getHotPost()
        },
        comments: () => {
          this._getHotComments()
        },
        sign: () => {
          this._getHotSignRecord()
        }
      }
      return strategies[this.localType]()
    },
    setIndex (num) {
      this.current = num
      // 策略模式 - 发请求
      this.dispatch()
    },
    _getHotPost () {
      getHotPost({
        type: this.localType,
        index: this.current,
        page: this.page,
        limit: this.limit
      }).then(res => {
        if (res.code === 200) {
          this.hotList = res.data
        }
      })
    },
    _getHotComments () {
      getHotComments({
        type: this.localType,
        index: this.current,
        page: this.page,
        limit: this.limit
      }).then(res => {
        if (res.code === 200) {
          this.hotComments = res.data
        }
      })
    },
    _getHotSignRecord () {
      getHotSignRecord({
        type: this.localType,
        index: this.current,
        page: this.page,
        limit: this.limit
      }).then(res => {
        if (res.code === 200) {
          this.hotSigns = res.data
        }
      })
    }
  },
  components: {},
  watch: {
    type (newval, oldval) {
      console.log('type -> newval', newval)
      if (newval !== this.localType) {
        this.current = 0
        this.localType = newval
        // 策略模式 - 发请求
        this.dispatch()

        // 发起不同的请求
        // switch (this.localType) {
        //   case 'post':
        //     this._getHotPost()
        //     break
        //   case 'comments':
        //     this._getHotComments()
        //     break
        //   case 'sign':
        //     this._getHotSignRecord()
        //     break
        // }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.links {
  width: 100%;
  height: $header-height;
  line-height: $header-height;
  text-align: center;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-around;
  box-shadow: 0 0 10px rgba(112, 94, 94, 0.1);
  a {
    color: #666;
  }
  .active {
    color: $primary-color;
    position: relative;
    &:after {
      content: "";
      display: inline-block;
      width: 48px;
      height: 4px;
      position: absolute;
      bottom: -30px;
      right: 36px;
      background: $primary-color;
    }
  }
}
.wrapper {
  padding: 0 20px;
  .ctrls {
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: center;
    li {
      background: rgba(243, 243, 243, 1);
      color: #999;
      height: 50px;
      font-size: 26px;
      font-weight: bold;
      line-height: 50px;
      padding: 0 35px;
      border-radius: 20px;
      margin-right: 25px;
      margin-top: 15px;
      &.active {
        color: rgba(2, 209, 153, 1);
        background: rgba(2, 209, 153, 0.16);
      }
    }
  }
}
.content-box {
  padding: 0 30px;
  .content-item {
    display: flex;
    flex-flow: row nowrap;
    justify-content: space-between;
    align-items: center;
  }
  .num {
    font-size: 36px;
    font-weight: bold;
    &.first {
      color: #ed745e;
    }
    &.second {
      color: #e08435;
    }
    &.third {
      color: #f1ae37;
    }
    &.common {
      color: #999;
    }
  }
  .user {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    padding-left: 20px;
  }
  .column {
    &.no-between {
      justify-content: center;
      .title {
        padding-bottom: 16px;
      }
    }
    flex: 1;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;
    height: 130px;
    padding: 35px 20px;
    .title {
      color: #333;
      font-size: 32px;
      font-weight: bold;
    }
    .read {
      font-size: 26px;
      color: #999;
      span {
        color: #333;
        font-weight: bold;
      }
    }
  }
  .img {
    width: 200px;
    height: 125px;
    border-radius: 12px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
