<template>
  <div class="panel">
    <div class="layui-container">
      <ul>
        <router-link tag="li" to="/" class="layui-hide-xs">
          <a href>首页</a>
        </router-link>
        <router-link v-for="(item,index) in lists" :key="'panel'+index" tag="li" :to="item.path">
          <a href>
            {{item.name}}
            <span class="layui-badge-dot" v-if="item.isNew"></span>
          </a>
        </router-link>
        <li class="layui-hide-xs">
          <span class="line"></span>
        </li>
        <template v-if="isLogin">
          <li class="layui-hide-xs">
                  <router-link :to="{name:'mypost'}">我发表的贴</router-link>
                </li>
                <li class="layui-hide-xs">
                  <router-link :to="{name:'mycollection'}">我收藏的贴</router-link>
                </li>
        </template>

      </ul>
      <div class="right layui-hide-xs">
        <span class="layui-icon layui-icon-search"></span>
        <router-link :to="{name:'add'}" class="layui-btn">发表新帖</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'panel',
  props: {},
  data () {
    return {
      lists: [
        {
          name: '提问',
          path: '/index/ask',
          isNew: false
        },
        {
          name: '分享',
          path: '/index/share',
          isNew: true
        },
        {
          name: '讨论',
          path: '/index/discuss',
          isNew: false
        },
        {
          name: '建议',
          path: '/index/advise',
          isNew: false
        },
        {
          name: '公告',
          path: '/index/notice',
          isNew: false
        },
        {
          name: '动态',
          path: '/index/logs',
          isNew: false
        }
      ],
      isLogin: this.$store.state.isLogin
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
<style lang="scss" scoped>
@media (max-width: 768px) {
  .panel {
    height: auto !important;
  }
  ul {
    li {
      width: 33.3%;
    }
  }
}
.panel {
  position: relative;
  height: 50px;
  line-height: 50px;
  margin-bottom: 15px;
  border-radius: 2px;
  background-color: #fff;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  ul {
    li {
      display: inline-block;
      &.layui-this{
        a{
          color: #5fb878;
        }
      }
      a {
        padding: 0 20px;
      }
    }
    .line {
      display: inline-block;
      height: 10px;
      width: 1px;
      background-color: #e2e2e2;
      vertical-align: middle;
      margin: 0 20px;
    }
  }
  .right {
    position: absolute;
    right: 0;
    top: 0;
    .layui-icon-search {
      margin-right: 10px;
      font-size: 20px;
      &:hover {
        color: #5fb878;
        cursor: pointer;
      }
    }
  }
}
</style>
