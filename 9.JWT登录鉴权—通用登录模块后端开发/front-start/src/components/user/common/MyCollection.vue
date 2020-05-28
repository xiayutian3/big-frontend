<template>
  <div class="">
    <table class="layui-table">
      <thead>
        <tr>
          <th class="title">
            <div class="layui-table-cell pl0">
              <span>帖子标题</span>
            </div>
          </th>
          <th>
            <div class="layui-table-cell text-right pr0">
              <span>收藏时间</span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>收藏的帖子的标题</td>
          <td class="text-right">2019-01-01 00:00:00</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: 'my-collection',
  props: {},
  data () {
    return {
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
<style lang="scss" scoped>
.title{
  width: 70%;
}
</style>
