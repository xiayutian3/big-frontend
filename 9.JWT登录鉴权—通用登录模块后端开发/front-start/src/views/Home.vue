<template>
  <div class="home">
    <Panel />
<router-view></router-view>
  </div>
</template>

<script>
import Panel from '@/components/Panel'
export default {
  name: 'home',
  props: {},
  data () {
    return {}
  },
  created () {},
  mounted () {},
  computed: {},
  methods: {},
  components: {
    Panel
  },
  watch: {}
}
</script>
<style lang="scss">
.home {
}
</style>
