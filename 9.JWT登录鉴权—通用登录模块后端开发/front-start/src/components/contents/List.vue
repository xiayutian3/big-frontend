<template>
  <div>
    <div class="fly-panel" style="margin-bottom: 0;">
      <div class="fly-panel-title fly-filter">
        <a :class="{'layui-this':status === '' && tag === ''}" @click.prevent="search">综合</a>
        <span class="fly-mid"></span>
        <a :class="{'layui-this':status === '0' }"  @click.prevent="search(0)">未结</a>
        <span class="fly-mid"></span>
        <a :class="{'layui-this':status === '1' }"  @click.prevent="search(1)">已结</a>
        <span class="fly-mid"></span>
        <a :class="{'layui-this':status === '' && tag === '精华'}"  @click.prevent="search(2)">精华</a>
        <span class="fly-filter-right layui-hide-xs">
          <a :class="{'layui-this':sort === 'created'}"  @click.prevent="search(3)">按最新</a>
          <span class="fly-mid"></span>
          <a :class="{'layui-this':sort === 'answer'}"  @click.prevent="search(4)">按热议</a>
        </span>
      </div>
      <ListItem :lists="lists" @nextpage="nextPage" :isEnd="isEnd"/>
    </div>
  </div>
</template>

<script>
import { getList } from '@/api/content'
import ListItem from './ListItem'
export default {
  name: 'list',
  props: {},
  data () {
    return {
      isEnd: false,
      status: '',
      tag: '',
      sort: 'created',
      page: 0,
      limit: 20,
      catalog: '',
      lists: [
        {
          uid: {
            name: 'imooc',
            isVip: 1
          },
          title: '大前端课程',
          content: '',
          created: '2020-5-18 01:00:00',
          catalog: 'ask',
          fav: 40,
          isEnd: 0,
          reads: 10,
          answer: 0,
          status: 0,
          isTop: 0,
          tags: [
            {
              name: '精华',
              class: 'layui-bg-red'
            },
            {
              name: '热门',
              class: 'layui-bg-blue'
            }
          ]
        }
      ]
    }
  },
  created () {},
  mounted () {
    this._getLists()
  },
  computed: {},
  methods: {
    _getLists () {
      // 如果到最后一页，直接return，不再发请求
      if (this.isEnd) return
      let options = {
        catalog: this.catalog,
        isTop: 0,
        page: this.page,
        limit: this.limit,
        sort: this.sort,
        tag: this.tag,
        status: this.status
      }
      getList(options).then(res => {
        // console.log('_getLists -> res', res)

        // 对于异常的判断，res，code 非200， 我们给用户一个提示
        // 判断是否lists长度为0，如果是为零即可直接赋值
        // 当lists长度不为0，后边的请求数据，加入到lists中
        if (res.code === 200) {
          // 判断res.datade长度，如果小于20条，则是最后一页的数据（默认一页20条）

          if (res.data.length < this.limit) {
            this.isEnd = true
          }
          if (this.lists.length === 0) {
            this.lists = res.data
          } else {
            this.lists = this.lists.concat(res.data)
          }
        }
      }).catch(err => {
        if (err) {
          this.$alert(err.msg)
        }
      })
    },
    nextPage () {
      this.page++
      this._getLists()
    },
    search (val) {
      switch (val) {
        // 未结帖
        case 0:
          this.status = '0'
          this.tag = ''
          break
          // 已结帖
        case 1:
          this.status = '1'
          this.tag = ''
          break
          // 查询 精华 标签
        case 2:
          this.status = ''
          this.tag = '精华'
          break
          // 按时间去查询
        case 3:
          this.sort = 'created'
          break
          // 按评论数去查询
        case 4:
          this.sort = 'answer'
          break
          // 综合
        default:
          this.status = ''
          this.tag = ''
          break
      }
    }
  },
  components: {
    ListItem
  },
  watch: {}
}
</script>
<style lang="scss">
.list {
}
</style>
