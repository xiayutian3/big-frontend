<template>
  <div>
    <Row>
      错误代码：{{row.path}}-{{row.method}}-{{row.code}}
      <Col span="24">
      <p>Stack:</p>
      <p>{{row.stack}}</p>
      </Col>
    </Row>
  </div>
</template>

<script>
export default {
  name: '',
  props: {
    row: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
    }
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {},
  watch: {}
}
</script>
<style lang="less">
.wrapper{}
</style>
