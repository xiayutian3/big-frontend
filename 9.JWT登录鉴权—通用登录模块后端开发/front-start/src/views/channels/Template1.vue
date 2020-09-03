<template>
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8">
          <List/>
        </div>
        <div class="layui-col-md4">
          <HotList />
          <Ads />
          <Links />
        </div>
      </div>
    </div>
</template>

<script>

import Links from '@/components/sidebar/Links'
import HotList from '@/components/sidebar/HotList'
import Ads from '@/components/sidebar/Ads'
import List from '@/components/contents/List'
export default {
  name: 'template1',
  props: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {
    Links,
    HotList,
    Ads,
    List
  },
  watch: {}
}
</script>
<style lang="scss">
.wrapper{}
</style>
