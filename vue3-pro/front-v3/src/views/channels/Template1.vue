<template>
    <div class="layui-container">
      <div class="layui-row layui-col-space15">
        <div class="layui-col-md8">
          <!-- <List/> -->
        </div>
        <div class="layui-col-md4">
          <HotList />
          <Ads />
          <Links />
        </div>
      </div>
    </div>
</template>

<script lang="ts">

import Links from '@/components/sidebar/Links.vue'
import HotList from '@/components/sidebar/HotList.vue'
import Ads from '@/components/sidebar/Ads.vue'
import { defineComponent } from 'vue'
// import List from '@/components/contents/List.vue'
export default defineComponent({
  name: 'template1',
  props: {},
  data () {
    return {
    }
  },
  computed: {},
  methods: {},
  components: {
    Links,
    HotList,
    Ads
    // List
  },
  watch: {}
})
</script>
<style lang="scss">
</style>
