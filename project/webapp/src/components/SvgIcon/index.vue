<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="symbolName"></use>
  </svg>
</template>

<script>
export default {
  name: '',
  props: {
    icon: {
      type: String,
      required: true
    },
    class: {
      type: String,
      defaultL: ''
    }
  },
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {
    symbolName () {
      return `#icon-${this.icon}`
    },
    svgClass () {
      if (this.class) {
        return 'svg-icon ' + this.class
      } else {
        return 'svg-icon'
      }
    }
  },
  methods: {},
  components: {},
  watch: {}
}
</script>
<style lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
