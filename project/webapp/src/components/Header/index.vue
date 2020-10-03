<template>
  <div class="header" :style="{ zIndex: zIndex, 'background-color': bkColor }">
    <div class="head-left" @click="goback">
      <slot name="h-left">
        <svg-icon icon="arrow-left"></svg-icon>
        <span class="left-text" v-if="backText">{{ backText }}</span>
      </slot>
    </div>
    <div class="head-content">
      <slot name="h-content">
        <span>{{ title }}</span>
      </slot>
    </div>
    <div class="head-right">
      <slot name="h-right"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-header',
  props: {
    title: {
      type: String,
      default: ''
    },
    backText: {
      type: String,
      default: '返回'
    },
    zIndex: {
      type: Number,
      default: 0
    },
    back: {
      type: Function
    },
    bkColor: {
      type: String
    },
    hasBack: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {
    goback () {
      if (this.back) {
        this.back()
        return
      }
      this.$router.go(-1)
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="scss">
.header {
}
</style>
