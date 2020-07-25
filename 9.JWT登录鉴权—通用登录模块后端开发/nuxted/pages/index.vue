<template>
  <div class="layui-container">
    <div class="layui-row layui-col-space15">
      <div class="layui-col-md8">
        <!-- <Top/>
        <List/>-->
        <!-- //显示子路由的index路由 -->
        <nuxt-child></nuxt-child>
      </div>
      <div class="layui-col-md4">
        <Tips :lists="tips"/>
        <Sign />
        <HotList :lists="top"/>
        <Ads />
        <Links :lists="links"/>
      </div>
    </div>
  </div>
</template>

<script>
// 可以不用import，nuxt会自动注册组件 component文件下

// import Tips from '~/components/sidebar/Tips'
// import Sign from '~/components/sidebar/Sign'
// import Links from '~/components/sidebar/Links'
// import HotList from '~/components/sidebar/HotList'
// import Ads from '~/components/sidebar/Ads'
// import List from '~/components/contents/List'
// import Top from '~/components/contents/Top'
export default {
  name: 'Index',
  components: {
    // Tips,
    // Sign,
    // Links,
    // HotList,
    // Ads,
    // List,
    // Top
  },
  props: {},
  // 数据预取
  async asyncData({ $axios }) {
    // tips
    const tipsResult = await $axios.$get('/public/tips')
    // hotlist
    const topsResult = await $axios.$get('/public/topWeek')
    // links
    const linksResult = await $axios.$get('/public/links')

    return {
      tips: tipsResult.data || [],
      top: topsResult.data || [],
      links: linksResult.data || [],
    }
  },
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>

<style></style>
