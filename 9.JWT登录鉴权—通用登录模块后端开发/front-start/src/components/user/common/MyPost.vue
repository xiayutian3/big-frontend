<template>
  <div>
    <div class="overflow">
      <table class="layui-table" cellspacing="0" cellpadding="0" border="0">
        <thead>
          <tr class="layui-table-header">
            <th>
              <div class="layui-table-cell pl0">
                <span>帖子标题</span>
              </div>
            </th>
            <th>
              <div class="layui-table-cell">
                <span>状态</span>
              </div>
            </th>
            <th>
              <div class="layui-table-cell">
                <span>结帖</span>
              </div>
            </th>
            <th>
              <div class="layui-table-cell">
                <span>发表时间</span>
              </div>
            </th>
            <th>
              <div class="layui-table-cell">
                <span>数据</span>
              </div>
            </th>
            <th class="min-cell">
              <div class="layui-table-cell">
                <span>操作</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="text-center" v-for="(item,index) in list" :key="index">
            <td class="text-left">
              <router-link class="link" :to="{name:'detail',params:{tid:item._id}}">
                {{item.title}}
              </router-link>
              </td>
            <td>{{item.status === '0'?'打开':'关闭'}}</td>
            <td :class="{success:item.isEnd=== '1'}">{{item.isEnd=== '0'?'未结':'已结帖'}}</td>
            <td>{{item.created | moment}}</td>
            <td>{{item.reads}}阅/{{item.answer}}答</td>
            <td>
              <div @click="editPost(item)" :class="{'layui-btn-disabled':item.isEnd === '1'}" class="layui-btn layui-btn-xs">编辑</div>
              <div class="layui-btn layui-btn-xs layui-btn-danger" @click="deletePost(item)">删除</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Pagination
      v-show="total>1"
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
import { getPostListByUid, deletePostByUid } from '@/api/user'
import Pagination from '@/components/modules/pagination/Index'
export default {
  name: 'myPost',
  props: {},
  data () {
    return {
      list: [],
      total: 0,
      current: 0,
      page: 0,
      limit: 10
    }
  },
  created () {},
  mounted () {
    this.getPostList()
  },
  computed: {},
  methods: {
    getPostList () {
      getPostListByUid({
        page: this.current,
        limit: this.limit
      }).then(res => {
        if (res.code === 200) {
          this.list = res.data
          this.total = res.total
        }
      })
    },
    // 删除数据
    deletePost (item) {
      this.$confirm(
        '确定删除吗？',
        () => {
          // 帖子已结帖，无法删除！
          if (item.isEnd !== '0') {
            this.$pop('shake', '帖子已结帖，无法删除！')
            return
          }
          deletePostByUid({
            tid: item._id
          }).then(res => {
            if (res.code === 200) {
              this.$pop('', '删除成功')
              // 重新请求列表数据
              this.getPostList()
            } else {
              this.$pop('shake', res.msg)
            }
          })
        },
        () => {}
      )
    },
    /// 点击页码处理（分页处理）
    handleChange (currentPage) {
      this.current = currentPage
      // 重新请求数据
      this.getPostList()
    },
    // 跳转编辑页面
    editPost (item) {
      if (item.isEnd === '1') {
        this.$pop('shake', '帖子已经结帖，无法编辑')
      } else {
        this.$router.push({
          name: 'edit',
          params: { tid: item._id, page: item }
        })
      }
    }
  },
  components: { Pagination },
  watch: {}
}
</script>
<style lang="scss" scoped>
.overflow {
  overflow-y: auto;
}
.min-cell {
  min-width: 80px;
}
.link{
  color: #01aaed;
}
.success{
  color: #5fb878;
}
.layui-table-header{
  th{
    text-align: center;
    &:first-child{
      text-align: left;
    }
  }
}
</style>
