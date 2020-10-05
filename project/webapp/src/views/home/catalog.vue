<template>
  <div>
    <scroll
      :distance="56"
      :isEnd="isEnd"
      @on-loadTop="loadTop"
      @on-loadBottom="loadBottom"
    >
      <ul>
        <!-- <list-item
          v-for="(item,index) in lists"
          :key="'catalog' + index"
          :item="item"
          @on-show-user="goUser"
          @on-show-detail="goDetail"
        ></list-item> -->
        <li v-for="(item,index) in lists"
          :key="'catalog' + index">{{item}}</li>
      </ul>
    </scroll>
  </div>
</template>

<script>
import { getList } from '@/api/content'
export default {
  name: 'catalog',
  props: ['catalog'],
  data () {
    return {
      page: 0,
      limit: 10,
      // catalog: '',
      lists: [],
      isEnd: false
    }
  },
  watch: {

  },
  mounted () {
    this._getList()
  },
  methods: {
    loadTop (end) {
      this.page = 0
      this._getList(end)
    },
    loadBottom (end) {
      this.page++
      this._getList(end)
    },
    _getList (fn) {
      getList({
        page: this.page,
        limit: this.limit
      }).then(res => {
        if (res.code === 200) {
          this.lists = res.data
        }
        if (typeof fn === 'function') {
          fn()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
ul {
  padding: 0;
  margin: 0;
  background-color: #f3f6f8;
}
</style>
