<template>
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8">
          <Top/>
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
</template>

<script>

import Tips from '@/components/sidebar/Tips'
import Sign from '@/components/sidebar/Sign'
import Links from '@/components/sidebar/Links'
import HotList from '@/components/sidebar/HotList'
import Ads from '@/components/sidebar/Ads'
import List from '@/components/contents/List'
import Top from '@/components/contents/Top'
export default {
  name: 'index',
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
    Tips,
    Sign,
    Links,
    HotList,
    Ads,
    List,
    Top
  },
  watch: {}
}
</script>
<style lang="scss">
.wrapper{}
</style>
