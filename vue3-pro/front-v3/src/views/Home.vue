<template>
  <div class="home">
    <Panel />
    <router-view></router-view>
  </div>
</template>

<script lang="ts">
import Panel from '@/components/Panel.vue'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'home',
  props: {},
  data () {
    return {}
  },
  computed: {},
  methods: {},
  components: {
    Panel
  },
  watch: {}
})
</script>
<style lang="scss">
.home {
}
</style>
