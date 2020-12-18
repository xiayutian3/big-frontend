<template>
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8">
          <!-- <Top/>
          <List/> -->
        </div>
        <div class="layui-col-md4">
          <Tips />
          <!-- <Sign /> -->
          <HotList />
          <Ads />
          <Links />
        </div>
      </div>
    </div>
</template>

<script lang="ts">

import Tips from '@/components/sidebar/Tips.vue'
// import Sign from '@/components/sidebar/Sign'
import Links from '@/components/sidebar/Links.vue'
import HotList from '@/components/sidebar/HotList.vue'
import Ads from '@/components/sidebar/Ads.vue'
import { defineComponent } from 'vue'
// import List from '@/components/contents/List'
// import Top from '@/components/contents/Top'
export default defineComponent({
  name: 'index',
  props: {},
  data () {
    return {
    }
  },
  computed: {},
  methods: {},
  components: {
    Tips,
    // Sign,
    Links,
    HotList,
    Ads
    // List,
    // Top
  },
  watch: {}
})
</script>
<style lang="scss">
.wrapper{}
</style>
