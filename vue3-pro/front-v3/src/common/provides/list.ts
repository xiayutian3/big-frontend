import { getList } from '@/api/content'
import { reactive } from 'vue'
import { useRoute } from 'vue-router'
import { HttpResponse } from '../interface'

export const listService = () => {
  const state = reactive({
    isEnd: false, // 是否请求到了最后一页
    isRepeat: false, // 发否多次请求
    current: '', // 切换 精华，已结帖，未结，综合
    status: '',
    tag: '',
    sort: 'created',
    page: 0,
    limit: 20,
    catalog: '',
    lists: [],
    isTop: 0
  })

  // 监听路由参数
  const route = useRoute()
  // console.log('~ route', route.params)  //可以拿到参数
  const catalog = route?.params?.catalog as string
  // state.catalog = catalog || '' // 可以
  // 或者
  if (typeof catalog !== 'undefined' && catalog !== '') {
    state.catalog = catalog
  }
  // state.catalog = route?.params?.catalog || ''  // type 报错

  // 请求数据的方法
  const handleGetList = async () => {
    if (state.isEnd) return
    if (state.isRepeat) return
    // 请求锁
    state.isRepeat = true
    const options = {
      catalog: state.catalog,
      isTop: 0,
      page: state.page,
      limit: state.limit,
      sort: state.sort,
      tag: state.tag,
      status: state.status
    }
    try {
      const res = await getList(options) as HttpResponse
      // 加入一个请求锁，防止用户多次点击，等数据返回了再打开   请求处理完成，
      state.isRepeat = false

      // console.log('_getLists -> res', res)

      // 对于异常的判断，res，code 非200， 我们给用户一个提示
      // 判断是否lists长度为0，如果是为零即可直接赋值
      // 当lists长度不为0，后边的请求数据，加入到lists中
      if (res.code === 200) {
        // 判断res.datade长度，如果小于20条，则是最后一页的数据（默认一页20条）

        if (res.data.length < state.limit) {
          state.isEnd = true
        }
        if (state.lists.length === 0) {
          state.lists = res.data
        } else {
          state.lists = state.lists.concat(res.data)
        }
      }
    } catch (error) {
      console.log(error)
      state.isRepeat = false
      if (error) {
        // this.$alert(err.message)
      }
    }
  }

  // 初始化
  const init = () => {
    state.page = 0
    state.isEnd = false
    state.lists = []
    handleGetList()
  }

  // 下一页
  const nextPage = () => {
    state.page++
    handleGetList()
  }
  const search = (val: number|null) => {
    if (typeof val === 'undefined' && state.current === '') {
      return
    }
    state.current = val ? val + '' : ''
    switch (val) {
      // 未结帖
      case 0:
        state.status = '0'
        state.tag = ''
        break
        // 已结帖
      case 1:
        state.status = '1'
        state.tag = ''
        break
        // 查询 精华 标签
      case 2:
        state.status = ''
        state.tag = '精华'
        break
        // 按时间去查询
      case 3:
        state.sort = 'created'
        break
        // 按评论数去查询
      case 4:
        state.sort = 'answer'
        break
        // 综合
      default:
        state.status = ''
        state.tag = ''
        state.current = ''
        break
    }
  }

  return {
    state,
    search,
    nextPage,
    init,
    handleGetList
  }
}
