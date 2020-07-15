<template>
  <div class="fly-panel fly-panel-user" pad20>
    <div class="layui-tab layui-tab-brief" lay-filter="user" id="LAY_msg" style="margin-top: 15px;">
      <button class="layui-btn layui-btn-danger" id="LAY_delallmsg">清空全部消息</button>
      <div id="LAY_minemsg" style="margin-top: 10px;">
        <!--<div class="fly-none">您暂时没有最新消息</div>-->
        <ul class="mine-msg">
          <li data-id="123">
            <blockquote class="layui-elem-quote">
              <a href="/jump?username=Absolutely" target="_blank">
                <cite>Absolutely</cite>
              </a>回答了您的求解
              <a target="_blank" href="/jie/8153.html/page/0/#item-1489505778669">
                <cite>layui后台框架</cite>
              </a>
            </blockquote>
            <p>
              <span>1小时前</span>
              <a
                href="javascript:;"
                class="layui-btn layui-btn-small layui-btn-danger fly-delete"
              >删除</a>
            </p>
          </li>
          <li data-id="123">
            <blockquote class="layui-elem-quote">系统消息：欢迎使用 layui</blockquote>
            <p>
              <span>1小时前</span>
              <a
                href="javascript:;"
                class="layui-btn layui-btn-small layui-btn-danger fly-delete"
              >删除</a>
            </p>
          </li>
        </ul>
          <Pagination
            v-show="total>0"
            ref="dyPagination"
            :showType="'icon'"
            :hasSelect="true"
            :hasTotal="true"
            :showEnd="true"
            :total="total"
            :size="limit"
            :current="page"
            :align="'left'"
            @changeCurrent="handleChange"
            @changeLimit="handLimit"
          />
      </div>
    </div>
  </div>
</template>

<script>
import { getMsg } from '@/api/user'
import Pagination from '@/components/modules/pagination/Index'
export default {
  name: 'user-msg',
  props: {},
  data () {
    return {
      lists: [],
      page: 0, // 当前页码
      limit: 10, // 默认每页多少条
      total: 100 // 总条数
    }
  },
  created () {},
  mounted () {
    this.getMsgAll()
  },
  computed: {},
  methods: {
    getMsgAll () {
      getMsg({
        page: this.page,
        limit: this.limit
      }).then(res => {
        if (res.code === 200) {
          this.lists = res.data
        }
      })
    },
    handLimit (limit) {
      // 修改limit的值
      // 每页显示的条数
      this.limit = limit
      // 获取文章评论列表随limit变化(会重复触发)
      // this.getCommentsList()
    },
    handleChange (currentPage) {
      this.page = currentPage
      // 获取文章评论列表随页码变化
      this.$nextTick(() => {
        this.getMsgAll()
      })
    }
  },
  components: { Pagination },
  watch: {}
}
</script>
<style lang="scss">
.wrapper {
}
</style>
