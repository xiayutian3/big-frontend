<template>
  <div class="wrapper">
    <slot></slot>
    <my-footer></my-footer>
  </div>
</template>

<script>
export default {
  name: 'Layout',
  props: {},
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {
  },
  watch: {}
}
</script>
<style lang="scss" scoped>
.wrapper {
  padding-bottom: $footer-height;
}
</style>
