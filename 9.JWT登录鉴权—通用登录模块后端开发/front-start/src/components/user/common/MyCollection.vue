<template>
  <div class>
    <div>
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
          <tr v-for="(item,index) in list" :key="index">
            <td>
              <router-link class="link" :to="{name:'detail',params:{tid:item.tid}}">{{item.title}}</router-link>
            </td>
            <td class="text-right">{{item.created | moment}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination
      v-show="total>0"
      :total="total"
      :current="current"
      :align="'left'"
      :hasSelect="true"
      :hasTotal="true"
      @changeCurrent="handleChange"
    />
  </div>
</template>

<script>
import { getCollect } from '@/api/user'
import Pagination from '@/components/modules/pagination/Index'
export default {
  name: 'my-collection',
  props: {},
  data () {
    return { list: [], total: 0, current: 0, page: 0, limit: 10 }
  },
  created () {},
  mounted () {
    this.getPostCollect()
  },
  computed: {},
  methods: {
    getPostCollect () {
      getCollect({
        page: this.current,
        limit: this.limit
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data
          this.total = res.total
        }
      })
    },
    /// 点击页码处理（分页处理）
    handleChange (currentPage) {
      this.current = currentPage
      // 重新请求数据
      this.getPostCollect()
    }
  },
  components: { Pagination },
  watch: {}
}
</script>
<style lang="scss" scoped>
.title {
  width: 70%;
}
.link{
  color: #01aaed;
}
</style>
