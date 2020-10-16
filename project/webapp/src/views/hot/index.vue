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
      <scroll
        :distance="footerHeight"
        :isEnd="isEnd"
        @on-loadTop="loadTop"
        @on-loadBottom="loadBottom"
      >
        <ul class="content-box" v-if="localType === 'post'">
          <li
            class="content-item"
            v-for="(item, index) in lists"
            :key="'post-' + index"
          >
            <div class="num first" v-if="index === 0">01</div>
            <div class="num second" v-if="index === 1">02</div>
            <div class="num third" v-if="index === 2">03</div>
            <div class="num common" v-if="index < 9 && index > 2">
              {{ "0" + (index + 1) }}
            </div>
            <div class="num common" v-if="index < 50 && index >= 9">
              {{ index + 1 }}
            </div>
            <div class="num" v-else></div>
            <div class="column">
              <div class="title">{{ item.title }}</div>
              <div class="read">
                {{
                  parseInt(item.answer) > 1000
                    ? parseInt(item.answer / 1000).toFixed(1) + "k"
                    : item.answer
                }}
                评论
              </div>
            </div>
            <div class="img" v-if="item.shotpic">
              <img :src="item.shotpic" alt="" />
            </div>
          </li>
        </ul>
        <ul class="content-box" v-if="localType === 'comments'">
          <li
            class="content-item"
            v-for="(item, index) in lists"
            :key="'sigin-' + index"
          >
            <div class="num first" v-if="index === 0">01</div>
            <div class="num second" v-if="index === 1">02</div>
            <div class="num third" v-if="index === 2">03</div>
            <div class="num common" v-if="index < 9 && index > 2">
              {{ "0" + (index + 1) }}
            </div>
            <div class="num common" v-if="index < 50 && index >= 9">
              {{ index + 1 }}
            </div>
            <div class="num" v-else></div>
            <img
              class="user"
              :src="item.cuid ? item.cuid.pic : '/img/bear-200-200.jpg'"
              alt=""
            />
            <div class="column no-between">
              <div class="title">{{ item.cuid&&item.cuid.name? item.cuid.name :'imooc'}}</div>
              <div class="read" v-if="current === 0">
                <span>{{ item.count }}</span> 条评论
              </div>
              <div class="read" v-else>
                {{ item.created | moment }} 发表了评论
              </div>
            </div>
          </li>
        </ul>
        <ul class="content-box" v-if="localType === 'sign'">
          <li
            class="content-item"
            v-for="(item, index) in lists"
            :key="'sigin-' + index"
          >
            <div class="num first" v-if="index === 0">01</div>
            <div class="num second" v-if="index === 1">02</div>
            <div class="num third" v-if="index === 2">03</div>
            <div class="num common" v-if="index < 9 && index > 2">
              {{ "0" + (index + 1) }}
            </div>
            <div class="num common" v-if="index < 50 && index >= 9">
              {{ index + 1 }}
            </div>
            <div class="num" v-else></div>
            <img
              v-if="current === 0"
              class="user"
              :src="item && item.pic ? item.pic : '/img/bear-200-200.jpg'"
              alt=""
            />
            <img
              v-else
              class="user"
              :src="
                item && item.uid && item.uid.pic
                  ? item.uid.pic
                  : '/img/bear-200-200.jpg'
              "
              alt=""
            />
            <div class="column no-between">
              <div class="title">{{ item.name }}</div>
              <div class="read" v-if="current === 0">
                已经连续签到<span>{{ item.count }}</span> 天
              </div>
              <div class="read" v-else>
                {{ item.created | hours }}
              </div>
            </div>
          </li>
        </ul>
      </scroll>
    </div>
    <my-footer></my-footer>
  </div>
</template>

<script>
import { getHotPost, getHotComments, getHotSignRecord } from '@/api/hot'
export default {
  name: 'hot',
  props: ['type'],
  data () {
    return {
      localType: 'post',
      current: 0,
      page: 0,
      limit: 10,
      lists: [],
      isEnd: false,
      footerHeight: 100,
      handle: {},
      isRepeat: false
    }
  },
  created () {},
  mounted () {
    // 刷新的时候
    this.localType = this.type
    // 请求数据
    this.dispatch()
    // 赋值底部的高度
    this.footerHeight = document.getElementsByClassName(
      'layout-footer'
    )[0].offsetHeight
  },
  computed: {},
  methods: {
    init () {
      // 停止加载状态
      if (typeof this.handle === 'function') {
        this.handle()
      }
      this.isEnd = false
      this.isRepeat = false
      // 策略模式 - 发请求
      this.dispatch()
    },
    loadTop (end) {
      this.page = 0
      // 重置scroll位置
      this.handle = end
      this.lists = []
      this.init()
    },
    loadBottom (end) {
      this.page++
      // 重置scroll位置
      this.handle = end
      this.init()
    },
    // 策略模式
    async dispatch () {
      const handler = (res) => {
        // 加入一个请求锁，防止用户多次点击，等待数据返回后，再打开
        this.isRepeat = false
        // 对于异常的判断，res.code 非200，我们给用户一个提示
        // 判断是否lists长度为0，如果为零即可以直接赋值
        // 当Lists长度不为0，后面请求的数据，加入到Lists里面来
        if (res.code === 200) {
          // 判断res.data的长度，如果小于20条，则是最后页
          if (res.data.length < this.limit) {
            this.isEnd = true
          }
          if (this.lists.length === 0) {
            this.lists = res.data
          } else {
            this.lists = this.lists.concat(res.data)
          }
        }
        // 停止加载状态
        if (typeof this.handle === 'function') {
          this.handle()
        }
      }
      const strategies = {
        post: () => {
          return this._getHotPost()
        },
        comments: () => {
          return this._getHotComments()
        },
        sign: () => {
          return this._getHotSignRecord()
        }
      }

      try {
        const result = await strategies[this.localType]()
        handler(result)
      } catch (err) {
        this.isRepeat = false
        if (err) {
          this.$Toast(err.message)
        }
      }
    },
    setIndex (num) {
      this.current = num
      this.lists = []
      // // 策略模式 - 发请求
      // this.dispatch()
      this.page = 0
      this.lists = []
      this.init()
    },
    async _getHotPost () {
      if (this.isRepeat) return
      if (this.isEnd) return
      this.isRepeat = true
      const result = await getHotPost({
        type: this.localType,
        index: this.current,
        page: this.page,
        limit: this.limit
      })
      return result
    },
    async _getHotComments () {
      const result = await getHotComments({
        type: this.localType,
        index: this.current,
        page: this.page,
        limit: this.limit
      })
      return result
    },
    async _getHotSignRecord () {
      const result = await getHotSignRecord({
        type: this.localType,
        index: this.current,
        page: this.page,
        limit: this.limit
      })
      return result
    }
  },
  components: {},
  watch: {
    type (newval, oldval) {
      // 切换大的分类
      console.log('type -> newval', newval)
      if (newval !== this.localType) {
        this.current = 0
        this.localType = newval
        this.lists = []
        this.page = 0
        // 发请求
        this.init()
        // // 策略模式 - 发请求
        // this.dispatch()

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
