<template>
  <div>
    <Row type="flex" align="middle">
      <Col class="overtext" span="18">{{row.param}}</Col>
      <Col span="6">
      <a @click="more" style="padding-left:6px">更多>></a>
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
  methods: {
    more () {
      this.$Modal.info({
        title: '详情',
        // content: JSON.stringify(this.row.params)
        render: (h, params) => {
          return h('Input', {
            props: {
              disabled: true,
              type: 'textarea',
              value: JSON.stringify(this.row.params, null, 2),
              rows: 16
            }
          })
        }
      })
    }
  },
  components: {},
  watch: {}
}
</script>
<style lang="less">
.overtext{
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}
</style>
