<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    {{ counter + counter1 }}
    <button type="button" @click="add">增加</button>
    <button type="button" @click="add2">增加2</button>
    <HomeChild id="5" :propeName="counter" @minusevent = "minusEventHandler"/>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HomeChild from './HomeChild.vue'
import { utils } from './home'
// 数据初始化
// const stateUtils = utils()

export default defineComponent({
  name: 'Home',
  components: {
    HomeChild
  },
  data () {
    return {
      counter1: 0
    }
  },
  methods: {
    add2 () {
      this.counter1++
    }
  },
  setup () {
    return {
      ...utils()
    }
  }

})
</script>
