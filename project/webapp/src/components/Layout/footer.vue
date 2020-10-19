<template>
  <div>
    <ul class="layout-footer" ref="footer">
      <router-link
        v-for="(tab, index) in tabs"
        :key="'tabs-' + index"
        :to="tab.path"
        class="item"
        active-class="active"
      >
        <svg-icon :icon="tab.icon" :class="['svg-icon-' + tab.icon]"></svg-icon>
        <p>{{ tab.name }}</p>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'my-footer',
  props: {},
  data () {
    return {
      tabs: [
        { name: '首页', icon: 'home', path: '/index' },
        { name: '消息', icon: 'msg', path: '/msg/reply' },
        { name: '热门', icon: 'type', path: '/hot/post' },
        { name: '我的', icon: 'person', path: '/user' }
      ]
    }
  },
  created () {},
  mounted () {
    // 禁止向下向上滑动footer组件，造成body的向下滑动（特别是微信浏览器）
    const elem = this.$refs.footer
    window.forbidScroll(elem)
  },
  computed: {},
  methods: {},
  components: {},
  watch: {
    // 切换 底部 热门的选中状态
    $route (newVal, oldVal) {
      this.$nextTick(() => {
        if (newVal.name === 'hot') {
        // console.log('$route -> newVal', newVal.name)
          var ele = document.getElementsByClassName('item')[2]
          ele.className += ' active'
        } else {
          console.log('$route -> newVal', newVal.name)
          var ele2 = document.getElementsByClassName('item')[2]
          ele2.className = 'item'
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "./footer.scss";
</style>
