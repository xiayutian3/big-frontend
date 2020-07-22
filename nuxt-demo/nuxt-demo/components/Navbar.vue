<template>
  <div class="wrapper">
    <nuxt-link class="link" to="/create">create</nuxt-link>
    <nuxt-link class="link" to="/list">list</nuxt-link>
    <nuxt-link class="link" to="/about">about</nuxt-link>
  </div>
</template>

<script>
export default {
  name: '',
  components: {},
  props: {},
  data() {
    return {}
  },
  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {},
}
</script>
<style lang="scss">
.wrapper {
  .link {
    margin-right: 10px;
  }
}
</style>
