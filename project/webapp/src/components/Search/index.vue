<template>
  <div class="search-wrap" ref="search">
    <slot name="h-left"></slot>
    <div class="search-block" :class="{ searching: searchText }">
      <i class="mintui mintui-search"></i>
      <input
        type="text"
        class="in"
        v-model="searchText"
        :placeholder="placeHolderIn"
      />
      <span @click.stop="onClear">
        <svg-icon
          icon="close"
          :class="'svg-icon-close'"
          v-if="searchText"
        ></svg-icon>
      </span>
    </div>
    <div class="clearText" v-show="searchText" @click.stop="onSearch">确定</div>
    <slot name="h-right"></slot>
  </div>
</template>

<script>
export default {
  name: 'search',
  props: {
    placeHolderIn: {
      type: String,
      default: '搜索社区内容'
    }
  },
  data () {
    return {
      searchText: ''
    }
  },
  created () {},
  mounted () {
    // 禁止向下滑动search组件，造成body的向下滑动（特别是微信浏览器）
    const elem = this.$refs.search
    window.forbidScroll(elem)
  },
  computed: {},
  methods: {
    onClear () {
      console.log('onClear -> this.searchText', this.searchText)
      this.searchText = ''
      setTimeout(() => {
        this.$emit('on-clear')
      }, 0)
    },
    onSearch () {
      console.log('onClear -> this.searchText', this.searchText)
      this.$emit('on-search', this.searchText)
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss">
@import "./search.scss";
</style>
