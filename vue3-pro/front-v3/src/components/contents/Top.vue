<template>
     <div class="fly-panel" v-show="state.lists.length>0">
      <div class="fly-panel-title fly-filter">
        <a>置顶</a>
        <a
          href="#signin"
          class="layui-hide-sm layui-show-xs-block fly-right"
          id="LAY_goSignin"
          style="color: #FF5722;"
        >去签到</a>
      </div>
      <ListItem :lists="state.lists" :isShow="false"/>
    </div>
</template>

<script lang="ts">
import { listService } from '@/common/provides/list'
import { defineComponent, onMounted } from 'vue'
import ListItem from './ListItem.vue'
// import { getList } from '@/api/content'
export default defineComponent({
  name: 'top',
  props: {},

  setup () {
    const {
      state,
      handleGetList
    } = listService()
    // 修改 isTop的值 为1
    state.isTop = 1

    onMounted(() => {
      setTimeout(() => {
        handleGetList()
      }, 100)
    })

    return {
      state
    }
  },

  //  vue 2前的样子

  // data () {
  //   return {
  //     isTop: 0,
  //     sort: '',
  //     tag: '',
  //     page: 0,
  //     status: 20,
  //     lists: [
  //       {
  //         uid: {
  //           name: 'imooc',
  //           isVip: 1
  //         },
  //         title: '大前端课程',
  //         content: '',
  //         created: '2020-5-18 01:00:00',
  //         catalog: 'ask',
  //         fav: 40,
  //         isEnd: 0,
  //         reads: 10,
  //         answer: 0,
  //         status: 0,
  //         isTop: 1,
  //         tags: [
  //           {
  //             name: '精华',
  //             class: 'layui-bg-red'
  //           },
  //           {
  //             name: '热门',
  //             class: 'layui-bg-blue'
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // },
  // created () {
  //   this._getLists()
  // },
  // methods: {
  //   _getLists () {
  //     // isRepeat为true，相当于请求没有处理完，数据没有返回
  //     // if (this.isRepeat) return
  //     // 如果到最后一页，直接return，不再发请求
  //     if (this.isEnd) return
  //     this.isRepeat = true
  //     const options = {
  //       isTop: 0,
  //       sort: this.sort,
  //       tag: this.tag,
  //       status: this.status
  //     }
  //     getList(options).then(res => {
  //       if (res.code === 200) {
  //         this.lists = res.data
  //       }
  //     }).catch(err => {
  //       console.log(err)
  //       this.isRepeat = false
  //       if (err) {
  //         this.$alert(err.message)
  //       }
  //     })
  //   }
  // },
  components: {
    ListItem
  }
})
</script>
<style lang="scss">
</style>
