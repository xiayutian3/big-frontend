<template>
  <div>
    <div class="grey">
      <div class="bg"></div>
      <div class="wrapper">
        <div class="profile">
          <div class="info">
            <img
              class="pic"
              :src="isLogin ? user.pic : '/img/bear-200-200.jpg'"
              alt=""
            />
            <div class="user">
              <p class="name">{{ isLogin ? user.name : "请登录" }}</p>
              <p class="fav">
                <svg-icon icon="fav2" class="icon-fav"></svg-icon>
                积分：8000
              </p>
            </div>
            <div class="link">个人主页</div>
          </div>
          <ul class="stats">
            <li class="item">
              <p>8</p>
              <p class="title">我的帖子</p>
            </li>
            <li class="item">
              <p>8</p>
              <p class="title">收藏夹</p>
            </li>
            <li class="item">
              <p>8</p>
              <p class="title">最近浏览</p>
            </li>
          </ul>
        </div>
      </div>
      <div class="center-wraper">
        <ul class="center-list first">
          <li
            v-for="(item, index) in lists"
            :key="'center-' + index"
            @click="goTo(item.routeName)"
          >
            <i :class="item.icon"></i>
            <span>{{ item.name }}</span>
          </li>
        </ul>
        <ul class="center-list">
          <li v-for="(item, index) in routes" :key="'routes-' + index">
            <router-link :to="item.path">
              <i :class="item.icon"></i>
              <span>{{ item.name }}</span>
            </router-link>
          </li>
        </ul>
      </div>
      <my-footer></my-footer>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'user',
  props: {},
  data () {
    return {
      lists: [
        {
          name: '我的帖子',
          icon: 'icon-teizi',
          routeName: 'mypost'
        },
        {
          name: '修改设置',
          icon: 'icon-setting',
          routeName: 'settings'
        },
        {
          name: '修改密码',
          icon: 'icon-lock2',
          routeName: 'passwd'
        },
        {
          name: '签到中心',
          icon: 'icon-qiandao',
          routeName: 'sign'
        },
        {
          name: '购买记录',
          icon: 'icon-qiandao',
          routeName: '404'
        },
        {
          name: '赞助商',
          icon: 'icon-jiangbei',
          routeName: '404'
        }
      ],
      routes: [
        {
          name: '提问',
          icon: 'icon-question',
          path: '/index/ask'
        },
        {
          name: '分享',
          icon: 'icon-share',
          path: '/index/share'
        },
        {
          name: '讨论',
          icon: 'icon-taolun',
          path: '/index/discuss'
        },
        {
          name: '建议',
          icon: 'icon-advise',
          path: '/index/advise'
        }
      ]
    }
  },
  created () {},
  mounted () {},
  computed: {
    ...mapGetters({
      user: 'user/user', // 'user模块下，user方法 。user模块开启了namespace ，user方法'，给他一个别名 user
      isLogin: 'user/isLogin'
    })
  },
  methods: {
    goTo (name) {}
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss" scoped>
.grey {
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  z-index: 30;
}
a {
  color: #666;
  text-decoration: none;
}
.bg {
  height: 260px;
  //4个参数 ： 左上 右上 右下，左下
  border-radius: 0 0 50% 50%;
  background-color: #16d1a2;
  z-index: 0;
  position: relative;
}
.wrapper {
  width: 100%;
  height: 370px;
  padding: 25px;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 100;
  box-sizing: border-box;
  color: $font-main-color;
  .profile {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    width: 100%;
    height: 100%;
    padding: 30px;
    box-sizing: border-box;
    .name {
      font-size: 36px;
      font-weight: 700;
      margin-bottom: 10px;
      margin-top: 0;
    }
    .link {
      font-size: 24px;
      color: #999;
    }
    .fav {
      display: inline-block;
      padding: 8px 12px;
      background: rgba(2, 209, 153, 0.16);
      border-radius: 12px;
      color: #02d199;
      margin: 0;
      font-size: 22px;
      .icon-fav {
        padding-right: 10px;
      }
    }
    .info,
    .stats {
      display: flex;
      flex-flow: row nowrap;
      justify-content: space-between;
      align-items: center;
    }
    .info {
      margin-bottom: 24px;
    }
    .stats {
      justify-content: space-around;
    }
    .user {
      flex: 1;
      padding-left: 20px;
    }
    .pic {
      width: 120px;
      height: 120px;
      border-radius: 50%;
    }
    .item {
      text-align: center;
      position: relative;
      p {
        margin-top: 14px;
        margin-bottom: 0;
      }
      &:after {
        width: 2px;
        height: 80px;
        background: #ddd;
        content: "";
        position: absolute;
        right: -60px;
        top: 20px;
      }
      &:last-child {
        &:after {
          width: 0;
        }
      }
      .title {
        color: #666;
      }
    }
  }
}
.center-wraper {
  background: #f6f5f8;
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 10;
  .center-list {
    background: #fff;
    margin-bottom: 30px;
    display: flex;
    flex-flow: wrap;
    padding-top: 40px;
    &.first {
      padding-top: 100px;
    }
    li {
      width: 25%;
      text-align: center;
      color: #666;
      margin-bottom: 40px;
      font-size: 26px;
    }
    i {
      display: block;
      margin: 0 auto;
      font-size: 40px;
      width: 56px;
      height: 56px;
      margin-bottom: 20px;
      color: #888;
      background-size: contain;
    }
    .icon-teizi {
      // ~ 相当于引入这个模块 node 的require引入，当成模块来解析了, 前端两种import require引入模块
      background-image: url(~@/assets/images/teizi@2x.png);
    }
    .icon-setting {
      background-image: url(~@/assets/images/setting@2x.png);
    }
    .icon-lock2 {
      background-image: url(~@/assets/images/lock2@2x.png);
    }
    .icon-qiandao {
      background-image: url(~@/assets/images/qiandao@2x.png);
    }
    .icon-record {
      background-image: url(~@/assets/images/record@2x.png);
    }
    .icon-jiangbei {
      background-image: url(~@/assets/images/jiangbei@2x.png);
    }
    .icon-question {
      background-image: url(~@/assets/images/question@2x.png);
    }
    .icon-share {
      background-image: url(~@/assets/images/share@2x.png);
    }
    .icon-taolun {
      background-image: url(~@/assets/images/taolun@2x.png);
    }
    .icon-advise {
      background-image: url(~@/assets/images/advice@2x.png);
    }
  }
}
</style>
