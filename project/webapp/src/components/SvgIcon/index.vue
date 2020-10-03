<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="symbolName"></use>
  </svg>
</template>

<script>
// webpack 自带读取文件 当前目录的svg的文件 .svg结尾
const req = require.context('@/assets/icons/svg', false, /\.svg$/)
// console.log('req', typeof req) // 函数
// console.log('req.keys()', req.keys()) // ["./xx.svg", "./xx.svg",...]

// 类似于遍历所有的svg ["./xx.svg",...],把他们变成一个个模块导出
const requireAll = (requireContext) => requireContext.keys().map(requireContext)

requireAll(req)
// console.log('reqAll', requireAll(req))
export default {
  name: 'svg-icon',
  props: {
    icon: {
      type: String,
      required: true
    },
    className: {
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
      if (this.className) {
        return 'svg-icon ' + this.className
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
