<template>
  <div>
    <dl class="fly-panel fly-list-one">
      <dt class="fly-panel-title">本周热议</dt>
      <dd  v-for="(item,index) in lists" :key="'hotlist'+index">
        <a :to="{name:'detail',params:{tid:item._id}}" >{{item.title}}</a>
        <span>
          <i class="iconfont icon-pinglun1"></i> {{item.answer}}
        </span>
      </dd>
      <!-- 无数据时 -->
      <!--
        <div class="fly-none">没有相关数据</div>
      -->
    </dl>
  </div>
</template>

<script>
import { getTop } from '@/api/content'
export default {
  name: 'hotlist',
  props: {},
  data () {
    return {
      lists: []
    }
  },
  created () {
    getTop().then(res => {
      if (res.code === 200) {
        this.lists = res.data
      }
    })
  },
  computed: {},
  methods: {},
  components: {},
  watch: {}
}
</script>
<style lang="scss">
</style>
