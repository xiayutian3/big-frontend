<template>
  <div >
    hello world1{{item}}
  </div>
</template>

<script>
export default {
  name: 'hello1',
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