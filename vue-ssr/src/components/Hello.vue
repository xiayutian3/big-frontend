<template>
  <div >
    hello world!{{item}}
  <div></div>
  <router-link to="/hello1"> hello1 link</router-link>
  </div>
</template>

<script>
export default {
  name: 'hello',
  props: {},
  //组件形成之前，是拿不到实例的，不能用this (数据预取)
  asyncData({store}){
    return store.dispatch('getDataAction')
  },
  data(){
    return {
    }
  },
  created(){},
  mounted(){},
  computed:{
    item(){
      return this.$store.state.lists
    }
  },
  methods:{},
  components:{},
  watch:{},
}
</script>
<style lang="scss">
</style>