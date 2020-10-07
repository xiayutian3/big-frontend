<template>
  <div>
    <ul class="tab" ref="tabs">
      <router-link
        class="item"
        :to="item.path"
        :key="'home-tabs-' + index"
        v-for="(item,index) in tabs"
        exact-active-class="active"
      >
        <span class="txt">{{item.name}}</span>
      </router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'tabs',
  data () {
    return {
      tabs: [
        { name: '首页', path: '/index' },
        { name: '提问', path: '/index/ask' },
        { name: '建议', path: '/index/advise' },
        { name: '分享', path: '/index/share' },
        { name: '讨论', path: '/index/discuss' }
      ]
    }
  },
  mounted () {
    // 禁止向下滑动tebs组件，造成body的向下滑动（特别是微信浏览器）
    const elem = this.$refs.tabs
    // console.log('mounted -> elem', elem)
    // elem.addEventListener('touchstart', (evt) => {
    //   console.log(evt.target)
    //   console.log(elem.contains(evt.target))
    // })
    window.forbidScroll(elem)
  }
}
</script>

<style lang="scss" scoped>
@import './tabs.scss';
</style>
