<template>
  <div class="layui-container fly-marginTop fly-user-main">
    <ul class="layui-nav layui-nav-tree" lay-filter="test">
      <!-- 侧边导航: <ul class="layui-nav layui-nav-tree layui-nav-side"> -->
      <li class="layui-nav-item" v-for="(item,index) in lists" :key="'center'+index">
        <router-link :to="{name:item.link}" class="link-item" :active-class="item.activeClass">
          <svg class="custom-icon" aria-hidden="true">
            <use :xlink:href="`#${item.icon}`"></use>
          </svg>
          {{item.name}}
          </router-link>
      </li>
    </ul>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'center',
  props: {},
  data () {
    return {
      lists: [
        {
          name: '我的主页',
          icon: 'icon-HOMEMESSAGE',
          link: 'home'
        },
        {
          name: '用户中心',
          icon: 'icon-HOMEMESSAGE',
          link: 'center'
        },
        {
          name: '基本设置',
          icon: 'icon-setting',
          link: 'info',
          activeClass: 'layui-this' // 被激活的时候
        },
        {
          name: '我的帖子',
          icon: 'icon-document1',
          link: 'mypost',
          activeClass: 'layui-this' // 被激活的时候
        },
        {
          name: '我的消息',
          icon: 'icon-message1',
          link: 'msg'
        },
        {
          name: '其他设置',
          icon: 'icon-product',
          link: 'others'
        }

      ]
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
<style lang="scss">
.link-item{
  display: flex !important;
  align-items: center;
  .custom-icon {
    margin-right: 10px;
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
    font-size: 25px;
  }
}

</style>
