<template>
  <div>
    <div class="fly-panel" style="margin-bottom: 0;">
      <div class="fly-panel-title fly-filter">
        <a :class="{'layui-this':status === '' && tag === ''}" @click.prevent="search">综合</a>
        <span class="fly-mid"></span>
        <a :class="{'layui-this':status === '0' }" @click.prevent="search(0)">未结</a>
        <span class="fly-mid"></span>
        <a :class="{'layui-this':status === '1' }" @click.prevent="search(1)">已结</a>
        <span class="fly-mid"></span>
        <a :class="{'layui-this':status === '' && tag === '精华'}" @click.prevent="search(2)">精华</a>
        <span class="fly-filter-right layui-hide-xs">
          <a :class="{'layui-this':sort === 'created'}" @click.prevent="search(3)">按最新</a>
          <span class="fly-mid"></span>
          <a :class="{'layui-this':sort === 'answer'}" @click.prevent="search(4)">按热议</a>
        </span>
      </div>
      <ListItem :lists="lists" :is-end="isEnd" @nextpage="nextPage" />
    </div>
  </div>
</template>

<script>
import qs from 'qs'
// 可以不用import，nuxt会自动注册组件 component文件下
// import ListItem from './ListItem'
// import { getList } from '@/api/content'
export default {
  name: 'List',
  components: {
    // ListItem
  },
  props: {},
  // 数据预取的时候拿不到this对象
  async asyncData({ $axios }) {
    const options = {
      isTop: 0,
      page: 0,
      limit: 20,
      sort: 'created',
      status: '',
    }
    // 使用$axios.get result.data.data 获取数据   使用$axios.$get result.data获取数据
    const result = await $axios.$get('/public/list?' + qs.stringify(options))
    return {
      lists: result.data || [],
    }
  },
  data() {
    return {
      isEnd: false, // 是否请求到了最后一页
      isRepeat: false, // 发否多次请求
      current: '', // 切换 精华，已结帖，未结，综合
      status: '',
      tag: '',
      sort: 'created',
      page: 0,
      limit: 20,
      catalog: '',
      isTop: 0,
      lists: [
        // {
        //   uid: {
        //     name: 'imooc',
        //     isVip: 1
        //   },
        //   title: '大前端课程',
        //   content: '',
        //   created: '2020-05-18 01:00:00',
        //   catalog: 'ask',
        //   fav: 40,
        //   isEnd: 0,
        //   reads: 10,
        //   answer: 0,
        //   status: 0,
        //   isTop: 0,
        //   tags: [
        //     {
        //       name: '精华',
        //       class: 'layui-bg-red'
        //     },
        //     {
        //       name: '热门',
        //       class: 'layui-bg-blue'
        //     }
        //   ]
        // }
      ],
    }
  },
  computed: {},
  watch: {
    current(newVal, oldVal) {
      // 刚开始刷新页面，监视都不执行，离开当前组件的话，也不执行
      // console.log(123456)
      // 做另一个导航列表的重置操作
      this.init()
    },
    $route(newVal, oldVal) {
      // 刷新当前页面的话，监视路由 不执行
      // 切换头部导航，
      // console.log(this.$route.params)
      const catalog = this.$route.params.catalog
      if (typeof catalog !== 'undefined' && catalog !== '') {
        this.catalog = catalog
      }
      this.init()
    },
  },
  created() {},
  mounted() {
    // 切换头部导航，
    // console.log(this.$route.params)
    const catalog = this.$route.params.catalog
    if (typeof catalog !== 'undefined' && catalog !== '') {
      this.catalog = catalog
    }
    // 已经数据预取了，就不需要了
    // this._getLists()
  },
  methods: {
    _getLists() {
      // isRepeat为true，相当于请求没有处理完，数据没有返回
      // if (this.isRepeat) return
      // 如果到最后一页，直接return，不再发请求
      if (this.isEnd) return
      this.isRepeat = true
      const options = {
        catalog: this.catalog,
        isTop: 0,
        page: this.page,
        limit: this.limit,
        sort: this.sort,
        tag: this.tag,
        status: this.status,
      }
      this.$axios
        .$get('/public/list?' + qs.stringify(options))
        .then((res) => {
          // 加入一个请求锁，防止用户多次点击，等数据返回了再打开   请求处理完成，
          this.isRepeat = false

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
        })
        .catch((err) => {
          // console.log(err)
          this.isRepeat = false
          if (err) {
            this.$alert(err.message)
          }
        })
    },
    nextPage() {
      this.page++
      this._getLists()
    },
    search(val) {
      if (typeof val === 'undefined' && this.current === '') {
        return
      }
      this.current = val
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
          this.current = ''
          break
      }
    },
    init() {
      this.page = 0
      this.isEnd = false
      this.lists = []
      this._getLists()
    },
  },
}
</script>
<style lang="scss">
.list {
}
</style>
