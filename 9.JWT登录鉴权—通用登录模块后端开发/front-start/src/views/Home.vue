<template>
  <div class="home">
    <Panel />
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8">
          <List/>
        </div>
        <div class="layui-col-md4">
          <Tips />
          <Sign />
          <HotList />
          <Ads />
          <Links />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Panel from '@/components/Panel'
import Tips from '@/components/sidebar/Tips'
import Sign from '@/components/sidebar/Sign'
import Links from '@/components/sidebar/Links'
import HotList from '@/components/sidebar/HotList'
import Ads from '@/components/sidebar/Ads'
import List from '@/components/contents/List'
export default {
  name: 'home',
  props: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {
    Panel,
    Tips,
    Sign,
    Links,
    HotList,
    Ads,
    List
  },
  watch: {}
}
</script>
<style lang="scss">
.home {
}
</style>
